<template>
  <el-table-column class="y-column-operation" v-bind="mergedColumnAttrs" class-name="y-column-operation">
    <template #default="scope">
      <template v-for="item in getOptions(scope).normalList" :key="item.prop">
        <slot :name="item.prop" :scope="scope" :row="scope.row" :prop="item.prop">
          <y-pop v-bind="item.popProps" v-on="getPopEvents(scope, item)">
            <y-button type="primary" link :disabled="item.disabled" :loading="item.loading"
              v-on="getButtonEvents(scope, item)">
              {{ item.label }}
            </y-button>
          </y-pop>
        </slot>
      </template>

      <el-popover v-if="getOptions(scope).dropdownList.length > 0" placement="bottom" width="0"
        popper-class="y-column-operation__dropdown" trigger="click" :visible="getDropdownVisible(scope.$index)"
        @update:visible="setDropdownVisible(scope.$index, $event)" ref="popoverRef">
        <template #reference>
          <el-icon class="y-column-operation__dropdown-icon">
            <MoreFilled />
          </el-icon>
        </template>
        <div v-for="item in getOptions(scope).dropdownList" :key="item.prop" class="y-column-operation__dropdown-item">
          <y-pop v-bind="item.popProps" v-on="getPopEvents(scope, item)">
            <y-button type="primary" link :disabled="item.disabled" :loading="item.loading"
              v-on="getButtonEvents(scope, item)">
              {{ item.label }}
            </y-button>
          </y-pop>
        </div>
      </el-popover>
    </template>

    <template #header="{ column, $index }">
      <slot name="header" :column="column" :index="$index">
        <span :style="headerStyle">{{ attrs.label }}</span>
      </slot>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import type {
  ColumnOperationProps,
  TableItemScope,
  ColumnOperationItemType,
} from './column-operation';
import { withDefaults, toRefs, useAttrs, computed, ref } from '@vue/runtime-core';
import type { PopProps } from '../../pop/src/pop';
import { MoreFilled } from '@element-plus/icons-vue';

defineOptions({
  name: 'YColumnOperation',
  inheritAttrs: true
});

const attrs = useAttrs();
const props = withDefaults(defineProps<ColumnOperationProps>(), {
  options: () => [],
  headerStyle: () => ({})
});

const { options, headerStyle } = toRefs(props);

const mergedColumnAttrs = computed(() => {
  return {
    'min-width': attrs?.['min-width'] || 100,
    width: attrs?.width || 'auto',
    'show-overflow-tooltip': false,
    fixed: attrs?.fixed || 'right',
    ...attrs
  };
});

const showDropdownMap = ref(new Map<number, boolean>());

const getDropdownVisible = (index: number) => {
  return showDropdownMap.value.get(index) || false;
}

const setDropdownVisible = (index: number, visible: boolean) => {
  showDropdownMap.value.set(index, visible);
}

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
      hide: false,
      dropdown: false,
      noPop: false,
      popProps: {} as Partial<PopProps>,
      confirm: item?.confirm || undefined,
      cancel: item?.cancel || undefined,
      loading: item?.loading || false
    };
    defaultObj.label = typeof item.label === 'function' ? item.label(scope, item) : item.label;

    let disabledTipContent: string = "";
    const disabledValue = getDisabledValue(scope, item);

    defaultObj.disabled = disabledValue[0];
    disabledTipContent = disabledValue[1] || "";

    defaultObj.show =
      typeof item.show === 'function' ? item.show(scope, item) : (item.show ?? true);
    defaultObj.hide =
      typeof item.hide === 'function' ? item.hide(scope, item) : (item.hide ?? false);
    defaultObj.dropdown =
      typeof item.dropdown === 'function' ? item.dropdown(scope, item) : (item.dropdown ?? false);
    const popProps =
      typeof item.popProps === 'function' ? item.popProps(scope, item) : (item.popProps ?? {});

    defaultObj.popProps = {
      noPop: true,
      tipContent: disabledTipContent,
      tipProps: {
        enterable: false,
      },
      ...popProps
    };

    // 如果按钮隐藏，则不展示
    if (!defaultObj.show) return;

    // console.log('defaultObj', defaultObj);

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

const getDisabledValue = (scope: TableItemScope, item: ColumnOperationItemType) => {
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
        const res1: [boolean, string] | undefined = (res0 as [boolean, string][]).find((item) => item[0]);
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
    res = [item.disabled, item.disabled ? '无权限' : ''];
  } else if (typeof item.disabled === 'object') {
    // 判断是否为二维数组，表示有多个禁用条件
    if (Array.isArray(item.disabled[0])) {
      // 获取不为false的值
      const res1: [boolean, string] | undefined = (item.disabled as [boolean, string][]).find((item) => item[0]);
      if (res1) {
        res = [res1[0], res1[1] || '无权限'];
      } else {
        res = [false, ''];
      }
    } else {
      // 不是二维数组，即只有一个禁用条件
      res = [(item.disabled as [boolean, string])[0], (item.disabled as [boolean, string])[1] ?? ''];
    }
  } else {
    res = [false, ''];
  }
  return res;
}

const getPopEvents = (scope: TableItemScope, item: ColumnOperationItemType) => {
  // console.log('getPopEvents', item);
  // 这里已确定 item.popProps 类型为 Partial<PopProps>
  const popProps = item.popProps as PopProps || {};
  const noPop = popProps.noPop;

  // 只有当 noPop 为 false 时，才绑定 confirm 和 cancel 事件到 y-pop
  return noPop === false ? {
    confirm: (e: MouseEvent) => item.confirm?.(scope, item, e),
    cancel: (e: MouseEvent) => item.cancel?.(scope, item, e)
  } : {};
}

const getButtonEvents = (scope: TableItemScope, item: ColumnOperationItemType) => {
  const popProps = item.popProps as PopProps || {};
  const noPop = popProps.noPop;

  // 只有当 noPop 不为 false 时，才绑定 click 事件到按钮
  return noPop !== false ? {
    click: (e: MouseEvent) => item.confirm?.(scope, item, e)
  } : {};
}
</script>
