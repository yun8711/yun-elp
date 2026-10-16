import type { Component, ExtractPublicPropTypes, InjectionKey, PropType, Slot } from 'vue';
import type { BadgeProps, MenuProps } from 'element-plus';
import { isNil, isNumber, isPlainObject, isString, merge, omit, pick } from 'lodash-es';
import type { TextTooltipProps } from '../../text-tooltip/src/text-tooltip';

export type SidebarIcon = string | Component;

export interface SidebarMenuItem {
  path: string;
  /** 菜单唯一索引，未设置时使用 `path`（用于 `el-menu` index、列表 `:key`、`active-menu` / `select` 的 index） */
  prop?: string;
  title: string;
  icon?: SidebarIcon;
  /** 标题文本末尾附加文案（LTR 右侧 / RTL 左侧）；有 `#extra` 插槽时以插槽为准 */
  extra?: string;
  /** 该项 extra 区域样式，覆盖组件 `extra-style` */
  extraStyle?: Record<string, any>;
  /** 图标角标，折叠时保留；`true` 为圆点 */
  badge?: SidebarBadge;
  indent?: number;
  disabled?: boolean;
  children?: SidebarMenuItem[];
}

export type SidebarBadgePlacement = 'left' | 'right';

export type SidebarBadgeConfig = Pick<
  BadgeProps,
  | 'value'
  | 'max'
  | 'isDot'
  | 'hidden'
  | 'type'
  | 'showZero'
  | 'color'
  | 'badgeStyle'
  | 'offset'
  | 'badgeClass'
> & {
  /** 相对图标的左右位置；RTL 下自动对调，默认 `right` */
  placement?: SidebarBadgePlacement;
};

export type SidebarBadge = boolean | string | number | SidebarBadgeConfig;

const SIDEBAR_BADGE_EP_KEYS = [
  'value',
  'max',
  'isDot',
  'hidden',
  'type',
  'showZero',
  'color',
  'badgeStyle',
  'offset',
  'badgeClass'
] as const;

export interface SidebarWidthMap {
  default: number;
  fold: number;
  hidden: number;
}

/** 默认宽度映射 */
export const DEFAULT_SIDEBAR_WIDTH_MAP: SidebarWidthMap = {
  default: 184,
  fold: 54,
  hidden: 0
};
// 默认缩进
export const DEFAULT_SIDEBAR_INDENT = 16;
// 默认图标最大宽度
export const DEFAULT_SIDEBAR_ICON_MAX_WIDTH = 16;
// 默认图标间距
export const DEFAULT_SIDEBAR_ICON_GAP = 8;
// 默认菜单项高度
export const DEFAULT_SIDEBAR_ITEM_HEIGHT = 50;
// 默认底部折叠条高度
export const DEFAULT_SIDEBAR_FOOTER_HEIGHT = 56;

/** 菜单项标题展示配置，基于 YTextTooltip，透传其全部 props */
export type SidebarTitleConfig = TextTooltipProps & {
  /** 为 `false` 时不使用 YTextTooltip，标题完整展示 */
  enabled?: boolean;
};

export const DEFAULT_SIDEBAR_TITLE_CONFIG: SidebarTitleConfig = {
  enabled: true,
  lineClamp: 1,
  width: '100%',
  model: 'auto',
  placement: 'right',
  showAfter: 300
};

const SIDEBAR_TITLE_PLACEMENT_RTL_SWAP: Record<string, string> = {
  left: 'right',
  right: 'left',
  'left-start': 'right-start',
  'left-end': 'right-end',
  'right-start': 'left-start',
  'right-end': 'left-end'
};

/** RTL 下将 tooltip `placement` 的 left/right 对调 */
export function flipSidebarTitlePlacementForRtl(
  placement: TextTooltipProps['placement']
): TextTooltipProps['placement'] {
  if (placement == null) {
    return placement;
  }
  const swapped = SIDEBAR_TITLE_PLACEMENT_RTL_SWAP[String(placement)];
  return (swapped ?? placement) as TextTooltipProps['placement'];
}

export function flipSidebarBadgePlacementForRtl(
  placement: SidebarBadgePlacement
): SidebarBadgePlacement {
  return placement === 'left' ? 'right' : 'left';
}

function normalizeSidebarBadgeConfig(badge: SidebarBadge | undefined): SidebarBadgeConfig | null {
  if (badge == null || badge === false) {
    return null;
  }
  if (badge === true) {
    return { isDot: true };
  }
  if (isString(badge) || isNumber(badge)) {
    return { value: badge };
  }
  if (!isPlainObject(badge)) {
    return null;
  }
  return badge;
}

/** 解析菜单项角标；`hidden` / 无内容时返回 null。仅透传已出现的 el-badge props */
export function resolveSidebarBadge(
  badge: SidebarBadge | undefined,
  options?: { rtl?: boolean }
): { placement: SidebarBadgePlacement; badgeProps: Partial<BadgeProps> } | null {
  const config = normalizeSidebarBadgeConfig(badge);
  if (!config || config.hidden) {
    return null;
  }
  const hasContent = Boolean(config.isDot) || (config.value != null && config.value !== '');
  if (!hasContent) {
    return null;
  }
  const placement = config.placement ?? 'right';
  return {
    placement: options?.rtl ? flipSidebarBadgePlacementForRtl(placement) : placement,
    badgeProps: omit(pick(config, [...SIDEBAR_BADGE_EP_KEYS]), 'hidden')
  };
}

export function getSidebarMenuIndex(item: SidebarMenuItem): string {
  return item.prop ?? item.path;
}

export function mergeSidebarTitleConfig(
  config?: Partial<SidebarTitleConfig>,
  options?: { collapsed?: boolean; rtl?: boolean }
): { enabled: boolean; tooltipProps: TextTooltipProps } {
  const merged = merge({}, DEFAULT_SIDEBAR_TITLE_CONFIG, config) as SidebarTitleConfig;
  const { enabled = true, ...rest } = merged;
  const tooltipProps: TextTooltipProps = { ...rest };

  if (options?.collapsed) {
    tooltipProps.model = 'none';
  }

  if (options?.rtl && tooltipProps.placement) {
    tooltipProps.placement = flipSidebarTitlePlacementForRtl(tooltipProps.placement);
  }

  return { enabled, tooltipProps };
}

// 根据是否有图标，计算图标占用的宽度
export function getSidebarIconOccupy(
  hasIcon: boolean,
  iconMaxWidth = DEFAULT_SIDEBAR_ICON_MAX_WIDTH,
  iconGap = DEFAULT_SIDEBAR_ICON_GAP
): number {
  return hasIcon ? iconMaxWidth + iconGap : 0;
}

// 判断传入的图标是否为组件
// 用户自定义类型守卫：“icon is Component” 表示 “当本函数返回 true 时，参数 icon 就是 Component”
export function isSidebarIconComponent(icon: SidebarIcon | undefined): icon is Component {
  return icon != null && !isString(icon);
}
// 判断菜单项是否有图标
export function hasSidebarMenuIcon(item: SidebarMenuItem, hasIconSlot = false): boolean {
  return hasIconSlot || item.icon != null;
}
// 计算文本起始位置
export function getSidebarTextStart(paddingStart: number, iconOccupy = 0): number {
  return paddingStart + iconOccupy;
}
// 计算菜单项的缩进：按照上一级菜单项的文本起始位置 + 当前菜单项的缩进 + 图标占用的宽度
export function resolveSidebarItemIndent(options: {
  item: SidebarMenuItem;
  level: number;
  parentTextStart: number;
  /** 上一级菜单项是否有图标；无图标时子级走 indentMap，未配置则在上级文本起点上再加一级 indent */
  parentHasIcon?: boolean;
  indent: number;
  indentMap?: Record<number, number>;
}): number {
  const { item, level, parentTextStart, parentHasIcon = true, indent, indentMap } = options;
  if (!isNil(item.indent)) {
    return item.indent;
  }
  const mapped = indentMap?.[level];
  if (!isNil(mapped)) {
    return mapped;
  }
  if (level <= 1) {
    return indent;
  }
  if (!parentHasIcon) {
    return parentTextStart + indent;
  }
  return parentTextStart;
}

export interface SidebarItemSlotProps {
  item: SidebarMenuItem;
  level: number;
}

export const sidebarSlotsKey: InjectionKey<{
  icon?: Slot<SidebarItemSlotProps>;
  title?: Slot<SidebarItemSlotProps>;
  extra?: Slot<SidebarItemSlotProps>;
}> = Symbol('y-sidebar-slots');

/** 由 YSidebar 接管，不可通过 `menu-props` 传入 */
export const SIDEBAR_MENU_PROPS_RESERVED_KEYS = ['router', 'defaultActive'] as const;

export type SidebarMenuProps = Omit<
  Partial<MenuProps>,
  (typeof SIDEBAR_MENU_PROPS_RESERVED_KEYS)[number]
>;

/** 收集同级重复的菜单 index（开发态校验用） */
export function collectDuplicateSidebarMenuIndexes(
  list: SidebarMenuItem[],
  parentPath = 'menuList'
): string[] {
  const messages: string[] = [];
  const seen = new Set<string>();

  list.forEach((item, i) => {
    const index = getSidebarMenuIndex(item);
    const path = `${parentPath}[${i}]`;
    if (seen.has(index)) {
      messages.push(`${path}: index "${index}" 与同级项重复`);
    } else {
      seen.add(index);
    }
    if (item.children?.length) {
      messages.push(...collectDuplicateSidebarMenuIndexes(item.children, `${path}.children`));
    }
  });

  return messages;
}

export function warnSidebarMenuListIndexDuplicate(list: SidebarMenuItem[]): void {
  const messages = collectDuplicateSidebarMenuIndexes(list);
  if (!messages.length) {
    return;
  }
  console.warn(`[YSidebar] 菜单 index 重复，请为项设置唯一 prop：\n${messages.join('\n')}`);
}

// 递归查找菜单项（index 为 getSidebarMenuIndex 解析结果）
export function findSidebarMenuItem(
  list: SidebarMenuItem[],
  index: string
): SidebarMenuItem | undefined {
  for (const item of list) {
    if (getSidebarMenuIndex(item) === index) {
      return item;
    }
    if (item.children?.length) {
      const found = findSidebarMenuItem(item.children, index);
      if (found) {
        return found;
      }
    }
  }
}

export interface SidebarProps {
  // 菜单列表
  menuList?: SidebarMenuItem[];
  /** 当前激活菜单 index（`prop ?? path`），映射为 `el-menu` 的 `default-active`，并覆盖 `menu-props.defaultActive` */
  activeMenu?: string;
  // 是否折叠
  collapsed?: boolean;
  // 是否可见
  visible?: boolean;
  // 宽度映射
  widthMap?: Partial<SidebarWidthMap>;
  // 缩进
  indent?: number;
  // 缩进映射:{ level: indent }
  indentMap?: Record<number, number>;
  // 图标最大宽度
  iconMaxWidth?: number;
  // 图标间距
  iconGap?: number;
  // 菜单项高度
  itemHeight?: number;
  // 手风琴模式
  uniqueOpened?: boolean;
  // 折叠过渡
  collapseTransition?: boolean;
  // 是否显示底部
  showFooter?: boolean;
  /** extra 区域默认样式，可被 `menuList[].extraStyle` 覆盖 */
  extraStyle?: Record<string, any>;
  /** 菜单项标题展示（YTextTooltip），与默认配置浅合并 */
  titleProp?: Partial<SidebarTitleConfig>;
  /** 透传到 `el-menu`（不含 `router`、`defaultActive`，高亮请用 `active-menu`） */
  menuProps?: SidebarMenuProps;
}

export interface SidebarEmits {
  'update:collapsed': [value: boolean];
  'update:visible': [value: boolean];
  select: [index: string, item?: SidebarMenuItem];
}

export interface SidebarExpose {
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  hide: () => void;
  show: () => void;
}

export const sidebarProps = {
  menuList: {
    type: Array as PropType<SidebarMenuItem[]>,
    default: () => []
  },
  activeMenu: {
    type: String,
    default: ''
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  },
  widthMap: {
    type: Object as PropType<Partial<SidebarWidthMap>>,
    default: () => ({ ...DEFAULT_SIDEBAR_WIDTH_MAP })
  },
  indent: {
    type: Number,
    default: DEFAULT_SIDEBAR_INDENT
  },
  indentMap: {
    type: Object as PropType<Record<number, number>>,
    default: () => ({})
  },
  iconMaxWidth: {
    type: Number,
    default: DEFAULT_SIDEBAR_ICON_MAX_WIDTH
  },
  iconGap: {
    type: Number,
    default: DEFAULT_SIDEBAR_ICON_GAP
  },
  itemHeight: {
    type: Number,
    default: DEFAULT_SIDEBAR_ITEM_HEIGHT
  },
  uniqueOpened: {
    type: Boolean,
    default: false
  },
  collapseTransition: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  extraStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  titleProp: {
    type: Object as PropType<Partial<SidebarTitleConfig>>,
    default: () => ({})
  },
  menuProps: {
    type: Object as PropType<SidebarMenuProps>,
    default: () => ({})
  }
} as const;

export type SidebarInstance = ExtractPublicPropTypes<typeof sidebarProps>;
