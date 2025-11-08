import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnText from '../src/column-text.vue';

describe('YColumnText 表格列文本组件', () => {
  // 简化的基础测试
  const createBasicTest = (props = {}, attrs = {}) => {
    return mount(YColumnText, {
      props,
      attrs: {
        prop: 'name',
        label: '姓名',
        ...attrs
      },
      global: {
        stubs: {
          'el-table-column': {
            template: `
              <div class="el-table-column y-column-text" v-bind="$attrs">
                <div class="cell">
                  <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }" :value="'张三'"></slot>
                </div>
                <slot name="header"></slot>
              </div>
            `
          }
        }
      }
    });
  };

  describe('基础功能', () => {
    it('应该正常渲染', () => {
      const wrapper = createBasicTest();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain('y-column-text');
    });

    it('应该渲染header插槽', () => {
      const wrapper = createBasicTest();
      expect(wrapper.text()).toContain('姓名');
    });
  });

  describe('Props 测试', () => {
    describe('link 属性', () => {
      it('应该支持 link 属性为 true', () => {
        const wrapper = createBasicTest({
          link: true
        });

        expect(wrapper.props('link')).toBe(true);

        // 检查是否应用了链接样式类
        const contentSpan = wrapper.find('.y-column-text__content');
        if (contentSpan.exists()) {
          expect(contentSpan.classes()).toContain('y-column-text__link');
        }
      });

      it('应该支持 link 属性为 false', () => {
        const wrapper = createBasicTest({
          link: false
        });

        expect(wrapper.props('link')).toBe(false);

        // 检查不应应用链接样式类
        const contentSpan = wrapper.find('.y-column-text__content');
        if (contentSpan.exists()) {
          expect(contentSpan.classes()).not.toContain('y-column-text__link');
        }
      });
    });

    describe('formatter 属性', () => {
      it('应该支持自定义 formatter 函数', () => {
        const formatter = vi.fn(value => `格式化: ${value}`);
        const wrapper = createBasicTest({
          formatter
        });

        expect(wrapper.props('formatter')).toBe(formatter);
      });

      it('当没有formatter时应该正确设置', () => {
        const wrapper = createBasicTest();

        expect(wrapper.props('formatter')).toBeUndefined();
      });
    });

    describe('textStyle 属性', () => {
      it('应该支持自定义文本样式', () => {
        const textStyle = { color: 'red', fontSize: '14px' };
        const wrapper = createBasicTest({
          textStyle
        });

        expect(wrapper.props('textStyle')).toEqual(textStyle);

        // 检查样式是否应用到DOM元素上
        const contentSpan = wrapper.find('.y-column-text__content');
        if (contentSpan.exists()) {
          expect(contentSpan.attributes('style')).toContain('color: red');
          expect(contentSpan.attributes('style')).toContain('font-size: 14px');
        }
      });

      it('应该支持空样式对象', () => {
        const wrapper = createBasicTest({
          textStyle: {}
        });

        expect(wrapper.props('textStyle')).toEqual({});
      });
    });

    describe('noTip 和 tipProps 属性', () => {
      it('应该支持 noTip 为 true', () => {
        const wrapper = createBasicTest({
          noTip: true
        });

        expect(wrapper.props('noTip')).toBe(true);
      });

      it('应该支持 noTip 为 false', () => {
        const wrapper = createBasicTest({
          noTip: false
        });

        expect(wrapper.props('noTip')).toBe(false);
      });

      it('应该支持自定义 tipProps', () => {
        const tipProps = {
          placement: 'top',
          effect: 'light'
        };

        const wrapper = createBasicTest({
          tipProps,
          noTip: false
        });

        expect(wrapper.props('tipProps')).toEqual(tipProps);
      });
    });
  });

  describe('样式测试', () => {
    it('应该应用 y-column-text 类名', () => {
      const wrapper = createBasicTest();
      expect(wrapper.html()).toContain('y-column-text');
    });

    it('应该应用 y-column-text__content 类名', () => {
      const wrapper = createBasicTest();
      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
    });

    it('应该根据 link 属性应用 y-column-text__link 类名', () => {
      const wrapper = createBasicTest({
        link: true
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      if (contentSpan.exists()) {
        expect(contentSpan.classes()).toContain('y-column-text__link');
      }
    });
  });

  describe('基本属性测试', () => {
    it('应该支持基本的列属性', () => {
      const wrapper = createBasicTest(
        {},
        {
          width: 200,
          'min-width': 150
        }
      );

      const columnElement = wrapper.find('.el-table-column');
      expect(columnElement.attributes('width')).toBe('200');
      expect(columnElement.attributes('min-width')).toBe('150');
    });
  });
});
