/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import YAppWrap from '../src/app-wrap.vue';
import type { AppWrapProps } from '../src/app-wrap';
import { useAppConfig } from '../src/use-app-config';

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElConfigProvider: {
    name: 'ElConfigProvider',
    props: ['locale', 'size', 'zIndex', 'namespace'],
    template: '<div class="el-config-provider" v-bind="$attrs"><slot></slot></div>',
    inheritAttrs: true
  }
}));

// 测试工具函数
const createWrapper = (props: Partial<AppWrapProps> = {}, slots = {}) => {
  return mount(YAppWrap, {
    props,
    slots,
    global: {
      stubs: {
        'el-config-provider': {
          template: '<div class="el-config-provider" v-bind="$attrs"><slot></slot></div>',
          inheritAttrs: true
        }
      }
    }
  });
};

describe('YAppWrap 应用容器', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基础渲染测试', () => {
    it('应该正确渲染组件基础结构', () => {
      const wrapper = createWrapper();

      expect(wrapper.find('.el-config-provider').exists()).toBe(true);
      expect(wrapper.html()).toContain('slot');
    });

    it('应该有正确的组件名称', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.$options.name).toBe('YAppWrap');
    });
  });

  describe('Props接收测试', () => {
    it('应该接受locale prop', () => {
      const wrapper = createWrapper({ locale: 'en' });

      expect(wrapper.vm.$props.locale).toBe('en');
    });

    it('应该接受elpConfig prop', () => {
      const elpConfig = {
        size: 'large' as const,
        zIndex: 3000,
        namespace: 'el',
        a11y: true,
        keyboardNavigation: true
      };

      const wrapper = createWrapper({ elpConfig });

      expect(wrapper.vm.$props.elpConfig).toEqual(elpConfig);
    });

    it('应该接受borderLabel配置', () => {
      const borderLabel = {
        width: '400px',
        height: '50px'
      };

      const wrapper = createWrapper({ borderLabel });

      expect(wrapper.vm.$props.borderLabel).toEqual(borderLabel);
    });

    it('应该接受完整的配置对象', () => {
      const fullConfig: Partial<AppWrapProps> = {
        locale: 'en',
        borderLabel: {
          width: '500px',
          height: '60px'
        },
        pageHeader: {
          height: '70px',
          border: true
        },
        button: {
          delay: 400
        }
      };

      const wrapper = createWrapper(fullConfig);

      expect(wrapper.vm.$props.locale).toBe('en');
      expect(wrapper.vm.$props.borderLabel).toEqual({ width: '500px', height: '60px' });
      expect(wrapper.vm.$props.pageHeader).toEqual({ height: '70px', border: true });
      expect(wrapper.vm.$props.button).toEqual({ delay: 400 });
    });
  });

  describe('默认值测试', () => {
    it('应该有正确的默认locale值', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.$props.locale).toBe('zh-cn');
    });

    it('应该有正确的默认borderLabel配置', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.$props.borderLabel).toEqual({
        width: '316px',
        height: '32px'
      });
    });

    it('应该有正确的默认elpConfig配置', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.$props.elpConfig).toEqual({
        namespace: 'el',
        a11y: true,
        keyboardNavigation: true,
        size: 'default',
        zIndex: 2000,
        button: {
          autoInsertSpace: true
        },
        message: {
          max: 3,
          grouping: true,
          duration: 3000,
          showClose: true,
          offset: 20
        }
      });
    });
  });

  describe('配置合并测试', () => {
    it('应该正确合并自定义elpConfig和默认配置', () => {
      const customElpConfig = {
        size: 'large' as const,
        zIndex: 3000,
        namespace: 'custom',
        a11y: true,
        keyboardNavigation: true
      };

      const wrapper = createWrapper({ elpConfig: customElpConfig });

      expect(wrapper.vm.$props.elpConfig).toEqual(customElpConfig);
    });

    it('应该正确合并部分配置', () => {
      const partialConfig = {
        borderLabel: {
          width: '400px' // 只覆盖width，height应该保持默认值
        }
      };

      const wrapper = createWrapper(partialConfig);

      expect(wrapper.vm.$props.borderLabel).toEqual({
        width: '400px',
        height: '32px' // 默认值
      });
    });
  });

  describe('useAppConfig钩子测试', () => {
    it('应该能通过useAppConfig获取全局配置', () => {
      // Mock inject返回值
      const mockConfig = {
        borderLabel: { width: '400px' },
        pageHeader: { height: '60px' }
      };

      // Mock inject
      vi.mock('@vue/runtime-core', async () => {
        const actual = await vi.importActual('@vue/runtime-core');
        return {
          ...actual,
          inject: vi.fn(() => mockConfig)
        };
      });

      // 重新导入以应用mock
      const { useAppConfig: mockedUseAppConfig } = require('../src/use-app-config');

      const config = mockedUseAppConfig();

      expect(config).toEqual(mockConfig);
    });

    it('应该能通过useAppConfig获取指定键的配置', () => {
      const mockConfig = {
        borderLabel: { width: '400px' },
        pageHeader: { height: '60px' }
      };

      vi.mock('@vue/runtime-core', async () => {
        const actual = await vi.importActual('@vue/runtime-core');
        return {
          ...actual,
          inject: vi.fn(() => mockConfig)
        };
      });

      const { useAppConfig: mockedUseAppConfig } = require('../src/use-app-config');

      const borderLabelConfig = mockedUseAppConfig('borderLabel');

      expect(borderLabelConfig).toEqual({ width: '400px' });
    });

    it('当没有配置时应该返回空对象', () => {
      vi.mock('@vue/runtime-core', async () => {
        const actual = await vi.importActual('@vue/runtime-core');
        return {
          ...actual,
          inject: vi.fn(() => ({}))
        };
      });

      const { useAppConfig: mockedUseAppConfig } = require('../src/use-app-config');

      const config = mockedUseAppConfig();
      const specificConfig = mockedUseAppConfig('nonexistent');

      expect(config).toEqual({});
      expect(specificConfig).toBeUndefined();
    });
  });

  describe('集成测试', () => {
    it('应该能与子组件正常配合工作', () => {
      const wrapper = createWrapper(
        {
          locale: 'en',
          borderLabel: { width: '400px' }
        },
        {
          default: '测试内容'
        }
      );

      // 验证组件渲染正常
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain('测试内容');
      expect(wrapper.find('.el-config-provider').exists()).toBe(true);
    });

    it('应该支持复杂的配置对象', () => {
      const complexConfig: Partial<AppWrapProps> = {
        dialog: {
          titleStyle: { fontSize: '18px' },
          confirmText: '确定',
          confirmProps: { }
        },
        table: {
          emptyProps: { description: '暂无数据' },
          paginationProps: {
            pageSize: 20,
            disabled: false,
            teleported: true,
            popperClass: '',
            small: false,
            background: false,
            pagerCount: 7,
            layout: 'prev, pager, next',
            pageSizes: [10, 20, 30, 40, 50, 100],
            prevText: '',
            nextText: '',
            prevIcon: '',
            nextIcon: '',
            hideOnSinglePage: false
          }
        },
        echarts: {
          theme: 'dark',
          chartTypes: ['LineChart', 'BarChart']
        }
      };

      const wrapper = createWrapper(complexConfig);

      // 验证组件能接收复杂配置
      expect(wrapper.vm.$props.dialog).toEqual({
        titleStyle: { fontSize: '18px' },
        confirmText: '确定',
        confirmProps: { type: 'primary' }
      });

      expect(wrapper.vm.$props.table).toEqual({
        emptyProps: { description: '暂无数据' },
        paginationProps: { pageSize: 20 }
      });

      expect(wrapper.vm.$props.echarts).toEqual({
        theme: 'dark',
        chartTypes: ['LineChart', 'BarChart']
      });
    });
  });

  describe('类型安全测试', () => {
    it('应该接受所有AppWrapProps类型', () => {
      const validProps: AppWrapProps = {
        elpConfig: {
          size: 'small',
          zIndex: 2500,
          namespace: 'el',
          a11y: true,
          keyboardNavigation: true
        },
        locale: 'zh-cn',
        borderLabel: {
          width: '300px',
          height: '40px'
        },
        pageHeader: {
          height: '50px',
          border: true,
          titlePath: 'meta.title',
          paddingX: ['10px', '20px'],
          titleTextStyle: { fontSize: '16px' }
        },
        pageFooter: {
          height: '60px',
          left: '100px',
          right: '100px'
        },
        button: {
          delay: 300,
          maxWait: 1000
        },
        drawer: {
          confirmText: '确认',
          cancelText: '取消',
          titleStyle: { color: 'red' },
          confirmProps: { },
          cancelProps: { }
        },
        dialog: {
          confirmText: '确定',
          cancelText: '取消',
          titleStyle: { fontWeight: 'bold' },
          confirmProps: { },
          cancelProps: { }
        },
        empty: {
          image: '/custom-image.png',
          imageSize: 120,
          description: '自定义空状态',
          style: { padding: '20px' }
        },
        textTooltip: {
          placement: 'top',
          tooltipProps: {
            showAfter: 500,
            hideAfter: 100
          }
        },
        desc: {
          labelWidth: '120px',
          labelStyle: { fontWeight: 'bold' },
          contentStyle: { color: 'gray' },
          labelAlign: 'right',
          contentAlign: 'left',
          emptyText: '暂无'
        },
        table: {
          emptyProps: { description: '表格为空' },
          paginationProps: {
            currentPage: 1,
            pageSize: 10,
            disabled: false,
            teleported: true,
            popperClass: '',
            small: false,
            background: false,
            pagerCount: 7,
            layout: 'prev, pager, next',
            pageSizes: [10, 20, 30, 40, 50, 100],
            prevText: '',
            nextText: '',
            prevIcon: '',
            nextIcon: '',
            hideOnSinglePage: false
          }
        },
        columnForms: {
          placement: 'bottom',
          popperClass: 'custom-class'
        },
        columnOperation: {
          disabledDefaultTip: '操作已禁用'
        },
        echarts: {
          theme: 'light',
          chartTypes: ['PieChart'],
          components: ['TooltipComponent'],
          renderers: ['CanvasRenderer'],
          features: ['LabelLayout'],
          initOpts: { width: 800, height: 600 }
        }
      };

      expect(() => createWrapper(validProps)).not.toThrow();
    });
  });
});
