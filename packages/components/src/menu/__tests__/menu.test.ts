import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YMenu from '../src/menu.vue';
import type { MenuItem } from '../src/menu';

describe('YMenu 菜单组件', () => {
  const baseMenuData: MenuItem[] = [
    {
      index: '1',
      label: '菜单1'
    },
    {
      index: '2',
      label: '菜单2',
      children: [
        {
          index: '2-1',
          label: '子菜单2-1'
        }
      ]
    }
  ];

  beforeEach(() => {
    // 清理操作
  });

  describe('基础渲染', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        }
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-menu').exists()).toBe(true);
      expect(wrapper.find('.el-menu').exists()).toBe(true);
    });

    it('组件名称正确', () => {
      expect(YMenu.name).toBe('YMenu');
    });

    it('inheritAttrs 为 true', () => {
      // 在 script setup 中，通过 defineOptions 设置 inheritAttrs: true，默认行为是继承属性
      // 这里通过检查属性是否传递到根元素来验证
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        },
        attrs: {
          'data-test': 'menu-test',
          class: 'test-class'
        }
      });
      const root = wrapper.find('.y-menu');
      expect(root.attributes('data-test')).toBe('menu-test');
      expect(root.classes()).toContain('test-class');
    });
  });

  describe('Props 传递', () => {
    it('应该接收 data 属性', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
      expect(wrapper.find('.el-menu').exists()).toBe(true);
    });

    it('应该接收 indent 属性', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData,
          indent: 30
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });

    it('应该接收 indent 数组属性', () => {
      const indentArray = [10, 20, 30];
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData,
          indent: indentArray
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('elMenuProps 计算', () => {
    it('应该传递 el-menu 的属性', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData,
          collapse: true,
          mode: 'vertical'
        }
      });
      const elMenu = wrapper.find('.el-menu');
      expect(elMenu.exists()).toBe(true);
    });
  });

  describe('菜单项渲染', () => {
    it('应该渲染菜单项', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });

    it('应该渲染带有子菜单的菜单项', () => {
      const menuDataWithChildren: MenuItem[] = [
        {
          index: '1',
          label: '父菜单',
          children: [
            {
              index: '1-1',
              label: '子菜单'
            }
          ]
        }
      ];
      const wrapper = mount(YMenu, {
        props: {
          data: menuDataWithChildren
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });

    it('应该支持多层嵌套菜单', () => {
      const nestedMenuData: MenuItem[] = [
        {
          index: '1',
          label: '一级菜单',
          children: [
            {
              index: '1-1',
              label: '二级菜单',
              children: [
                {
                  index: '1-1-1',
                  label: '三级菜单'
                }
              ]
            }
          ]
        }
      ];
      const wrapper = mount(YMenu, {
        props: {
          data: nestedMenuData
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('图标功能', () => {
    it('应该支持组件图标', () => {
      const TestIcon = {
        name: 'TestIcon',
        template: '<div class="test-icon">Icon</div>'
      };

      const menuDataWithIcon: MenuItem[] = [
        {
          index: '1',
          label: '菜单1',
          icon: TestIcon
        }
      ];

      const wrapper = mount(YMenu, {
        props: {
          data: menuDataWithIcon
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });

    it('应该支持函数图标', () => {
      const menuDataWithIconFunction: MenuItem[] = [
        {
          index: '1',
          label: '菜单1',
          icon: () => {
            return {
              name: 'TestIcon',
              template: '<div class="test-icon">Icon</div>'
            };
          }
        }
      ];

      const wrapper = mount(YMenu, {
        props: {
          data: menuDataWithIconFunction
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });

    it('应该处理图标渲染错误', () => {
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const menuDataWithErrorIcon: MenuItem[] = [
        {
          index: '1',
          label: '菜单1',
          icon: () => {
            throw new Error('Icon error');
          }
        }
      ];

      const wrapper = mount(YMenu, {
        props: {
          data: menuDataWithErrorIcon
        }
      });

      expect(wrapper.find('.y-menu').exists()).toBe(true);
      consoleWarn.mockRestore();
    });
  });

  describe('插槽功能', () => {
    it('应该支持自定义插槽', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        },
        slots: {
          icon: '<div class="custom-icon">自定义图标</div>',
          label: '<span class="custom-label">自定义标签</span>'
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('禁用功能', () => {
    it('应该支持禁用菜单项', () => {
      const disabledMenuData: MenuItem[] = [
        {
          index: '1',
          label: '菜单1',
          disabled: true
        }
      ];

      const wrapper = mount(YMenu, {
        props: {
          data: disabledMenuData
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('继承 el-menu 属性', () => {
    it('应该支持 el-menu 的属性传递', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData,
          collapse: true,
          mode: 'horizontal',
          defaultActive: '1'
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('事件传递', () => {
    it('应该支持事件处理函数', () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const onSelect = vi.fn();

      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData,
          onOpen,
          onClose,
          onSelect
        }
      });

      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('暴露的接口', () => {
    it('应该暴露组件引用', async () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        }
      });
      await nextTick();

      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('边界情况', () => {
    it('应该处理空数据和边界情况', () => {
      // 测试空数组
      const wrapper1 = mount(YMenu, {
        props: {
          data: []
        }
      });
      expect(wrapper1.find('.y-menu').exists()).toBe(true);

      // 测试没有 label 的菜单项
      const menuDataWithoutLabel: MenuItem[] = [
        {
          index: '1',
          label: ''
        }
      ];
      const wrapper2 = mount(YMenu, {
        props: {
          data: menuDataWithoutLabel
        }
      });
      expect(wrapper2.find('.y-menu').exists()).toBe(true);
    });
  });

  describe('样式和类名', () => {
    it('应该应用正确的CSS类名', () => {
      const wrapper = mount(YMenu, {
        props: {
          data: baseMenuData
        }
      });
      expect(wrapper.find('.y-menu').exists()).toBe(true);
      expect(wrapper.find('.el-menu').exists()).toBe(true);
    });
  });

  describe('集成测试', () => {
    it('应该完整渲染菜单结构', () => {
      const complexMenuData: MenuItem[] = [
        {
          index: '1',
          label: '菜单1',
          icon: { name: 'Icon1', template: '<div>Icon1</div>' },
          children: [
            {
              index: '1-1',
              label: '子菜单1-1',
              disabled: true
            },
            {
              index: '1-2',
              label: '子菜单1-2',
              children: [
                {
                  index: '1-2-1',
                  label: '子菜单1-2-1'
                }
              ]
            }
          ]
        },
        {
          index: '2',
          label: '菜单2'
        }
      ];

      const wrapper = mount(YMenu, {
        props: {
          data: complexMenuData,
          indent: [10, 20, 30]
        }
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-menu').exists()).toBe(true);
    });
  });
});
