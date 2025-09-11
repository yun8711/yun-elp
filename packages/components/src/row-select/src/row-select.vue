<template>
  <div
    class="y-row-select"
    :style="{
      '--duration': props.duration + 'ms',
      '--item-height': itemHeight,
      '--item-width': itemWidth,
      '--height': isFold ? minHeight + 'px' : maxHeight + 'px',
      '--gap': gap
    }"
  >
    <!-- 左侧 label -->
    <div
      class="y-row-select__label"
      :class="{ 'y-row-select__label--separator': props.separator }"
      :style="labelStyles"
    >
      {{ props.labelText }}
    </div>

    <!-- 中间选项列表 -->
    <div class="y-row-select__options-container">
      <div ref="optionsBoxRef" class="y-row-select__options" @click="onItemClick">
        <!-- "全部"选项 -->
        <template v-if="props.showAll">
          <div
            class="y-row-select__item"
            :class="{ 'is-active': selectAll }"
            :style="optionsItemStyles"
            data-index="$all"
          >
            <slot name="all">
              {{ props.allText }}
            </slot>
          </div>
        </template>

        <!-- 选项列表 -->
        <div
          v-for="(item, index) in options"
          :key="index"
          class="y-row-select__item"
          :class="{
            'is-active': isItemSelected(item),
            'is-disabled': item[props.defineProps?.disabled || 'disabled']
          }"
          :style="optionsItemStyles"
          :data-index="
            item[props.defineProps?.disabled || 'disabled']
              ? undefined
              : item[props.defineProps?.value || 'value']
          "
        >
          <div class="y-row-select__item-text">
            <slot v-bind="item" :index="index">
              {{ item[props.defineProps?.label || 'label'] }}
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧展开/收起按钮 -->
    <div class="y-row-select__fold">
      <div
        v-if="showMore"
        class="y-row-select__fold-inner"
        :style="btnStyles"
        @click="() => trigger()"
      >
        <el-icon class="el-icon--right" :class="{ 'el-icon--right--reverse': !isFold }">
          <ArrowDown />
        </el-icon>
        <div class="y-row-select__fold-text">
          {{ isFold ? props.foldText : props.unfoldText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from '@vue/runtime-core';
import { getSizeValue } from '../../../utils/other';
import type { RowSelectProps } from './row-select';

defineOptions({
  name: 'YRowSelect',
  inheritAttrs: false
});

// 定义组件属性，默认按多选模式
const props = withDefaults(defineProps<RowSelectProps>(), {
  modelValue: '',
  single: false, // 是否单选
  duration: 200, // 折叠动画时长
  defaultLines: 1, // 默认显示行数
  labelWidth: 'auto', // label宽度
  labelAlign: 'left', // label水平对齐方式
  labelText: '选项', // label文字
  separator: true, // 是否显示分隔符
  labelStyles: () => ({}), // label文字的样式
  foldText: '更多', // 折叠状态时文字
  unfoldText: '收起', // 展开状态时文字
  showIcon: true, // 是否显示图标
  iconPosition: 'left',
  btnStyles: () => ({}), // 按钮的样式
  options: () => [],
  showAll: true,
  allText: '全部',
  itemWidth: 'auto',
  itemHeight: '24px',
  gap: '8',
  defineProps: () => ({ label: 'label', value: 'value', disabled: 'disabled' }),
  itemStyles: () => ({})
});

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | number | number[]];
  change: [value: string | string[] | number | number[]];
  fold: [value: boolean];
}>();

// 响应式数据
const optionsBoxRef = ref<HTMLElement>();
const isFold = ref(true); // true收false开
const showMore = ref(true); // 初始化为false，等检查后再决定
const keySet = ref(new Set<string>());

// label样式
const labelStyles = computed(() => {
  return {
    width: props.labelWidth,
    'text-align': props.labelAlign,
    ...props.labelStyles
  };
});

// 按钮样式
const btnStyles = computed(() => {
  return {
    ...props.btnStyles,
    flexDirection: (props.iconPosition === 'left' ? 'row' : 'row-reverse') as any
  };
});

// 选项宽度
const itemWidth = computed(() => {
  return getSizeValue(props.itemWidth);
});
// 选项高度
const itemHeight = computed(() => {
  return getSizeValue(props.itemHeight);
});
// 选项间距
const gap = computed(() => {
  const gapArr = props.gap.split(',');
  return gapArr.map((item: string) => (item.match(/^\d+$/) ? item + 'px' : item)).join(' ');
});
// 垂直间距，用于计算高度,去除单位，返回数字
const rowGap = computed(() => {
  const gapArr = props.gap.includes(',') ? props.gap.split(',') : [props.gap, props.gap];
  // 确保返回有效的数字，去除可能的px单位
  const gapValue = gapArr[1] || gapArr[0];
  return parseInt(gapValue.replace('px', ''), 10) || 8;
});

const optionsItemStyles = computed(() => {
  return {
    width: itemWidth.value,
    height: itemHeight.value,
    ...props.itemStyles
  };
});

// 是否选中“全部”
const selectAll = computed(() => {
  let b = true;
  if (props.showAll) {
    if (!props.single) {
      b = (props.modelValue as any[])?.length === 0;
    } else {
      // 修复：在单选模式下，需要区分 0 和空字符串
      // 当 modelValue 为 undefined、null、空字符串时，才认为是选中"全部"
      b = props.modelValue === undefined || props.modelValue === null || props.modelValue === '';
    }
  } else {
    b = false;
  }
  return b;
});

// 计算属性，选中项的值
const selectedKey = computed({
  get() {
    let v;
    if (!props.single) {
      // 在多选模式下，优先使用 keySet 的值，如果没有则使用 modelValue
      if (keySet.value.size > 0) {
        // 返回与选项 value 类型一致的数据
        v = Array.from(keySet.value).map(k => {
          const option = props.options.find(
            (item: any) => String(item[props.defineProps.value]) === k
          );
          return option ? option[props.defineProps.value] : k;
        });
      } else {
        v = props.modelValue || [];
      }
    } else {
      // 修复：在单选模式下，需要正确处理 0 值
      v = props.modelValue !== undefined && props.modelValue !== null ? props.modelValue : '';
    }
    return v;
  },
  set(val: string | string[] | number | number[]) {
    if (!props.single) {
      emit('update:modelValue', val || []);
    } else {
      // 修复：在单选模式下，需要正确处理 0 值
      emit('update:modelValue', val !== undefined && val !== null ? val : '');
    }
  }
});

// 选项是否被选中
const isItemSelected = (item: any) => {
  return (
    !selectAll.value &&
    (props.single
      ? selectedKey.value === item[props.defineProps.value]
      : (selectedKey.value as any[]).includes(item[props.defineProps.value]))
  );
};

const onItemClick = (e: Event) => {
  // 查找包含 data-index 的元素（可能是目标元素或其父元素）
  let element = e.target as HTMLElement;
  let key = element.dataset.index;

  // 点击选项任意位置，都触发选中
  while (!key && element.parentElement) {
    element = element.parentElement;
    key = element.dataset.index;
  }

  if (!key) return;
  // 返回的值
  let res: string | string[] | number | number[];

  if (!props.single) {
    if (key === '$all') {
      // 选中“全部”时，清空选中项
      keySet.value.clear();
      res = [];
    } else {
      // 统一使用字符串进行匹配
      const option = props.options.find((item: any) => {
        const itemValue = item[props.defineProps.value];
        return key === String(itemValue);
      });

      if (option) {
        const optionValue = option[props.defineProps.value];
        const hasKey = keySet.value.has(optionValue);
        if (hasKey) {
          keySet.value.delete(optionValue);
        } else {
          keySet.value.add(optionValue);
        }
      }
      // 返回原始值类型的数据
      res = Array.from(keySet.value).map(keyStr => {
        const option = props.options.find(
          (item: any) => String(item[props.defineProps.value]) === keyStr
        );
        return option ? option[props.defineProps.value] : keyStr;
      });
    }
  } else {
    if (key === '$all') {
      res = '';
    } else {
      // 统一使用字符串进行匹配
      const option = props.options.find((item: any) => {
        const itemValue = item[props.defineProps.value];
        return key === String(itemValue);
      });

      if (option) {
        // 返回原始值类型的数据
        res = option[props.defineProps.value];
      } else {
        res = '';
      }
    }
  }

  selectedKey.value = res;
  emit('change', res);
};

const trigger = (fold?: boolean) => {
  // 计算目标状态
  isFold.value = fold ?? !isFold.value;

  emit('fold', isFold.value);
};

// 组件最小显示高度
const minHeight = computed(() => {
  // 确保itemHeight是数字
  const itemHeightNum =
    typeof props.itemHeight === 'string'
      ? parseInt(props.itemHeight, 10) || 24
      : props.itemHeight || 24;

  return itemHeightNum * props.defaultLines + (props.defaultLines - 1) * rowGap.value;
});
const maxHeight = ref(0); // 初始化为0，等待updateMaxHeight计算
// 更新最大高度
const updateMaxHeight = () => {
  let canShowMore = false;
  if (optionsBoxRef.value) {
    const element = optionsBoxRef.value;
    // 实际需要的高度
    const realHeight = element.scrollHeight;
    if (realHeight > minHeight.value) {
      canShowMore = true;
      maxHeight.value = realHeight;
    }
  }

  showMore.value = canShowMore;
};

// 监听 modelValue 变化，同步到 keySet
watch(
  () => props.modelValue,
  (newValue: string | string[] | number | number[]) => {
    if (!props.single) {
      keySet.value.clear();
      if ((newValue as any[])?.length > 0) {
        (newValue as any[])?.forEach((item: string) => {
          keySet.value.add(item);
        });
      }
    }
  },
  { immediate: true }
);

// 监听容器宽度变化，重新计算高度
let resizeTimeout: number | null = null;
const debouncedResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(() => {
    // // 重新计算最大高度
    updateMaxHeight();
  }, 100) as any;
};

// 生命周期
onMounted(() => {
  // 初始化默认选中项
  if (!props.single) {
    keySet.value.clear();
    if ((props.modelValue as any[])?.length > 0) {
      (props.modelValue as any[])?.forEach((item: string) => {
        keySet.value.add(item);
      });
    }
  }

  // 添加 resize 监听器
  if (optionsBoxRef.value) {
    const resizeObserver = new ResizeObserver(debouncedResize);
    resizeObserver.observe(optionsBoxRef.value);

    // 保存引用以便清理
    const cleanup = () => {
      if (optionsBoxRef.value) {
        resizeObserver.unobserve(optionsBoxRef.value);
      }
      resizeObserver.disconnect();
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };

    onBeforeUnmount(cleanup);
  }

  // 初始化时计算高度
  nextTick(() => {
    updateMaxHeight();
  });
});

// 暴露方法给父组件
defineExpose({
  trigger,
  clear: () => {
    keySet.value.clear();
    selectedKey.value = '';
    emit('change', '');
  },
  reset: () => {
    isFold.value = true;
    keySet.value.clear();
    selectedKey.value = '';
    emit('change', '');
  }
});
</script>
