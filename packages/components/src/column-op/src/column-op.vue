<template>
  <el-table-column v-bind="mergedColumnAttrs">
    <template #default="scope">
      <template v-for="item in getOptions(scope).normalList" :key="item.prop">
        <slot :name="item.prop" :scope="scope" :row="scope.row" :prop="item.prop">
          <y-pop v-bind="getPopProps(item)" v-on="getPopEvents(scope, item)">
            <y-button
              type="primary"
              link
              :disabled="item.disabled"
              :loading="item.loading"
              v-on="getButtonEvents(scope, item)"
            >
              {{ item.label }}
            </y-button>
          </y-pop>
        </slot>
      </template>

      <el-popover
        v-if="getOptions(scope).dropdownList.length > 0"
        placement="bottom"
        width="0"
        :popper-class="ns.e('dropdown')"
        trigger="click"
        :visible="getDropdownVisible(scope.$index)"
        @update:visible="setDropdownVisible(scope.$index, $event)"
      >
        <template #reference>
          <el-icon :class="ns.e('dropdown-icon')">
            <MoreFilled />
          </el-icon>
        </template>
        <div
          v-for="item in getOptions(scope).dropdownList"
          :key="item.prop"
          :class="ns.e('dropdown-item')"
        >
          <y-pop v-bind="getPopProps(item)" v-on="getPopEvents(scope, item)">
            <y-button
              type="primary"
              link
              :disabled="item.disabled"
              :loading="item.loading"
              v-on="getButtonEvents(scope, item)"
            >
              {{ item.label }}
            </y-button>
          </y-pop>
        </div>
      </el-popover>
    </template>

    <template #header="{ column, $index }">
      <slot name="header" :column="column" :index="$index">
        <span>{{ attrs.label }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ElTableColumn, ElPopover, ElIcon } from 'element-plus';
import type {
  ColumnOpProps,
  TableItemScope,
  ColumnOpItemType,
  ResolvedColumnOpItem
} from './column-op';
import { toRefs, ref, watch, inject } from 'vue';
import { routeLocationKey, type RouteLocationNormalizedLoaded } from 'vue-router';
import { useEventListener } from '@vueuse/core';
import { merge } from 'lodash-es';
import { MoreFilled } from '@element-plus/icons-vue';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import { useTableColumnAttrs } from '../../../hooks/use-table-column-attrs';
import { useNamespace } from '../../../hooks/use-namespace';
import YPop from '../../pop/src/pop.vue';
import YButton from '../../button/src/button.vue';

defineOptions({
  name: 'YColumnOp',
  inheritAttrs: true
});

const columnOpConfig = useAppConfig('columnOp');
const ns = useNamespace('column-op');
const { attrs, mergedColumnAttrs } = useTableColumnAttrs({
  className: ns.b(),
  fixed: 'right',
  showOverflowTooltip: false,
});
const props = withDefaults(defineProps<ColumnOpProps>(), {
  options: () => [],
  disabledDefaultTip: undefined as string | undefined
});

const { options, disabledDefaultTip } = toRefs(props);

const showDropdownMap = ref(new Map<number, boolean>());

const getDropdownVisible = (index: number) => {
  return showDropdownMap.value.get(index) || false;
};

const setDropdownVisible = (index: number, visible: boolean) => {
  showDropdownMap.value.set(index, visible);
};

const getOptions = (scope: TableItemScope) => {
  // 正常展示的操作项
  const normalList = ref<ResolvedColumnOpItem[]>([]);
  // 以dropdown的形式展示的操作项
  const dropdownList = ref<ResolvedColumnOpItem[]>([]);
  const optionsArr = typeof options.value === 'function' ? options.value(scope) : options.value;

  optionsArr?.forEach((item: ColumnOpItemType) => {
    const defaultObj: ResolvedColumnOpItem = {
      prop: item.prop,
      label: '',
      disabled: false,
      show: true,
      dropdown: false,
      popover: false,
      popProps: {},
      confirm: item?.confirm || undefined,
      cancel: item?.cancel || undefined,
      loading: item?.loading || false
    };
    defaultObj.label = typeof item.label === 'function' ? item.label(scope, item) : item.label;

    let disabledTipContent: string = '';
    const disabledValue = getDisabledValue(scope, item);

    defaultObj.disabled = disabledValue[0];
    disabledTipContent = String(disabledValue[1] || '');

    defaultObj.show =
      typeof item.show === 'function' ? item.show(scope, item) : (item.show ?? true);
    defaultObj.dropdown =
      typeof item.dropdown === 'function' ? item.dropdown(scope, item) : (item.dropdown ?? false);
    defaultObj.popover =
      typeof item.popover === 'function' ? item.popover(scope, item) : (item?.popover ?? false);

    const popProps =
      typeof item.popProps === 'function' ? item.popProps(scope, item) : (item.popProps ?? {});

    // 使用lodash的递归合并，将popProps的值合并到defaultObj.popProps中
    defaultObj.popProps = merge(
      {},
      {
        noPop: !defaultObj.popover,
        tipContent: disabledTipContent,
        tipProps: {
          enterable: false
        }
      },
      popProps
    );

    // 如果按钮隐藏，则不展示
    // show 为 false 时隐藏
    if (!defaultObj.show) return;

    // 根据dropdown的值，将操作项添加到对应的列表中
    if (defaultObj.dropdown) {
      dropdownList.value.push(defaultObj);
    } else {
      normalList.value.push(defaultObj);
    }
  });

  return {
    normalList: normalList.value,
    dropdownList: dropdownList.value
  };
};

const getPopProps = (item: ResolvedColumnOpItem): Record<string, any> => {
  return item.popProps || {};
};

const getDisabledValue = (
  scope: TableItemScope,
  item: ColumnOpItemType
): [boolean, string] => {
  let res: [boolean, string];

  if (typeof item.disabled === 'function') {
    const res0 = item.disabled(scope, item);
    if (typeof res0 === 'boolean') {
      // 函数只返回一个boolean值
      res = [res0, ''];
    } else if (Array.isArray(res0)) {
      // 函数返回一个数组
      // 判断是否为二维数组，表示有多个禁用条件
      if (Array.isArray(res0[0])) {
        // 获取不为false的值
        const res1: [boolean, string] | undefined = (res0 as [boolean, string][]).find(
          item => item[0]
        );
        if (res1) {
          res = [res1[0], res1[1] || '无权限'];
        } else {
          res = [false, ''];
        }
      } else {
        // 不是二维数组，即只有一个禁用条件
        res = [(res0 as [boolean, string])[0], (res0 as [boolean, string])[1] ?? ''];
      }
    } else {
      // 函数返回一个其他值，表示禁用
      res = [false, ''];
    }
  } else if (typeof item.disabled === 'boolean') {
    res = [item.disabled, ''];
  } else if (typeof item.disabled === 'object') {
    // 判断是否为二维数组，表示有多个禁用条件
    if (Array.isArray(item.disabled[0])) {
      // 获取不为false的值
      const res1: [boolean, string] | undefined = (item.disabled as [boolean, string][]).find(
        item => item[0]
      );
      if (res1) {
        res = [res1[0], res1[1] || '无权限'];
      } else {
        res = [false, ''];
      }
    } else {
      // 不是二维数组，即只有一个禁用条件
      res = [
        (item.disabled as [boolean, string])[0],
        (item.disabled as [boolean, string])[1] ?? ''
      ];
    }
  } else {
    res = [false, ''];
  }
  return [
    res[0],
    res[1] || (disabledDefaultTip.value ?? columnOpConfig?.disabledDefaultTip ?? '')
  ];
};

const getPopEvents = (scope: TableItemScope, item: ResolvedColumnOpItem) => {
  // 显示 popover 时，将 confirm 和 cancel 事件绑定到 y-pop
  return item.popover
    ? {
      confirm: (e: MouseEvent) => item.confirm?.(scope, item, e),
      cancel: (e: MouseEvent) => item.cancel?.(scope, item, e)
    }
    : {};
};

const getButtonEvents = (scope: TableItemScope, item: ResolvedColumnOpItem) => {
  // 不显示 popover 时，将 click 事件绑定到按钮
  return !item.popover
    ? {
      click: (e: MouseEvent) => item.confirm?.(scope, item, e)
    }
    : {};
};

const closeDropdowns = () => {
  showDropdownMap.value.clear();
};

// 未 provide 路由时得到 undefined，避免 inject 警告
const route: RouteLocationNormalizedLoaded | undefined = inject(
  routeLocationKey,
  undefined as unknown as RouteLocationNormalizedLoaded
);

if (route) {
  watch(() => route.fullPath, closeDropdowns);
} else if (typeof window !== 'undefined') {
  useEventListener(window, 'popstate', closeDropdowns);
  useEventListener(window, 'hashchange', closeDropdowns);
}
</script>
