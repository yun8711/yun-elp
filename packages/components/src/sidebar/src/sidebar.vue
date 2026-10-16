<template>
  <aside
    role="navigation"
    :aria-label="t('sidebar.nav')"
    :class="[ns.b(), { [ns.m('collapsed')]: collapsed && visible, [ns.m('hidden')]: !visible }]"
    :style="sidebarStyle"
  >
    <template v-if="visible">
      <div v-if="$slots.header" :class="ns.e('header')">
        <slot name="header" />
      </div>
      <el-scrollbar :class="ns.e('scrollbar')">
        <el-menu
          v-bind="resolvedMenuProps"
          :class="ns.e('menu')"
          :collapse="collapsed"
          :collapse-transition="collapseTransition"
          :unique-opened="uniqueOpened"
          @select="onSelect"
        >
          <YSidebarItem
            v-for="item in menuList"
            :key="getSidebarMenuIndex(item)"
            :item="item"
            :level="1"
            :indent="indent"
            :indent-map="indentMap"
            :icon-max-width="iconMaxWidth"
            :icon-gap="iconGap"
            :collapsed="collapsed"
            :title-config="titleProp"
            :extra-style="extraStyle"
            :parent-text-start="0"
          />
        </el-menu>
      </el-scrollbar>
      <div
        v-if="showFooter || $slots.footer"
        :class="ns.e('footer')"
        :role="footerToggleA11y ? 'button' : undefined"
        :tabindex="footerToggleA11y ? 0 : undefined"
        :aria-expanded="footerToggleA11y ? !collapsed : undefined"
        :aria-label="footerToggleA11y ? t('sidebar.collapseToggle') : undefined"
        @click="toggle"
      >
        <slot name="footer" :collapsed="collapsed">
          <div :class="ns.e('footer-default')">
            <div :class="ns.e('icon-wrap')">
              <el-icon :class="ns.e('icon')">
                <Expand v-if="collapsed" />
                <Fold v-else />
              </el-icon>
            </div>
            <span v-show="!collapsed" :class="ns.e('footer-text')">
              {{ t('sidebar.collapse') }}
            </span>
          </div>
        </slot>
      </div>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { computed, provide, useAttrs, useSlots, watch } from 'vue';
import { isPlainObject, omit } from 'lodash-es';
import { ElIcon, ElMenu, ElScrollbar } from 'element-plus';
import { Expand, Fold } from '@element-plus/icons-vue';
import type { SidebarEmits, SidebarExpose, SidebarProps, SidebarWidthMap } from './sidebar';
import {
  DEFAULT_SIDEBAR_ICON_GAP,
  DEFAULT_SIDEBAR_ICON_MAX_WIDTH,
  DEFAULT_SIDEBAR_INDENT,
  DEFAULT_SIDEBAR_FOOTER_HEIGHT,
  DEFAULT_SIDEBAR_ITEM_HEIGHT,
  DEFAULT_SIDEBAR_WIDTH_MAP,
  findSidebarMenuItem,
  getSidebarMenuIndex,
  SIDEBAR_MENU_PROPS_RESERVED_KEYS,
  sidebarSlotsKey,
  warnSidebarMenuListIndexDuplicate
} from './sidebar';
import YSidebarItem from './sidebar-item.vue';
import { useLocale } from '../../../hooks/use-locale';
import { useNamespace } from '../../../hooks/use-namespace';

defineOptions({
  name: 'YSidebar',
  inheritAttrs: true
});

const props = withDefaults(defineProps<SidebarProps>(), {
  menuList: () => [],
  activeMenu: '',
  collapsed: false,
  visible: true,
  widthMap: () => ({ ...DEFAULT_SIDEBAR_WIDTH_MAP }),
  indent: DEFAULT_SIDEBAR_INDENT,
  indentMap: () => ({}),
  iconMaxWidth: DEFAULT_SIDEBAR_ICON_MAX_WIDTH,
  iconGap: DEFAULT_SIDEBAR_ICON_GAP,
  itemHeight: DEFAULT_SIDEBAR_ITEM_HEIGHT,
  uniqueOpened: false,
  collapseTransition: false,
  showFooter: false,
  extraStyle: () => ({}),
  titleProp: () => ({}),
  menuProps: () => ({})
});

const emit = defineEmits<SidebarEmits>();
const ns = useNamespace('sidebar');
const attrs = useAttrs();
const slots = useSlots();
const { t } = useLocale();
provide(sidebarSlotsKey, slots);

const footerToggleA11y = computed(() => props.showFooter && !slots.footer);

// 开发环境检查菜单列表索引是否重复
if (import.meta.env.DEV) {
  watch(
    () => props.menuList,
    (list) => warnSidebarMenuListIndexDuplicate(list ?? []),
    { deep: true, immediate: true }
  );
}

function toStyleRecord(style: unknown): Record<string, string> {
  if (!isPlainObject(style)) {
    return {};
  }
  return omit(style as Record<string, string>, ['width']);
}

const mergedWidthMap = computed<SidebarWidthMap>(() => ({
  ...DEFAULT_SIDEBAR_WIDTH_MAP,
  ...props.widthMap
}));

const sidebarStyle = computed(() => {
  const w = mergedWidthMap.value;
  const width = !props.visible ? w.hidden : props.collapsed ? w.fold : w.default;
  return {
    width: `${width}px`,
    [ns.cssVarName('sidebar-fold-width')]: `${w.fold}px`,
    [ns.cssVarName('sidebar-icon-max-width')]: `${props.iconMaxWidth}px`,
    [ns.cssVarName('sidebar-icon-gap')]: `${props.iconGap}px`,
    [ns.cssVarName('sidebar-item-height')]: `${props.itemHeight}px`,
    [ns.cssVarName('sidebar-footer-indent')]: `${props.indent}px`,
    [ns.cssVarName('sidebar-footer-height')]: `${DEFAULT_SIDEBAR_FOOTER_HEIGHT}px`,
    [ns.elCssVarName('menu-item-height')]: `${props.itemHeight}px`,
    [ns.elCssVarName('menu-sub-item-height')]: `${props.itemHeight}px`
  };
});

const resolvedMenuProps = computed(() => {
  const menuProps = props.menuProps ?? {};
  const { popperClass, popperStyle } = menuProps;
  const rest = omit(menuProps, 'popperClass', 'popperStyle', ...SIDEBAR_MENU_PROPS_RESERVED_KEYS);
  const sidebarVars = omit(sidebarStyle.value, ['width', ns.cssVarName('sidebar-fold-width')]);
  return {
    ...rest,
    router: false,
    defaultActive: props.activeMenu,
    popperClass: [ns.e('menu-popper'), popperClass].filter(Boolean).join(' '),
    popperStyle: {
      ...sidebarVars,
      ...toStyleRecord(attrs.style),
      ...toStyleRecord(popperStyle)
    }
  };
});

function toggle(): void {
  emit('update:collapsed', !props.collapsed);
}

// a11y相关，暂时不需要支持
// function onFooterKeydown(event: KeyboardEvent): void {
//   if (!footerToggleA11y.value) {
//     return;
//   }
//   if (event.key === 'Enter' || event.key === ' ') {
//     event.preventDefault();
//     toggle();
//   }
// }

function collapse(): void {
  emit('update:collapsed', true);
}

function expand(): void {
  emit('update:collapsed', false);
}

function hide(): void {
  emit('update:visible', false);
}

function show(): void {
  emit('update:visible', true);
}

function onSelect(index: string): void {
  const item = findSidebarMenuItem(props.menuList, index);
  emit('select', index, item);
}

defineExpose<SidebarExpose>({ toggle, collapse, expand, hide, show });
</script>
