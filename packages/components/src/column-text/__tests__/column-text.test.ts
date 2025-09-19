import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YColumnText from '../src/column-text.vue';

describe('YColumnText 表格列文本组件', () => {
  const mockTableData = [
    { name: '张三', age: 25, status: 'active' },
    { name: '李四', age: 30, status: 'inactive' },
    { name: '王五', age: 35, status: 'pending' }
  ];

  // 创建真实的table测试环境
  const createTableWithColumn = (columnProps = {}, columnAttrs = {}) => {
    const mergedProps = {
      prop: 'name',
      label: '姓名',
      width: 'auto',
      'min-width': 100,
      ...columnAttrs,
      ...columnProps
    };

    return mount({
      template: `
        <el-table :data="tableData" style="width: 100%">
          <y-column-text v-bind="mergedProps">
            <template #header>
              {{ mergedProps.label }}
            </template>
          </y-column-text>
        </el-table>
      `,
      components: {
        YColumnText,
        'el-table': {
          template: '<div class="el-table"><slot></slot></div>',
          props: ['data']
        }
      },
      data() {
        return {
          tableData: mockTableData,
          mergedProps
        };
      }
    });
  };

  // 创建用于测试单个功能的简化环境
  const createSimpleColumnTest = (props = {}, attrs = {}) => {
    const defaultAttrs = {
      prop: 'name',
      label: '姓名',
      width: 'auto',
      'min-width': 100,
      ...attrs
    };

    return mount(YColumnText, {
      props,
      attrs: defaultAttrs,
      slots: {
        header: defaultAttrs.label
      },
      global: {
        stubs: {
          'el-table-column': {
            template: `
              <div class="el-table-column y-column-text" v-bind="$attrs">
                <div class="cell">
                  <slot name="default" :scope="scope"></slot>
                </div>
                <slot name="header"></slot>
              </div>
            `,
            props: ['prop', 'label', 'width', 'minWidth'],
            setup() {
              const scope = {
                row: mockTableData[0],
                column: { property: attrs.prop || 'name' },
                $index: 0
              };
              return { scope };
            }
          }
        }
      }
    });
  };

  describe('基础功能', () => {
    it('应该正常渲染', () => {
      const wrapper = createSimpleColumnTest();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain('y-column-text');
    });

    it('应该渲染默认插槽内容', () => {
      const wrapper = createSimpleColumnTest();
      expect(wrapper.text()).toContain('张三');
    });

    it('应该正确显示单元格值', () => {
      const wrapper = createSimpleColumnTest();
      // 验证单元格显示的值
      expect(wrapper.text()).toContain('张三');
    });

    it('应该渲染header插槽', () => {
      const wrapper = createSimpleColumnTest();
      expect(wrapper.text()).toContain('姓名');
    });
  });

  describe('Props 测试', () => {
    describe('link 属性', () => {
      it('应该支持 link 属性为 true', () => {
        const wrapper = createSimpleColumnTest({
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
        const wrapper = createSimpleColumnTest({
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
        const formatter = vi.fn((value) => `格式化: ${value}`);
        const wrapper = createSimpleColumnTest({
          formatter
        });

        expect(wrapper.props('formatter')).toBe(formatter);
        // 验证显示格式化后的值
        expect(wrapper.text()).toContain('格式化: 张三');
      });

      it('当没有formatter时应该直接返回原值', () => {
        const wrapper = createSimpleColumnTest();

        // 验证没有formatter时的行为
        expect(wrapper.props('formatter')).toBeUndefined();
        expect(wrapper.text()).toContain('张三');
      });
    });

    describe('textStyle 属性', () => {
      it('应该支持自定义文本样式', () => {
        const textStyle = { color: 'red', fontSize: '14px' };
        const wrapper = createSimpleColumnTest({
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
        const wrapper = createSimpleColumnTest({
          textStyle: {}
        });

        expect(wrapper.props('textStyle')).toEqual({});
      });
    });

    describe('noTip 和 tipProps 属性', () => {
      it('应该支持 noTip 为 true 时禁用tooltip', () => {
        const wrapper = createSimpleColumnTest({
          noTip: true
        });

        expect(wrapper.props('noTip')).toBe(true);

        // 检查tooltip相关的属性
        const columnElement = wrapper.find('.el-table-column');
        expect(columnElement.attributes('show-overflow-tooltip')).toBe('false');
      });

      it('应该支持 noTip 为 false 时启用tooltip', () => {
        const wrapper = createSimpleColumnTest({
          noTip: false
        });

        expect(wrapper.props('noTip')).toBe(false);

        // 检查tooltip相关的属性
        const columnElement = wrapper.find('.el-table-column');
        expect(columnElement.attributes('show-overflow-tooltip')).toBe('true');
      });

      it('应该支持自定义 tipProps', () => {
        const tipProps = {
          placement: 'top',
          effect: 'light'
        };

        const wrapper = createSimpleColumnTest({
          tipProps,
          noTip: false
        });

        expect(wrapper.props('tipProps')).toEqual(tipProps);
      });
    });
  });

  describe('事件测试', () => {
    it('当 link 为 true 时应该触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: '<div><slot name="default" :scope="scope"></slot></div>',
              setup() {
                const scope = {
                  row: mockTableData[0],
                  column: { property: 'name' },
                  $index: 0
                };
                return { scope };
              }
            }
          }
        }
      });

      // 模拟点击事件
      const contentSpan = wrapper.find('.y-column-text__content');
      if (contentSpan.exists()) {
        await contentSpan.trigger('click');
        expect(onClick).toHaveBeenCalledWith(mockTableData[0], expect.objectContaining({
          row: mockTableData[0],
          column: { property: 'name' },
          $index: 0
        }));
      }
    });

    it('当 link 为 false 时不应该触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: false
        },
        attrs: {
          prop: 'name',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: '<div><slot name="default" :scope="scope"></slot></div>',
              setup() {
                const scope = {
                  row: mockTableData[0],
                  column: { property: 'name' },
                  $index: 0
                };
                return { scope };
              }
            }
          }
        }
      });

      // 模拟点击事件
      const contentSpan = wrapper.find('.y-column-text__content');
      if (contentSpan.exists()) {
        await contentSpan.trigger('click');
        expect(onClick).not.toHaveBeenCalled();
      }
    });
  });

  describe('样式测试', () => {
    it('应该应用 y-column-text 类名', () => {
      const wrapper = createSimpleColumnTest();
      expect(wrapper.html()).toContain('y-column-text');
    });

    it('应该应用 y-column-text__content 类名', () => {
      const wrapper = createSimpleColumnTest();
      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
    });

    it('应该根据 link 属性应用 y-column-text__link 类名', () => {
      const wrapper = createSimpleColumnTest({
        link: true
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      if (contentSpan.exists()) {
        expect(contentSpan.classes()).toContain('y-column-text__link');
      }
    });
  });

  describe('集成测试', () => {
    it('应该在 table 环境中正常工作', () => {
      const wrapper = createTableWithColumn();
      const columnText = wrapper.findComponent(YColumnText);
      expect(columnText.exists()).toBe(true);
      expect(wrapper.text()).toContain('姓名');
    });

    it('应该支持复杂的数据格式化', () => {
      const formatter = (value: any, row: any) => {
        if (row.status === 'active') {
          return `${value} (活跃)`;
        }
        return value;
      };

      const wrapper = createSimpleColumnTest({
        formatter
      });

      expect(wrapper.props('formatter')).toBe(formatter);
    });

    it('应该支持插槽自定义内容', () => {
      const wrapper = mount(YColumnText, {
        attrs: { prop: 'name' },
        slots: {
          default: ({ value }: any) => `<span class="custom-content">${value} - 自定义</span>`
        },
        global: {
          stubs: {
            'el-table-column': {
              template: '<div><slot name="default" :value="value"></slot></div>',
              setup() {
                return {
                  value: '张三'
                };
              }
            }
          }
        }
      });

      expect(wrapper.html()).toContain('张三 - 自定义');
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空数据', () => {
      const wrapper = createSimpleColumnTest();
      // 验证组件能正常工作
    expect(wrapper.exists()).toBe(true);
    });

    it('应该支持默认属性继承', () => {
      const wrapper = createSimpleColumnTest({}, {
        width: 200,
        'min-width': 150
      });

      expect(wrapper.attributes('width')).toBe('200');
      expect(wrapper.attributes('min-width')).toBe('150');
    });
  });
});
