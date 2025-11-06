<template>
  <div
    ref="descRef"
    class="y-desc"
    :style="containerStyle"
    :class="{
      'y-desc--bordered': isBorder
    }"
  >
    <div class="y-desc__body">
      <div
        v-for="(item, index) in props.config"
        :key="getItemKey(item, index)"
        class="y-desc__item"
        :class="itemClass"
        :style="getItemStyle(index)"
      >
        <div class="y-desc__item-label" :style="getLabelStyle(item, index)">
          <slot
            v-if="item?.prop && slots[`${item.prop}-label`]"
            :name="`${item.prop}-label`"
            v-bind="{ item, index }"
          >
          </slot>
          <slot v-else-if="slots.label" name="label" v-bind="{ item, index }">
            <span>{{ item.label }}</span>
          </slot>
          <span v-else>{{ item.label }}</span>
        </div>
        <div class="y-desc__item-content" :style="getContentStyle(item)">
          <slot
            v-if="item?.prop && slots[`${item.prop}-content`]"
            :name="`${item.prop}-content`"
            v-bind="{ item, index }"
          >
            <y-text-tooltip v-if="isItemTooltip(item)" v-bind="item?.textTooltip || {}">
              {{ getValue(item) }}
            </y-text-tooltip>
            <span v-else>{{ getValue(item) }}</span>
          </slot>
          <slot v-else-if="slots.content" name="content" v-bind="{ item, index }">
            <y-text-tooltip v-if="isItemTooltip(item)" v-bind="item?.textTooltip || {}">
              {{ getValue(item) }}
            </y-text-tooltip>
            <span v-else>{{ getValue(item) }}</span>
          </slot>
          <template v-else>
            <y-text-tooltip v-if="isItemTooltip(item)" v-bind="item?.textTooltip">
              {{ getValue(item) }}
            </y-text-tooltip>
            <span v-else>{{ getValue(item) }}</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DescProps, DescItem } from './desc';
import { get } from 'lodash-es';
import { computed, useAttrs, useSlots, useTemplateRef } from '@vue/runtime-core';
import { hasOwn } from '@vueuse/shared';
import { useElementSize } from '@vueuse/core';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { getSizeValue } from '../../../utils/other';
import YTextTooltip from '../../text-tooltip/src/text-tooltip.vue';

defineOptions({
  name: 'YDesc',
  inheritAttrs: true
});

const descConfig = useAppConfig('desc');
const attrs = useAttrs();
const slots = useSlots();
const descRef = useTemplateRef<HTMLElement | null>('descRef');
const { width } = useElementSize(descRef);
const props = defineProps<DescProps>() as DescProps;

const mergedProps = computed(() => {
  const desc = descConfig || {};
  // 先展开 desc 和 props，这样它们会覆盖默认值
  const merged = {
    ...desc,
    ...props,
    labelWidth: getSizeValue(props.labelWidth) ?? getSizeValue(desc?.labelWidth) ?? 'auto',
    labelStyle: Object.assign({}, desc?.labelStyle || {}, props.labelStyle || {}),
    contentStyle: Object.assign({}, desc?.contentStyle || {}, props.contentStyle || {})
  };

  // 如果 desc 和 props 中都没有设置这些属性，则使用默认值
  if (!merged.labelAlign) merged.labelAlign = 'left';
  if (!merged.contentAlign) merged.contentAlign = 'left';
  if (!merged.emptyText) merged.emptyText = '';

  return merged;
});

// 是否显示边框
const isBorder = computed(() => {
  return hasOwn(attrs, 'border') || attrs.border ? true : false;
});
// 整体配置是否显示tooltip
const isAllTooltip = computed(() => {
  return !props.noTooltip;
});

// 单个配置是否显示tooltip
const isItemTooltip = (item: DescItem): boolean => {
  // 如果 item.noTooltip 有明确的值（true 或 false），就使用它
  if (item?.noTooltip !== undefined && item?.noTooltip !== null) {
    return !item.noTooltip;
  }
  // 否则使用全局配置
  return isAllTooltip.value ?? true;
};

// 获取值
const getValue = (item: DescItem) => {
  let value = null;
  if (item?.content) {
    value = item.content;
  } else {
    // 如果未指定path，使用label作为取值路径
    const dataPath = item.path || item.label;
    const v0 = dataPath ? get(props.data, dataPath) : props.data;
    if (v0 !== undefined && v0 !== null) {
      if (typeof item?.format === 'function') {
        value = item.format(v0);
      } else {
        value = v0 || mergedProps.value?.emptyText;
      }
    } else {
      value = props.emptyText;
    }
  }
  return value;
};

const getItemKey = (item: DescItem, index: number) => {
  return item?.prop || index;
};

// 列数
const column = computed(() => {
  const columnValue = props?.column || 3;
  if (!columnValue) {
    return 1;
  } else if (typeof columnValue === 'function') {
    return columnValue(width.value);
  } else {
    return Number(columnValue);
  }
});

// 容器样式 - 动态设置CSS变量
const containerStyle = computed(() => {
  const style: Record<string, string | number> = {
    '--y-desc-columns': String(column.value)
  };

  // 合并用户自定义样式，过滤无效值
  const userStyle = (attrs.style as Record<string, any>) || {};
  Object.keys(userStyle).forEach(key => {
    const value = userStyle[key];
    if (value != null && value !== '') {
      if (typeof value === 'string' || typeof value === 'number') {
        style[key] = String(value);
      }
    }
  });

  return style;
});

const itemClass = computed(() => {
  return {
    'y-desc__item--bordered': isBorder.value,
    'y-desc__item--vertical': props?.direction === 'vertical'
  };
});

// 获取item样式
const getItemStyle = (index: number) => {
  const obj: Record<string, string> = {};
  const totalItems = props.config.length;
  let currentCol = 0;

  // 遍历到当前item，计算布局
  for (let i = 0; i <= index; i++) {
    const item = props.config[i];
    let spanValue: number;
    if (item.span === ('column' as any)) {
      spanValue = column.value;
    } else if (typeof item.span === 'number') {
      spanValue = item.span;
    } else {
      spanValue = 1;
    }

    // 确保spanValue是有效的数字
    if (spanValue <= 0) {
      spanValue = 1;
    }

    // 如果当前行放不下这个item，换行
    if (currentCol + spanValue > column.value) {
      currentCol = 0;
    }

    // 如果是最后一个item，且当前行有剩余空间，让它占据剩余空间
    if (i === totalItems - 1 && currentCol < column.value) {
      spanValue = column.value - currentCol;
    }

    // 如果是当前item，设置gridColumn
    if (i === index) {
      if (spanValue > 1) {
        obj.gridColumn = `span ${spanValue}`;
      }
      break;
    }

    currentCol += spanValue;
  }

  // 最后一行不显示border-bottom
  const lastRowIndex = Math.floor(totalItems / column.value) * column.value;
  if (index === lastRowIndex) {
    obj.borderBottom = 'none';
  }

  return obj;
};

// 获取标签样式
const getLabelStyle = (item: DescItem, index: number) => {
  const style: Record<string, string> = {
    width: getSizeValue(item?.labelWidth) || getSizeValue(props?.labelWidth) || 'auto',
    borderRight: isBorder.value ? '1px solid var(--el-border-color-lighter)' : 'none',
    borderLeft:
      isBorder.value && index % column.value !== 0
        ? '1px solid var(--el-border-color-lighter)'
        : 'none',
    alignItems: item?.labelAlign || mergedProps.value?.labelAlign || 'left'
  };

  // 合并样式对象，过滤无效值
  const mergeStyles = (target: Record<string, string>, source: Record<string, any>) => {
    Object.keys(source).forEach(key => {
      const value = source[key];
      if (value != null && value !== '') {
        if (typeof value === 'string' || typeof value === 'number') {
          target[key] = String(value);
        }
      }
    });
  };

  mergeStyles(style, item?.labelStyle || {});
  mergeStyles(style, mergedProps.value?.labelStyle || {});

  return style;
};
// 获取内容样式
const getContentStyle = (item: DescItem) => {
  const style: Record<string, string> = {
    alignItems: item?.contentAlign || mergedProps.value?.contentAlign || 'left'
  };

  // 合并样式对象，过滤无效值
  const mergeStyles = (target: Record<string, string>, source: Record<string, any>) => {
    Object.keys(source).forEach(key => {
      const value = source[key];
      if (value != null && value !== '') {
        if (typeof value === 'string' || typeof value === 'number') {
          target[key] = String(value);
        }
      }
    });
  };

  mergeStyles(style, item?.contentStyle || {});
  mergeStyles(style, mergedProps.value?.contentStyle || {});

  return style;
};
</script>
