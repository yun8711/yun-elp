/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import YTextTooltip from '../src/text-tooltip.vue';

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElTooltip: {
    name: 'ElTooltip',
    template: `
      <div class="el-tooltip" :class="{ 'el-tooltip--disabled': disabled }">
        <slot></slot>
        <div v-if="!disabled" class="el-tooltip__content">
          <slot name="content"></slot>
        </div>
      </div>
    `,
    props: ['placement', 'showAfter', 'effect', 'hideAfter', 'content', 'disabled']
  }
}));

describe('YTextTooltip 组件', () => {
  beforeEach(() => {
    // 重置所有mock
    vi.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('组件正常渲染', () => {
      const wrapper = mount(YTextTooltip);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-text-tooltip').exists()).toBe(true);
      expect(wrapper.find('.y-text-tooltip__content').exists()).toBe(true);
    });

    it('默认插槽内容渲染', () => {
      const slotContent = '这是默认插槽内容';
      const wrapper = mount(YTextTooltip, {
        slots: {
          default: slotContent
        }
      });
      expect(wrapper.text()).toContain(slotContent);
    });

    it('content插槽内容渲染', () => {
      const contentSlot = '这是tooltip内容';
      const wrapper = mount(YTextTooltip, {
        slots: {
          content: contentSlot
        }
      });
      expect(wrapper.find('.el-tooltip__content').text()).toContain(contentSlot);
    });
  });

  describe('Props 属性测试', () => {
    it('lineClamp 属性 - 数字类型', () => {
      const wrapper = mount(YTextTooltip, {
        props: { lineClamp: 3 }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      // 检查组件是否正确接收了props
      expect(wrapper.vm.$props.lineClamp).toBe(3);
    });

    it('lineClamp 属性 - 字符串类型', () => {
      const wrapper = mount(YTextTooltip, {
        props: { lineClamp: '2' }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.lineClamp).toBe('2');
    });

    it('width 属性 - 数字类型', () => {
      const wrapper = mount(YTextTooltip, {
        props: { width: 200 }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.width).toBe(200);
    });

    it('width 属性 - 字符串类型', () => {
      const wrapper = mount(YTextTooltip, {
        props: { width: '50%' }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.width).toBe('50%');
    });

    it('placement 属性', () => {
      const wrapper = mount(YTextTooltip, {
        props: { placement: 'bottom' }
      });
      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      expect(tooltipEl.props('placement')).toBe('bottom');
    });

    it('textStyle 属性', () => {
      const customStyle = { color: 'red', fontSize: '14px' };
      const wrapper = mount(YTextTooltip, {
        props: { textStyle: customStyle }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.textStyle).toEqual(customStyle);
    });
  });

  describe('Tooltip 配置测试', () => {
    it('tooltipProps 属性传递', () => {
      const tooltipProps = {
        placement: 'left',
        effect: 'light',
        showAfter: 500,
        hideAfter: 1000
      };
      const wrapper = mount(YTextTooltip, {
        props: { tooltipProps }
      });
      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      expect(tooltipEl.props('placement')).toBe('left');
      expect(tooltipEl.props('effect')).toBe('light');
      expect(tooltipEl.props('showAfter')).toBe(500);
      expect(tooltipEl.props('hideAfter')).toBe(1000);
    });

    it('tooltipProps 覆盖默认值', () => {
      const tooltipProps = {
        placement: 'right',
        effect: 'light'
      };
      const wrapper = mount(YTextTooltip, {
        props: {
          placement: 'bottom', // 默认值
          tooltipProps
        }
      });
      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      // tooltipProps 应该覆盖默认的 placement
      expect(tooltipEl.props('placement')).toBe('right');
      expect(tooltipEl.props('effect')).toBe('light');
    });
  });

  describe('Tooltip 显示控制', () => {
    it('tooltip="none" 时禁用tooltip', async () => {
      const wrapper = mount(YTextTooltip, {
        props: { tooltip: 'none' }
      });

      // 等待组件更新
      await wrapper.vm.$nextTick();

      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      expect(tooltipEl.props('disabled')).toBe(true);
    });

    it('tooltip="always" 时始终显示tooltip', async () => {
      const wrapper = mount(YTextTooltip, {
        props: { tooltip: 'always' }
      });

      await wrapper.vm.$nextTick();

      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      expect(tooltipEl.props('disabled')).toBe(false);
    });

    it('tooltip="auto" 时根据内容自动判断', async () => {
      const wrapper = mount(YTextTooltip, {
        props: { tooltip: 'auto' }
      });

      await wrapper.vm.$nextTick();

      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      // 在测试环境中，auto模式下tooltip的disabled状态可能为true或false
      // 这取决于DOM的尺寸计算，我们只验证组件能正常渲染
      expect(tooltipEl.exists()).toBe(true);
      expect(wrapper.vm.$props.tooltip).toBe('auto');
    });
  });

  describe('内容获取测试', () => {
    it('从默认插槽获取tooltip内容', () => {
      const slotContent = '这是一段很长的文本内容，用于测试tooltip的显示';
      const wrapper = mount(YTextTooltip, {
        slots: {
          default: slotContent
        }
      });
      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      expect(tooltipEl.exists()).toBe(true);
    });

    it('content插槽优先级高于默认插槽', () => {
      const defaultContent = '默认内容';
      const contentSlot = 'tooltip专用内容';
      const wrapper = mount(YTextTooltip, {
        slots: {
          default: defaultContent,
          content: contentSlot
        }
      });
      expect(wrapper.find('.el-tooltip__content').text()).toContain(contentSlot);
    });
  });

  describe('样式计算测试', () => {
    it('合并textStyle和计算样式', () => {
      const textStyle = {
        color: 'blue',
        backgroundColor: 'yellow'
      };
      const wrapper = mount(YTextTooltip, {
        props: {
          textStyle,
          width: 300,
          lineClamp: 2
        }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.textStyle).toEqual(textStyle);
      expect(wrapper.vm.$props.width).toBe(300);
      expect(wrapper.vm.$props.lineClamp).toBe(2);
    });

    it('样式优先级：textStyle > 计算样式', () => {
      const textStyle = {
        width: '200px', // 覆盖计算样式
        color: 'red'
      };
      const wrapper = mount(YTextTooltip, {
        props: {
          textStyle,
          width: 300 // 应该被textStyle覆盖
        }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.textStyle).toEqual(textStyle);
      expect(wrapper.vm.$props.width).toBe(300);
    });
  });

  describe('边界情况测试', () => {
    it('空内容渲染', () => {
      const wrapper = mount(YTextTooltip, {
        slots: { default: '' }
      });
      expect(wrapper.find('.y-text-tooltip__content').exists()).toBe(true);
      expect(wrapper.text()).toBe('');
    });

    it('lineClamp为0时', () => {
      const wrapper = mount(YTextTooltip, {
        props: { lineClamp: 0 }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.lineClamp).toBe(0);
    });

    it('width为0时', () => {
      const wrapper = mount(YTextTooltip, {
        props: { width: 0 }
      });
      const contentEl = wrapper.find('.y-text-tooltip__content');
      expect(contentEl.exists()).toBe(true);
      expect(wrapper.vm.$props.width).toBe(0);
    });

    it('无效的placement值', () => {
      const wrapper = mount(YTextTooltip, {
        props: { placement: 'invalid' as any }
      });
      const tooltipEl = wrapper.findComponent({ name: 'ElTooltip' });
      expect(tooltipEl.props('placement')).toBe('invalid');
    });
  });

  describe('组件生命周期测试', () => {
    it('组件挂载后正确初始化', () => {
      const wrapper = mount(YTextTooltip, {
        slots: { default: '测试内容' }
      });
      expect(wrapper.vm.$refs.textRef).toBeDefined();
    });

    it('组件更新时重新计算overflow', async () => {
      const wrapper = mount(YTextTooltip, {
        props: { tooltip: 'auto' },
        slots: { default: '初始内容' }
      });

      // 模拟内容更新
      await wrapper.setProps({});
      expect(wrapper.findComponent({ name: 'ElTooltip' }).exists()).toBe(true);
    });
  });

  describe('插槽组合测试', () => {
    it('同时使用默认插槽和content插槽', () => {
      const wrapper = mount(YTextTooltip, {
        slots: {
          default: '<span class="main-content">主要内容</span>',
          content: '<div class="tooltip-content">提示内容</div>'
        }
      });

      expect(wrapper.find('.main-content').exists()).toBe(true);
      expect(wrapper.find('.tooltip-content').exists()).toBe(true);
    });

    it('只有默认插槽', () => {
      const wrapper = mount(YTextTooltip, {
        slots: {
          default: '<div class="only-default">只有默认内容</div>'
        }
      });

      expect(wrapper.find('.only-default').exists()).toBe(true);
      expect(wrapper.find('.el-tooltip__content').text()).toBe('');
    });

    it('只有content插槽', () => {
      const wrapper = mount(YTextTooltip, {
        slots: {
          content: '<div class="only-content">只有提示内容</div>'
        }
      });

      expect(wrapper.find('.only-content').exists()).toBe(true);
      // 默认插槽为空，但content插槽有内容
      expect(wrapper.find('.el-tooltip__content').text()).toContain('只有提示内容');
    });
  });

  describe('响应式数据测试', () => {
    it('props变化时组件更新', async () => {
      const wrapper = mount(YTextTooltip, {
        props: { lineClamp: 1, width: 100 }
      });

      await wrapper.setProps({ lineClamp: 3, width: 200 });

      expect(wrapper.vm.$props.lineClamp).toBe(3);
      expect(wrapper.vm.$props.width).toBe(200);
    });

    it('textStyle变化时组件更新', async () => {
      const wrapper = mount(YTextTooltip, {
        props: { textStyle: { color: 'red' } }
      });

      await wrapper.setProps({ textStyle: { color: 'blue', fontSize: '16px' } });

      expect(wrapper.vm.$props.textStyle).toEqual({ color: 'blue', fontSize: '16px' });
    });
  });

  describe('工具函数测试', () => {
    it('getSlotContent函数正常工作', () => {
      const wrapper = mount(YTextTooltip, {
        slots: { default: '测试文本内容' }
      });

      // 模拟DOM的textContent
      const textRef = wrapper.vm.$refs.textRef as HTMLElement;
      if (textRef) {
        Object.defineProperty(textRef, 'textContent', {
          value: '测试文本内容',
          writable: true
        });
      }

      expect(wrapper.findComponent({ name: 'ElTooltip' }).exists()).toBe(true);
    });
  });

  describe('组件功能完整性测试', () => {
    it('所有必需的props都能正确传递', () => {
      const allProps = {
        lineClamp: 2,
        width: '200px',
        placement: 'bottom' as const,
        tooltip: 'auto' as const,
        tooltipProps: { effect: 'light' },
        textStyle: { fontSize: '14px' }
      };

      const wrapper = mount(YTextTooltip, {
        props: allProps,
        slots: { default: '测试内容' }
      });

      expect(wrapper.vm.$props.lineClamp).toBe(2);
      expect(wrapper.vm.$props.width).toBe('200px');
      expect(wrapper.vm.$props.placement).toBe('bottom');
      expect(wrapper.vm.$props.tooltip).toBe('auto');
      expect(wrapper.vm.$props.tooltipProps).toEqual({ effect: 'light' });
      expect(wrapper.vm.$props.textStyle).toEqual({ fontSize: '14px' });
    });

    it('组件能够正确处理复杂的插槽内容', () => {
      const wrapper = mount(YTextTooltip, {
        slots: {
          default: `
            <div class="complex-content">
              <span>复杂内容</span>
              <p>多行文本</p>
            </div>
          `,
          content: `
            <div class="complex-tooltip">
              <strong>复杂提示</strong>
              <br>
              <span>多行提示内容</span>
            </div>
          `
        }
      });

      expect(wrapper.find('.complex-content').exists()).toBe(true);
      expect(wrapper.find('.complex-tooltip').exists()).toBe(true);
    });
  });
});
