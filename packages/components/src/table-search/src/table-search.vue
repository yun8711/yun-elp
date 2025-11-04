<template>
  <div class="y-table-search">
    <div class="y-table-search__left" :class="{ 'y-table-search__left-show-more': hasMore }">
      <!-- 不区分多行时 -->
      <template v-if="!hasMore">
        <div class="y-table-search__left-all">
          <y-border-label
            v-for="item in firstOptions.filter((item: TableSearchItem) => !item.hidden)"
            :key="item.prop"
            v-bind="item.borderAttrs"
          >
            <template v-if="item.custom">
              <slot
                :name="item.prop"
                :prop="item.prop"
                :value="form[item.prop]"
                :item="item"
                :form="form"
              />
            </template>
            <template v-else>
              <component
                :is="item.comp"
                v-model="form[item.prop]"
                v-bind="item.innerAttrs"
                @update:model-value="handleValueUpdate(item.prop, $event)"
              />
            </template>
          </y-border-label>
          <div>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </div>
        </div>
      </template>
      <!-- 区分多行时 -->
      <template v-else>
        <!-- 第一行 -->
        <div class="y-table-search__left-first">
          <y-border-label
            v-for="item in firstOptions.filter((item: TableSearchItem) => !item.hidden)"
            :key="item.prop"
            v-bind="item.borderAttrs"
          >
            <template v-if="item.custom">
              <slot
                :name="item.prop"
                :prop="item.prop"
                :value="form[item.prop]"
                :item="item"
                :form="form"
              />
            </template>
            <template v-else>
              <component
                :is="item.comp"
                v-model="form[item.prop]"
                v-bind="item.innerAttrs"
                @update:model-value="handleValueUpdate(item.prop, $event)"
              />
            </template>
          </y-border-label>

          <div>
            <el-button type="primary" @click="onSearch">查询</el-button>
            <el-button @click="onReset">重置</el-button>
            <el-link style="margin-left: 8px" underline="never" @click="toggleFold">
              {{ isFold ? unFoldText : foldText }}
              <el-icon class="el-icon--right">
                <ArrowDown v-if="isFold" />
                <ArrowUp v-else />
              </el-icon>
            </el-link>
          </div>
        </div>
        <!-- 使用 Transition 包裹 -->
        <el-collapse-transition :style="{ 'transition-duration': `${props.duration}s` }">
          <div v-show="!isFold" class="y-table-search__left-more">
            <y-border-label
              v-for="item in moreOptions.filter((item: TableSearchItem) => !item.hidden)"
              :key="item.prop"
              v-bind="item.borderAttrs"
            >
              <template v-if="item.custom">
                <slot
                  :name="item.prop"
                  :prop="item.prop"
                  :value="form[item.prop]"
                  :item="item"
                  :form="form"
                />
              </template>
              <template v-else>
                <component
                  :is="item.comp"
                  v-model="form[item.prop]"
                  v-bind="item.innerAttrs"
                  @update:model-value="handleValueUpdate(item.prop, $event)"
                />
              </template>
            </y-border-label>
          </div>
        </el-collapse-transition>
      </template>
    </div>

    <div v-if="$slots.right" class="y-table-search__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, markRaw } from '@vue/runtime-core';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import YBorderLabel from '../../border-label/src/border-label.vue';
import type {
  TableSearchProps,
  TableSearchOption,
  TableSearchItem,
  DynamicPropsParams,
  TableSearchEmits
} from './table-search';
// @ts-ignore
import { ElCollapseTransition, ElInput, ElAutocomplete } from 'element-plus';

defineOptions({
  name: 'YTableSearch',
  inheritAttrs: true
});

// ==================== Props & Emits ====================
const props = withDefaults(defineProps<TableSearchProps>(), {
  foldText: '',
  unFoldText: '',
  defaultFold: false,
  duration: 0.2,
  disabledFirst: true,
  clearOnFold: true
});

const emits = defineEmits<TableSearchEmits>();

// ==================== 配置获取 ====================
const borderLabelConfig = useAppConfig('border-label');
const tableSearchConfig = useAppConfig('table-search');

// ==================== 响应式数据 ====================
const isFold = ref(props.defaultFold);
const form = ref<Record<string, any>>({}); // 原始绑定值
const formatForm = ref<Record<string, any>>({}); // 格式化后的值
const firstOptions = ref<TableSearchItem[]>([]);
const moreOptions = ref<TableSearchItem[]>([]);

// ==================== 计算属性 ====================
const foldText = computed(() => {
  return props.foldText || tableSearchConfig?.foldText || '收起';
});

const unFoldText = computed(() => {
  return props.unFoldText || tableSearchConfig?.unFoldText || '高级搜索';
});

const hasMore = computed(() => {
  const options = getCurrentOptions();
  const firstOptions = options.filter((item: TableSearchOption) => item.first === true);
  return (
    firstOptions.length !== 0 && options.length !== 1 && firstOptions.length !== options.length
  );
});

// ==================== 工具函数 ====================
/**
 * 获取当前选项列表
 */
function getCurrentOptions(): TableSearchOption[] {
  if (typeof props.options === 'function') {
    return props.options({
      form: form.value,
      isFold: isFold.value
    });
  }
  return props.options;
}

/**
 * 处理动态属性
 */
function resolveDynamicProp<T>(
  prop: T | ((params: DynamicPropsParams) => T) | undefined,
  params: DynamicPropsParams
): T | undefined {
  if (typeof prop === 'function') {
    return (prop as (params: DynamicPropsParams) => T)(params);
  }
  return prop;
}

/**
 * 获取组件的默认值
 */
function getDefaultValue(item: TableSearchOption, params: DynamicPropsParams) {
  const compName = item.comp?.name || '';
  let defaultValue: any = '';
  const innerAttrs = resolveDynamicProp(item.innerAttrs, params) || {};

  switch (compName) {
    case 'ElCascader':
      defaultValue = [];
      break;
    case 'ElSelect':
      defaultValue = innerAttrs.multiple ? [] : '';
      break;
    case 'ElDatePicker': {
      const dateType = innerAttrs.type || 'date';
      if (['datetimerange', 'daterange', 'monthrange', 'yearrange'].includes(dateType)) {
        defaultValue = [];
      } else {
        defaultValue = '';
      }
      break;
    }
    case 'ElInputNumber':
      defaultValue = null;
      break;
    case 'ElTimePicker':
      defaultValue = innerAttrs.isRange ? [] : '';
      break;
    case 'ElTreeSelect':
      defaultValue = innerAttrs.multiple ? [] : '';
      break;
    default:
      defaultValue = '';
      break;
  }

  return defaultValue;
}

// ==================== 选项处理 ====================
/**
 * 处理单个配置项
 */
function processOption(item: TableSearchOption): TableSearchItem {
  const params: DynamicPropsParams = {
    form: form.value,
    isFold: isFold.value,
    prop: item.prop,
    value: form.value[item.prop]
  };

  const resolvedBorderAttrs = resolveDynamicProp(item.borderAttrs, params) || {};
  const resolvedInnerAttrs = resolveDynamicProp(item.innerAttrs, params) || {};
  const resolvedHidden = resolveDynamicProp(item.hidden, params);
  const resolvedDisabled = resolveDynamicProp(item.disabled, params);
  const label = item.label ?? '';
  const compName = item.comp?.name || 'ElInput';

  // 智能 placeholder 处理
  let newInnerAttrs = { ...resolvedInnerAttrs };
  const hasPlaceholder = 'placeholder' in newInnerAttrs;
  const hasStartPlaceholder =
    'startPlaceholder' in newInnerAttrs || 'start-placeholder' in newInnerAttrs;
  const hasEndPlaceholder = 'endPlaceholder' in newInnerAttrs || 'end-placeholder' in newInnerAttrs;

  // 输入类
  const inputComps = ['ElInput', 'ElInputNumber', 'ElAutocomplete'];
  // 选择类
  const selectComps = [
    'ElSelect',
    'ElCascader',
    'ElTreeSelect',
    'ElRadioGroup',
    'ElCheckboxGroup',
    'ElDatePicker',
    'ElTimePicker'
  ];

  // 范围选择
  const isRange =
    (compName === 'ElDatePicker' || compName === 'ElTimePicker') &&
    newInnerAttrs.type?.includes('range');

  if (!hasPlaceholder && !isRange) {
    if (inputComps.includes(compName)) {
      newInnerAttrs.placeholder = `请输入${label}`;
    } else if (selectComps.includes(compName)) {
      newInnerAttrs.placeholder = `请选择${label}`;
    }
  }
  if (isRange) {
    if (!hasStartPlaceholder) newInnerAttrs['start-placeholder'] = `开始时间`;
    if (!hasEndPlaceholder) newInnerAttrs['end-placeholder'] = `结束时间`;
  }

  const obj: TableSearchItem = {
    prop: item.prop,
    label: item.label ?? '',
    first: item.first ?? false,
    custom: item.custom ?? false,
    value: item.value ?? getDefaultValue(item, params),
    hidden: resolvedHidden ?? false,
    valueFormat: item.valueFormat,
    comp: markRaw(item.comp ?? ElInput),
    borderAttrs: {
      label: item.label ?? '',
      width: resolvedBorderAttrs.width ?? borderLabelConfig?.width ?? '220px',
      height: resolvedBorderAttrs.height ?? borderLabelConfig?.height ?? '32px',
      noBorder: resolvedBorderAttrs.noBorder ?? false,
      ...resolvedBorderAttrs
    },
    innerAttrs: {
      disabled: resolvedDisabled ?? false,
      ...newInnerAttrs
    }
  };

  // 修正首行disabled自动控制逻辑
  const allOptions = getCurrentOptions();
  const optionsCount = allOptions.length;
  if (item.first && props.disabledFirst && hasMore.value && optionsCount > 1) {
    obj.innerAttrs.disabled = !isFold.value;
  }

  return obj;
}

/**
 * 更新选项列表
 */
function updateOptions() {
  const options = getCurrentOptions();

  firstOptions.value = [];
  moreOptions.value = [];

  const processedOptions = options.map(processOption);

  processedOptions.forEach((item: TableSearchItem) => {
    if (!hasMore.value) {
      firstOptions.value.push(item);
    } else {
      if (item.first) {
        firstOptions.value.push(item);
      } else {
        moreOptions.value.push(item);
      }
    }
  });
}

// ==================== 表单数据处理 ====================
/**
 * 初始化表单数据
 */
function initializeForm() {
  const options = getCurrentOptions();

  options.forEach((item: TableSearchOption) => {
    if (!(item.prop in form.value)) {
      form.value[item.prop] =
        item.value ??
        getDefaultValue(item, {
          form: form.value,
          isFold: isFold.value,
          prop: item.prop,
          value: undefined
        });
    }
  });
}

/**
 * 更新格式化后的表单数据
 */
function updateFormatForm() {
  const options = getCurrentOptions();
  const newFormatForm: Record<string, any> = {};

  Object.keys(form.value).forEach(prop => {
    const option = options.find((item: TableSearchOption) => item.prop === prop);
    const value = form.value[prop];

    if (option?.valueFormat && typeof option.valueFormat === 'function') {
      const formattedValue = option.valueFormat(value, prop, form.value);

      if (formattedValue && typeof formattedValue === 'object' && !Array.isArray(formattedValue)) {
        // 返回对象时，将属性合并到 formatForm 中
        Object.keys(formattedValue).forEach(key => {
          newFormatForm[key] = formattedValue[key];
        });
      } else {
        // 返回简单值时，直接设置
        newFormatForm[prop] = formattedValue;
      }
    } else {
      // 没有 valueFormat，直接复制值
      newFormatForm[prop] = value;
    }
  });

  formatForm.value = newFormatForm;
}

/**
 * 格式化表单数据（用于事件发送）
 */
function formatFormData() {
  return { ...formatForm.value };
}

// ==================== 事件处理 ====================
/**
 * 处理值更新
 */
function handleValueUpdate(prop: string, value: any) {
  form.value[prop] = value;
  updateFormatForm();
}

/**
 * 搜索事件
 */
function onSearch() {
  updateFormatForm(); // 确保数据是最新的
  emits('search', formatFormData());
}

/**
 * 重置事件
 */
function onReset() {
  const options = getCurrentOptions();

  options.forEach((item: TableSearchOption) => {
    form.value[item.prop] =
      item.value ??
      getDefaultValue(item, {
        form: form.value,
        isFold: isFold.value,
        prop: item.prop,
        value: undefined
      });
  });

  updateFormatForm();
  emits('reset', formatFormData());
}

/**
 * 折叠切换事件
 */
function toggleFold() {
  isFold.value = !isFold.value;

  if (hasMore.value && props.clearOnFold) {
    if (isFold.value) {
      moreOptions.value.forEach((item: TableSearchItem) => {
        form.value[item.prop] = '';
      });
    } else {
      firstOptions.value.forEach((item: TableSearchItem) => {
        form.value[item.prop] = '';
      });
    }
  }

  updateFormatForm();
  emits('fold', { isFold: isFold.value, form: form.value });
}

// ==================== 初始化 & 监听器 ====================
// 初始化
initializeForm();

// 监听表单变化，更新选项和格式化数据
watch(
  [form, isFold],
  () => {
    updateOptions();
    updateFormatForm();
  },
  { deep: true }
);

// 监听options变化，重新初始化
watch(
  () => props.options,
  () => {
    initializeForm();
    updateOptions();
    updateFormatForm();
  },
  { deep: true, immediate: true }
);

// 监听form变化，发送change事件
watch(
  form,
  () => {
    updateFormatForm();
    emits('change', formatFormData());
  },
  { deep: true, immediate: true }
);
</script>
