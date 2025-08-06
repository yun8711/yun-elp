import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YDrawer from '../src/drawer.vue';

// Mock useAppConfig
vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: () => ({
    size: '640px',
    confirmText: '确定',
    cancelText: '取消',
    titleStyle: {}
  })
}));

// Mock useLocale
vi.mock('../../../hooks/use-locale', () => ({
  useLocale: () => ({
    t: (key: string) => key === 'common.confirm' ? '确定' : key === 'common.cancel' ? '取消' : key
  })
}));

describe('YDrawer', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(YDrawer, {
      global: {
        stubs: {
          'el-drawer': {
            template: '<div class="el-drawer"><slot name="header"></slot><slot></slot><slot name="footer"></slot></div>',
            props: ['modelValue', 'headerClass', 'bodyClass', 'footerClass', 'size', 'with-header']
          },
          'y-button': {
            template: '<button class="y-button"><slot></slot></button>',
            props: ['type', 'disabled']
          }
        }
      }
    });
  });

  describe('基础渲染', () => {
    it('组件应该正常渲染', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-drawer').exists()).toBe(true);
    });
  });

  describe('Props 测试', () => {
    it('应该正确设置 title', async () => {
      await wrapper.setProps({ title: '测试标题' });
      await nextTick();
      expect(wrapper.text()).toContain('测试标题');
    });

    it('应该正确设置 confirmText', async () => {
      await wrapper.setProps({ confirmText: '自定义确认' });
      await nextTick();
      expect(wrapper.text()).toContain('自定义确认');
    });

    it('应该正确设置 cancelText', async () => {
      await wrapper.setProps({ cancelText: '自定义取消' });
      await nextTick();
      expect(wrapper.text()).toContain('自定义取消');
    });
  });

  describe('方法测试', () => {
    it('open 方法应该正确工作', async () => {
      expect(wrapper.vm.show).toBe(false);
      await wrapper.vm.open();
      expect(wrapper.vm.show).toBe(true);
    });

    it('close 方法应该正确工作', async () => {
      // 先打开
      await wrapper.vm.open();
      expect(wrapper.vm.show).toBe(true);

      // 再关闭
      await wrapper.vm.close();
      expect(wrapper.vm.show).toBe(false);
    });
  });

  describe('插槽测试', () => {
    it('应该正确渲染默认插槽', () => {
      const wrapperWithSlot = mount(YDrawer, {
        global: {
          stubs: {
            'el-drawer': {
              template: '<div class="el-drawer"><slot name="header"></slot><slot></slot><slot name="footer"></slot></div>',
              props: ['modelValue', 'headerClass', 'bodyClass', 'footerClass', 'size', 'with-header']
            },
            'y-button': {
              template: '<button class="y-button"><slot></slot></button>',
              props: ['type', 'disabled']
            }
          }
        },
        slots: {
          default: '<div class="test-content">测试内容</div>'
        }
      });
      expect(wrapperWithSlot.find('.test-content').exists()).toBe(true);
      expect(wrapperWithSlot.text()).toContain('测试内容');
    });

    it('应该正确渲染 header 插槽', () => {
      const wrapperWithHeader = mount(YDrawer, {
        global: {
          stubs: {
            'el-drawer': {
              template: '<div class="el-drawer"><slot name="header"></slot><slot></slot><slot name="footer"></slot></div>',
              props: ['modelValue', 'headerClass', 'bodyClass', 'footerClass', 'size', 'with-header']
            },
            'y-button': {
              template: '<button class="y-button"><slot></slot></button>',
              props: ['type', 'disabled']
            }
          }
        },
        slots: {
          header: '<div class="custom-header">自定义头部</div>'
        }
      });
      expect(wrapperWithHeader.find('.custom-header').exists()).toBe(true);
      expect(wrapperWithHeader.text()).toContain('自定义头部');
    });
  });

  describe('组件暴露的方法', () => {
    it('应该暴露 open 方法', () => {
      expect(typeof wrapper.vm.open).toBe('function');
    });

    it('应该暴露 close 方法', () => {
      expect(typeof wrapper.vm.close).toBe('function');
    });

    it('应该暴露 scrollbarRef', () => {
      expect(wrapper.vm.scrollbarRef).toBeDefined();
    });
  });
});
