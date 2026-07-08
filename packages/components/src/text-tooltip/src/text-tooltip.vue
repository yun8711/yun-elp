<template>
  <el-tooltip
    ref="tooltipRef"
    v-bind="tooltipAttrs"
    :disabled="!showTooltip"
  >
    <div :class="ns.b()">
      <div
        ref="textRef"
        :class="ns.e('content')"
        :style="computedTextStyle"
      >
        <slot />
      </div>
    </div>
    <template
      v-if="$slots.content"
      #content
    >
      <slot name="content" />
    </template>
  </el-tooltip>
</template>

<script setup lang="ts">
import type { TextTooltipProps } from './text-tooltip';
import {
  computed,
  ref,
  onMounted,
  onUpdated,
  onUnmounted,
  useTemplateRef,
  useSlots,
  watch,
  toRefs,
  nextTick,
  getCurrentInstance,
  camelize
} from 'vue';
import { ElTooltip } from 'element-plus';
import { pickBy } from 'lodash-es';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YTextTooltip',
  inheritAttrs: true
});

const textTooltipConfig = useAppConfig('textTooltip');
const ns = useNamespace('text-tooltip');
const slots = useSlots();
const props = withDefaults(defineProps<TextTooltipProps>(), {
  lineClamp: 1,
  width: '100%',
  model: 'auto',
  textStyle: () => ({})
});

const { lineClamp, width, model, textStyle } = toRefs(props);

const instance = getCurrentInstance();

// 合并tooltipProps
const tooltipAttrs = computed((): Record<string, any> => {
  const configAttrs: Record<string, any> = textTooltipConfig?.tooltipProps || {};
  const { lineClamp: _, width: __, model: ___, textStyle: ____, ...restProps } = props;
  const defaults: Record<string, any> = {
    placement: 'top',
    showAfter: 50,
    hideAfter: 50,
    enterable: false,
    popperClass: ns.e('popper'),
    teleported: true,
    persistent: false
  };
  // 仅当未提供 content 命名插槽时，自动从默认插槽提取文本作为 tooltip 内容
  if (!slots.content) {
    defaults.content = tooltipContent.value;
  }
  // Vue 会给未传入的 Boolean 类 prop 赋默认值 false（而非 undefined），若原样透传，
  // visible: false 会让 el-tooltip 进入受控模式导致 hover 失效，
  // 因此只透传使用者显式传入的 prop（以 vnode.props 的 key 为准）
  const passedKeys = new Set(Object.keys(instance?.vnode.props ?? {}).map((key) => camelize(key)));
  const passedProps = pickBy(restProps, (_value, key) => passedKeys.has(key));
  return { ...defaults, ...configAttrs, ...passedProps };
});

const computedTextStyle = computed(() => {
  return {
    width: typeof width.value === 'number' ? `${width.value}px` : width.value,
    '-webkit-line-clamp': lineClamp.value,
    'white-space': lineClamp.value > 1 ? 'normal' : 'nowrap',
    ...textStyle.value
  };
});

const textRef = useTemplateRef<HTMLElement>('textRef');
const tooltipContent = ref('');

const showTooltip = ref(true);

// 创建ResizeObserver监听容器大小变化
let resizeObserver: ResizeObserver | null = null;

// 判断是否需要显示tooltip，即内容是否超长
const getIsOverflow = () => {
  // 更新 tooltip 内容（当未使用 content 插槽时）
  if (!slots.content) {
    tooltipContent.value = textRef.value?.textContent || '';
  }

  if (model.value === 'none') {
    showTooltip.value = false;
  } else if (model.value === 'always') {
    showTooltip.value = true;
  } else if (model.value === 'auto') {
    if (lineClamp.value === 1) {
      // 获取可视宽度
      const width = textRef.value?.offsetWidth;
      // 获取内容滚动宽度，即实际宽度
      const scrollWidth = textRef.value?.scrollWidth;
      showTooltip.value = (width ?? 0) < (scrollWidth ?? 0);
    } else if (lineClamp.value > 1) {
      const height = textRef.value?.offsetHeight;
      const scrollHeight = textRef.value?.scrollHeight;
      showTooltip.value = (height ?? 0) < (scrollHeight ?? 0);
    }
  }
};

onMounted(() => {
  nextTick(() => {
    getIsOverflow();

    // 创建ResizeObserver监听容器大小变化
    if (model.value === 'auto' && textRef.value) {
      resizeObserver = new ResizeObserver(() => {
        getIsOverflow();
      });
      resizeObserver.observe(textRef.value);
    }
  });
});

onUpdated(getIsOverflow);

// 监听相关属性变化，重新计算是否显示tooltip
watch(
  [() => model.value, () => lineClamp.value, () => width.value],
  () => {
    // 先清理之前的ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }

    getIsOverflow();

    // 如果model为auto且有DOM元素，重新创建ResizeObserver
    if (model.value === 'auto' && textRef.value) {
      resizeObserver = new ResizeObserver(() => {
        getIsOverflow();
      });
      resizeObserver.observe(textRef.value);
    }
  },
  { immediate: false }
);

// 组件卸载时清理ResizeObserver
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

const tooltipRef = useTemplateRef<HTMLElement>('tooltipRef');
defineExpose(new Proxy({} as HTMLElement, {
  get: (_target, key) => {
    return tooltipRef.value?.[key as keyof HTMLElement];
  },
  has: (_target, key) => {
    return !!(tooltipRef.value && key in tooltipRef.value);
  },
  ownKeys: () => {
    return tooltipRef.value ? [...Object.keys(tooltipRef.value)] : [];
  },
  getOwnPropertyDescriptor: (_target, key) => {
    return tooltipRef.value ? Object.getOwnPropertyDescriptor(tooltipRef.value, key) : undefined;
  }
}));
</script>
