<template>
  <el-table-column v-bind="mergedColumnAttrs">
    <template #default="scope">
      <template v-for="item in getOptions(scope).normalList" :key="item.prop">
        <slot
          :name="item.prop"
          :scope="scope"
          :row="scope.row"
          :prop="item.prop">
          <y-pop v-bind="getPopProps(item)" v-on="getPopEvents(scope, item)">
            <y-button
              type="primary"
              link
              :disabled="item.disabled"
              :loading="item.loading"
              v-on="getButtonEvents(scope, item)">
              {{ item.label }}
            </y-button>
          </y-pop>
        </slot>
      </template>

      <el-popover
        v-if="getOptions(scope).dropdownList.length > 0"
        placement="bottom"
        width="0"
        popper-class="y-column-operation__dropdown"
        trigger="click"
        :visible="getDropdownVisible(scope.$index)"
        @update:visible="setDropdownVisible(scope.$index, $event)">
        <template #reference>
          <el-icon class="y-column-operation__dropdown-icon">
            <MoreFilled />
          </el-icon>
        </template>
        <div v-for="item in getOptions(scope).dropdownList" :key="item.prop" class="y-column-operation__dropdown-item">
          <y-pop v-bind="getPopProps(item)" v-on="getPopEvents(scope, item)">
            <y-button
              type="primary"
              link
              :disabled="item.disabled"
              :loading="item.loading"
              v-on="getButtonEvents(scope, item)">
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
  ColumnOperationProps,
  TableItemScope,
  ColumnOperationItemType
} from './column-operation';
import {
  toRefs,
  useAttrs,
  computed,
  ref,
  watch,
  onUnmounted,
  nextTick
} from 'vue';
import type { PopProps } from '../../pop/src/pop';
import { merge } from 'lodash-es';
import { MoreFilled } from '@element-plus/icons-vue';
import { useAppConfig } from '../../app-wrap/src/use-app-config';
import YPop from '../../pop/src/pop.vue';
import YButton from '../../button/src/button.vue';

defineOptions({
  name: 'YColumnOperation',
  inheritAttrs: true
});

const columnOperationConfig = useAppConfig('columnOperation');
const attrs = useAttrs();
const props = withDefaults(defineProps<ColumnOperationProps>(), {
  options: () => [],
  disabledDefaultTip: undefined as string | undefined
});

const { options, disabledDefaultTip } = toRefs(props);

const mergedColumnAttrs = computed(() => {
  return {
    ...attrs,
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    'show-overflow-tooltip': false,
    fixed: attrs?.fixed || 'right',
    'class-name': attrs?.['class-name'] || 'y-column-operation',
  };
});

const showDropdownMap = ref(new Map<number, boolean>());

const getDropdownVisible = (index: number) => {
  return showDropdownMap.value.get(index) || false;
};

const setDropdownVisible = (index: number, visible: boolean) => {
  showDropdownMap.value.set(index, visible);
};

const getOptions = (scope: TableItemScope) => {
  // 正常展示的操作项
  const normalList = ref<ColumnOperationItemType[]>([]);
  // 以dropdown的形式展示的操作项
  const dropdownList = ref<ColumnOperationItemType[]>([]);
  const optionsArr = typeof options.value === 'function' ? options.value(scope) : options.value;

  optionsArr?.forEach((item: ColumnOperationItemType) => {
    const defaultObj = {
      prop: item.prop,
      label: '',
      disabled: false,
      show: true,
      dropdown: false,
      noPop: true,
      popProps: {} as Partial<PopProps>,
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
    // 是否显示popover，默认不显示
    defaultObj.noPop =
      typeof item.noPop === 'function' ? item.noPop(scope, item) : (item?.noPop ?? true);

    const popProps =
      typeof item.popProps === 'function' ? item.popProps(scope, item) : (item.popProps ?? {});

    // 使用lodash的递归合并，将popProps的值合并到defaultObj.popProps中
    defaultObj.popProps = merge(
      {},
      {
        noPop: defaultObj.noPop,
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

const getPopProps = (item: ColumnOperationItemType) => {
  return item.popProps || {};
};

const getDisabledValue = (
  scope: TableItemScope,
  item: ColumnOperationItemType
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
    res[1] || (disabledDefaultTip.value ?? columnOperationConfig?.disabledDefaultTip ?? '')
  ];
};

const getPopEvents = (scope: TableItemScope, item: ColumnOperationItemType) => {
  const noPop = item.noPop as boolean;

  // 只有当 noPop 为 false 时，才绑定 confirm 和 cancel 事件到 y-pop
  return noPop === false
    ? {
      confirm: (e: MouseEvent) => item.confirm?.(scope, item, e),
      cancel: (e: MouseEvent) => item.cancel?.(scope, item, e)
    }
    : {};
};

const getButtonEvents = (scope: TableItemScope, item: ColumnOperationItemType) => {
  const noPop = item.noPop as boolean;

  // 只有当 noPop 不为 false 时，才绑定 click 事件到按钮
  return noPop !== false
    ? {
      click: (e: MouseEvent) => item.confirm?.(scope, item, e)
    }
    : {};
};

// 路由变化监听器 - 兼容有无vue-router的环境
const setupRouteWatcher = () => {
  // 延迟执行，避免在组件初始化时立即访问可能不存在的依赖
  nextTick(() => {
    const handleRouteChange = () => {
      showDropdownMap.value.clear();
    };

    // 尝试使用vue-router
    try {
      // 使用动态导入来避免TypeScript错误
      const vueRouterModule = (globalThis as any).VueRouter || (window as any).VueRouter;
      if (vueRouterModule && vueRouterModule.useRoute) {
        const { useRoute } = vueRouterModule;
        const route = useRoute();
        // 确保route对象存在且有path属性
        if (route && route.path !== undefined) {
          const routePath = computed(() => route.path);
          watch(() => routePath.value, handleRouteChange);
        }
      }
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // 如果没有vue-router，使用浏览器原生事件
      // 监听浏览器前进后退按钮
      window.addEventListener('popstate', handleRouteChange);

      // 监听hash变化（适用于hash模式路由）
      window.addEventListener('hashchange', handleRouteChange);

      // 清理函数
      onUnmounted(() => {
        window.removeEventListener('popstate', handleRouteChange);
        window.removeEventListener('hashchange', handleRouteChange);
      });
    }
  });
};

// 初始化路由监听
setupRouteWatcher();
</script>
