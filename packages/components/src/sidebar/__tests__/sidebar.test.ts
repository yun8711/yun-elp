import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { ElMenu } from 'element-plus';
import { appConfigKey } from '../../app-wrap/src/use-app-config';
import YSidebar from '../src/sidebar.vue';
import type { SidebarMenuItem } from '../src/sidebar';
import {
  collectDuplicateSidebarMenuIndexes,
  findSidebarMenuItem,
  flipSidebarBadgePlacementForRtl,
  flipSidebarTitlePlacementForRtl,
  getSidebarIconOccupy,
  getSidebarMenuIndex,
  getSidebarTextStart,
  resolveSidebarBadge,
  resolveSidebarItemIndent,
  mergeSidebarTitleConfig,
  DEFAULT_SIDEBAR_TITLE_CONFIG
} from '../src/sidebar';

vi.mock('../../../hooks/use-locale', () => ({
  useLocale: () => ({
    t: (key: string) => (key === 'sidebar.collapse' ? '收起菜单' : key)
  })
}));

const menuList: SidebarMenuItem[] = [
  {
    path: '/home',
    title: '首页',
    icon: 'i-home',
    children: [
      { path: '/home/overview', title: '概览' },
      { path: '/home/detail', title: '详情' }
    ]
  },
  { path: '/about', title: '关于' },
  { path: 'https://example.com', title: '外链' }
];

function mountSidebar(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
  return mount(YSidebar, {
    props: {
      menuList,
      activeMenu: '/about',
      ...props
    },
    attachTo: document.body,
    ...options
  });
}

describe('getSidebarMenuIndex / findSidebarMenuItem', () => {
  it('未设置 prop 时使用 path', () => {
    expect(getSidebarMenuIndex({ path: '/a', title: 'A' })).toBe('/a');
  });

  it('设置 prop 时优先 prop', () => {
    expect(getSidebarMenuIndex({ path: '/a', prop: 'menu-a', title: 'A' })).toBe('menu-a');
  });

  it('按 index 查找嵌套节点', () => {
    expect(findSidebarMenuItem(menuList, '/home/detail')?.title).toBe('详情');
    expect(findSidebarMenuItem(menuList, '/missing')).toBeUndefined();
  });

  it('按 prop 查找', () => {
    const list: SidebarMenuItem[] = [
      { path: '/same', prop: 'one', title: '一' },
      { path: '/same', prop: 'two', title: '二' }
    ];
    expect(findSidebarMenuItem(list, 'two')?.title).toBe('二');
  });

  it('collectDuplicateSidebarMenuIndexes 检测同级重复 path', () => {
    const list: SidebarMenuItem[] = [
      { path: '/dup', title: 'A' },
      { path: '/dup', title: 'B' }
    ];
    expect(collectDuplicateSidebarMenuIndexes(list).length).toBeGreaterThan(0);
  });
});

describe('resolveSidebarItemIndent', () => {
  const base = { parentTextStart: 42, indent: 16, indentMap: {} };

  it('一级使用基础缩进', () => {
    expect(
      resolveSidebarItemIndent({
        ...base,
        item: { path: '/a', title: 'A' },
        level: 1,
        parentTextStart: 0
      })
    ).toBe(16);
  });

  it('二级默认对齐上级文本起点', () => {
    expect(
      resolveSidebarItemIndent({
        ...base,
        item: { path: '/a/b', title: 'B' },
        level: 2,
        parentHasIcon: true
      })
    ).toBe(42);
  });

  it('上级无图标时在上级起点上再加一级 indent', () => {
    expect(
      resolveSidebarItemIndent({
        ...base,
        item: { path: '/a/b', title: 'B' },
        level: 2,
        parentHasIcon: false
      })
    ).toBe(58);
  });

  it('上级无图标时优先 indent-map', () => {
    expect(
      resolveSidebarItemIndent({
        ...base,
        item: { path: '/a/b', title: 'B' },
        level: 2,
        parentHasIcon: false,
        indentMap: { 2: 48 }
      })
    ).toBe(48);
  });

  it('indent-map 覆盖自动缩进', () => {
    expect(
      resolveSidebarItemIndent({
        ...base,
        item: { path: '/a/b', title: 'B' },
        level: 2,
        indentMap: { 2: 50 }
      })
    ).toBe(50);
  });

  it('menuList.indent 优先级最高', () => {
    expect(
      resolveSidebarItemIndent({
        ...base,
        item: { path: '/a/b', title: 'B', indent: 72 },
        level: 2,
        indentMap: { 2: 50 }
      })
    ).toBe(72);
  });

  it('文本起点加上图标槽位', () => {
    expect(getSidebarIconOccupy(true)).toBe(24);
    expect(getSidebarIconOccupy(true, 24, 10)).toBe(34);
    expect(getSidebarIconOccupy(false)).toBe(0);
    expect(getSidebarTextStart(16, 24)).toBe(40);
  });
});

describe('YSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('渲染正常', () => {
    const wrapper = mountSidebar();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('y-sidebar');
    expect(wrapper.text()).toContain('首页');
    expect(wrapper.text()).toContain('关于');
    expect(wrapper.find('.y-sidebar__footer').exists()).toBe(false);
  });

  it('支持自定义 yNamespace', () => {
    const wrapper = mountSidebar(
      {},
      {
        global: {
          provide: {
            [appConfigKey as symbol]: {
              yNamespace: 'yp'
            }
          }
        }
      }
    );
    expect(wrapper.classes()).toContain('yp-sidebar');
    expect(wrapper.classes()).not.toContain('y-sidebar');
  });

  it('默认宽度为展开宽度', () => {
    const wrapper = mountSidebar();
    expect(wrapper.attributes('style')).toContain('width: 184px');
  });

  it('折叠时使用 fold 宽度', async () => {
    const wrapper = mountSidebar({ collapsed: true, showFooter: true });
    expect(wrapper.classes()).toContain('y-sidebar--collapsed');
    expect(wrapper.attributes('style')).toContain('width: 54px');
    expect(wrapper.find('.y-sidebar__footer-text').isVisible()).toBe(false);
  });

  it('隐藏时宽度为 0 且不渲染菜单', () => {
    const wrapper = mountSidebar({ visible: false });
    expect(wrapper.classes()).toContain('y-sidebar--hidden');
    expect(wrapper.attributes('style')).toContain('width: 0px');
    expect(wrapper.find('.y-sidebar__menu').exists()).toBe(false);
    expect(wrapper.find('.y-sidebar__footer').exists()).toBe(false);
  });

  it('自定义 widthMap 生效', () => {
    const wrapper = mountSidebar({
      widthMap: { default: 220, fold: 60, hidden: 0 }
    });
    expect(wrapper.attributes('style')).toContain('width: 220px');
  });

  it('showFooter 为 true 时渲染底部折叠条', () => {
    const wrapper = mountSidebar({ showFooter: true });
    expect(wrapper.find('.y-sidebar__footer').exists()).toBe(true);
    expect(wrapper.text()).toContain('收起菜单');
  });

  it('内置底部折叠条具备无障碍属性', () => {
    const wrapper = mountSidebar({ showFooter: true, collapsed: false });
    const footer = wrapper.find('.y-sidebar__footer');
    expect(footer.attributes('role')).toBe('button');
    expect(footer.attributes('aria-expanded')).toBe('true');
    expect(footer.attributes('tabindex')).toBe('0');
  });

  it('自定义 footer 插槽时不加 button 角色', () => {
    const wrapper = mountSidebar(
      { showFooter: true },
      { slots: { footer: '<span class="custom-ft">x</span>' } }
    );
    expect(wrapper.find('.y-sidebar__footer').attributes('role')).toBeUndefined();
  });

  it('点击 footer 切换折叠', async () => {
    const wrapper = mountSidebar({ showFooter: true });
    await wrapper.find('.y-sidebar__footer').trigger('click');
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true]);
  });

  it('expose 方法发出对应事件', async () => {
    const wrapper = mountSidebar();
    const vm = wrapper.vm as any;
    vm.toggle();
    expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([true]);
    vm.collapse();
    expect(wrapper.emitted('update:collapsed')?.[1]).toEqual([true]);
    vm.expand();
    expect(wrapper.emitted('update:collapsed')?.[2]).toEqual([false]);
    vm.hide();
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
    vm.show();
    expect(wrapper.emitted('update:visible')?.[1]).toEqual([true]);
  });

  it('选中菜单时触发 select 并附带菜单项', async () => {
    const wrapper = mountSidebar();
    const menu = wrapper.findComponent(ElMenu);
    menu.vm.$emit('select', '/about');
    await nextTick();
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('/about');
    expect(wrapper.emitted('select')?.[0]?.[1]).toMatchObject({ path: '/about', title: '关于' });
  });

  it('忽略 menuProps.router，el-menu 始终 router 为 false', () => {
    const wrapper = mountSidebar({
      menuProps: { router: true },
      menuList: [{ path: '/about', title: '关于' }]
    });
    expect(wrapper.findComponent(ElMenu).props('router')).toBe(false);
  });

  it('active-menu 覆盖 menuProps.defaultActive', async () => {
    const wrapper = mountSidebar({
      activeMenu: '/about',
      menuProps: { defaultActive: '/home/overview' },
      menuList: [
        {
          path: '/home',
          title: '首页',
          children: [{ path: '/home/overview', title: '概览' }]
        },
        { path: '/about', title: '关于' }
      ]
    });
    const menu = wrapper.findComponent(ElMenu);
    expect(menu.props('defaultActive')).toBe('/about');
    await wrapper.setProps({ activeMenu: '/home/overview' });
    expect(menu.props('defaultActive')).toBe('/home/overview');
  });

  it('showFooter 为 false 时不渲染底部', () => {
    const wrapper = mountSidebar({ showFooter: false });
    expect(wrapper.find('.y-sidebar__footer').exists()).toBe(false);
  });

  it('uniqueOpened 透传到 el-menu', () => {
    const wrapper = mountSidebar({ uniqueOpened: true });
    expect(wrapper.findComponent(ElMenu).props('uniqueOpened')).toBe(true);
  });

  it('嵌套项缩进：上级有图标时与上级文本对齐', () => {
    const wrapper = mountSidebar();
    const nested = wrapper.find('.y-sidebar__item--level-2');
    expect(nested.exists()).toBe(true);
    expect(nested.attributes('style')).toContain('--y-sidebar-item-indent: 40px');
  });

  it('嵌套项缩进：上级无图标时在上级起点上再加一级 indent', () => {
    const wrapper = mountSidebar({
      menuList: [
        {
          path: '/group',
          title: '分组',
          children: [{ path: '/group/a', title: '子项' }]
        }
      ]
    });
    expect(wrapper.find('.y-sidebar__item--level-2').attributes('style')).toContain(
      '--y-sidebar-item-indent: 32px'
    );
  });

  it('嵌套项带图标时仍与上级文本对齐', () => {
    const wrapper = mountSidebar({
      menuList: [
        {
          path: '/home',
          title: '首页',
          icon: 'i-home',
          children: [{ path: '/home/user', title: '用户', icon: 'i-user' }]
        }
      ]
    });
    const nested = wrapper.find('.y-sidebar__item--level-2');
    expect(nested.find('.i-user').exists()).toBe(true);
    expect(nested.attributes('style')).toContain('--y-sidebar-item-indent: 40px');
  });

  it('默认菜单项高度为 50', () => {
    const wrapper = mountSidebar();
    expect(wrapper.attributes('style')).toContain('--y-sidebar-item-height: 50px');
    expect(wrapper.attributes('style')).toContain('--el-menu-item-height: 50px');
  });

  it('itemHeight 写入 CSS 变量', () => {
    const wrapper = mountSidebar({ itemHeight: 40 });
    expect(wrapper.attributes('style')).toContain('--y-sidebar-item-height: 40px');
    expect(wrapper.attributes('style')).toContain('--el-menu-item-height: 40px');
  });

  it('iconMaxWidth 与 iconGap 影响下级缩进', () => {
    const wrapper = mountSidebar({ iconMaxWidth: 24, iconGap: 10 });
    expect(wrapper.find('.y-sidebar__item--level-2').attributes('style')).toContain(
      '--y-sidebar-item-indent: 50px'
    );
  });

  it('menuList.indent 覆盖自动缩进', () => {
    const wrapper = mountSidebar({
      menuList: [
        {
          path: '/home',
          title: '首页',
          icon: 'i-home',
          children: [{ path: '/home/overview', title: '概览', indent: 72 }]
        }
      ]
    });
    expect(wrapper.find('.y-sidebar__item--level-2').attributes('style')).toContain(
      '--y-sidebar-item-indent: 72px'
    );
  });

  it('字符串 icon 渲染为 class', () => {
    const wrapper = mountSidebar();
    expect(wrapper.find('.i-home').exists()).toBe(true);
  });

  it('组件 icon 渲染为 el-icon', () => {
    const DummyIcon = defineComponent({
      name: 'DummyIcon',
      template: '<span class="dummy-icon" />'
    });
    const wrapper = mountSidebar({
      menuList: [{ path: '/home', title: '首页', icon: DummyIcon }]
    });
    expect(wrapper.find('.dummy-icon').exists()).toBe(true);
    expect(wrapper.find('.el-icon').exists()).toBe(true);
  });

  it('默认标题使用 YTextTooltip 单行省略', () => {
    const wrapper = mountSidebar({
      menuList: [{ path: '/long', title: 'Very long menu title for i18n' }]
    });
    expect(wrapper.find('.y-text-tooltip').exists()).toBe(true);
  });

  it('titleProp.enabled 为 false 时不渲染 YTextTooltip', () => {
    const wrapper = mountSidebar({
      titleProp: { enabled: false },
      menuList: [{ path: '/a', title: 'Short' }]
    });
    expect(wrapper.find('.y-text-tooltip').exists()).toBe(false);
    expect(wrapper.find('.y-sidebar__title').exists()).toBe(true);
  });

  it('mergeSidebarTitleConfig 合并默认项并在折叠时关闭 model', () => {
    expect(mergeSidebarTitleConfig({ showAfter: 500 }).tooltipProps.showAfter).toBe(500);
    expect(mergeSidebarTitleConfig(undefined).tooltipProps.placement).toBe(
      DEFAULT_SIDEBAR_TITLE_CONFIG.placement
    );
    expect(
      mergeSidebarTitleConfig({ model: 'always' }, { collapsed: true }).tooltipProps.model
    ).toBe('none');
  });

  it('mergeSidebarTitleConfig 在 RTL 下对调 left/right placement', () => {
    expect(mergeSidebarTitleConfig(undefined, { rtl: true }).tooltipProps.placement).toBe('left');
    expect(
      mergeSidebarTitleConfig({ placement: 'left' }, { rtl: true }).tooltipProps.placement
    ).toBe('right');
    expect(
      mergeSidebarTitleConfig({ placement: 'top' }, { rtl: true }).tooltipProps.placement
    ).toBe('top');
  });

  it('flipSidebarTitlePlacementForRtl 处理 -start / -end', () => {
    expect(flipSidebarTitlePlacementForRtl('right-start')).toBe('left-start');
    expect(flipSidebarTitlePlacementForRtl('left-end')).toBe('right-end');
  });

  it('为折叠子菜单 popup 注入 menu-popper 类与样式变量', () => {
    const wrapper = mountSidebar({
      itemHeight: 44,
      menuProps: { popperClass: 'custom-popper' }
    });
    const menu = wrapper.findComponent(ElMenu);
    expect(menu.props('popperClass')).toContain('y-sidebar__menu-popper');
    expect(menu.props('popperClass')).toContain('custom-popper');
    expect(menu.props('popperStyle')).toMatchObject({
      '--y-sidebar-item-height': '44px'
    });
  });

  it('header / icon / title / footer 插槽', () => {
    const wrapper = mountSidebar(
      {},
      {
        slots: {
          header: '<div class="custom-header">Logo</div>',
          icon: '<i class="custom-icon"></i>',
          title: ({ item }: { item: SidebarMenuItem }) => item.title,
          footer: '<div class="custom-footer">自定义</div>'
        }
      }
    );
    expect(wrapper.find('.custom-header').exists()).toBe(true);
    expect(wrapper.find('.custom-icon').exists()).toBe(true);
    expect(wrapper.find('.custom-footer').exists()).toBe(true);
  });

  it('extra 数据字段渲染在标题末尾', () => {
    const wrapper = mountSidebar({
      menuList: [{ path: '/about', title: '关于', icon: 'i-about', extra: 'Beta' }]
    });
    expect(wrapper.find('.y-sidebar__title-extra').text()).toBe('Beta');
  });

  it('#extra 插槽优先于 extra 字段', () => {
    const wrapper = mountSidebar(
      { menuList: [{ path: '/about', title: '关于', extra: 'Beta' }] },
      {
        slots: {
          extra: '<span class="title-extra-slot">NEW</span>'
        }
      }
    );
    expect(wrapper.find('.title-extra-slot').exists()).toBe(true);
    expect(wrapper.find('.y-sidebar__title-extra').text()).toBe('NEW');
  });

  it('extraStyle 应用到 extra 区域，item.extraStyle 覆盖组件 extra-style', () => {
    const wrapper = mountSidebar({
      extraStyle: { fontSize: '12px', color: 'blue' },
      menuList: [
        { path: '/a', title: 'A', extra: 'Beta', extraStyle: { color: 'red' } },
        { path: '/b', title: 'B', extra: 'Hot' }
      ]
    });
    const extras = wrapper.findAll('.y-sidebar__title-extra');
    expect(extras[0].attributes('style')).toContain('font-size: 12px');
    expect(extras[0].attributes('style')).toContain('color: red');
    expect(extras[1].attributes('style')).toContain('font-size: 12px');
    expect(extras[1].attributes('style')).toContain('color: blue');
  });

  it('折叠时仍渲染角标和标题附加（附加内容由折叠样式隐藏）', () => {
    const wrapper = mountSidebar({
      collapsed: true,
      menuList: [{ path: '/msg', title: '消息', icon: 'i-msg', badge: 8, extra: 'NEW' }]
    });
    expect(wrapper.find('.y-sidebar__badge').exists()).toBe(true);
    expect(wrapper.find('.el-badge').exists()).toBe(true);
    expect(wrapper.find('.y-sidebar__title-extra').text()).toBe('NEW');
  });

  it('badge 数字渲染在图标右侧，placement left 时切换类名', () => {
    const wrapper = mountSidebar({
      menuList: [
        { path: '/a', title: 'A', icon: 'i-a', badge: 12 },
        { path: '/b', title: 'B', icon: 'i-b', badge: { value: 3, placement: 'left' } }
      ]
    });
    const badges = wrapper.findAll('.y-sidebar__badge');
    expect(badges).toHaveLength(2);
    expect(badges[0].classes()).toContain('is-right');
    expect(badges[1].classes()).toContain('is-left');
    expect(wrapper.find('.el-badge').exists()).toBe(true);
  });

  it('badge: true 渲染圆点；无图标时仍占用图标位', () => {
    const wrapper = mountSidebar({
      menuList: [
        {
          path: '/group',
          title: '分组',
          badge: true,
          children: [{ path: '/group/a', title: '子项' }]
        }
      ]
    });
    expect(wrapper.find('.el-badge__content.is-dot').exists()).toBe(true);
    expect(wrapper.find('.y-sidebar__item--level-2').attributes('style')).toContain(
      '--y-sidebar-item-indent: 40px'
    );
  });
});

describe('resolveSidebarBadge', () => {
  it('true 为圆点，数字/字符串为 value，false 与空对象不渲染', () => {
    expect(resolveSidebarBadge(true)?.badgeProps).toEqual({ isDot: true });
    expect(resolveSidebarBadge(9)?.badgeProps).toEqual({ value: 9 });
    expect(resolveSidebarBadge('NEW')?.badgeProps).toEqual({ value: 'NEW' });
    expect(resolveSidebarBadge(false)).toBeNull();
    expect(resolveSidebarBadge(undefined)).toBeNull();
    expect(resolveSidebarBadge({})).toBeNull();
    expect(resolveSidebarBadge({ hidden: true, value: 1 })).toBeNull();
  });

  it('默认 placement 为 right，RTL 下对调', () => {
    expect(resolveSidebarBadge(1)?.placement).toBe('right');
    expect(resolveSidebarBadge({ value: 1, placement: 'left' })?.placement).toBe('left');
    expect(resolveSidebarBadge({ value: 1, placement: 'left' }, { rtl: true })?.placement).toBe(
      'right'
    );
    expect(flipSidebarBadgePlacementForRtl('right')).toBe('left');
  });

  it('透传 el-badge 已声明字段且去掉 hidden', () => {
    expect(
      resolveSidebarBadge({
        value: 120,
        max: 99,
        type: 'warning',
        hidden: false,
        isDot: false
      })?.badgeProps
    ).toEqual({
      value: 120,
      max: 99,
      type: 'warning',
      isDot: false
    });
  });
});
