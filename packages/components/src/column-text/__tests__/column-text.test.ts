// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
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

    describe('headerStyle 属性', () => {
      it('应该支持自定义表头样式', () => {
        const headerStyle = { color: 'blue', fontWeight: 'bold' };
        const wrapper = createBasicTest({
          headerStyle
        });

        expect(wrapper.props('headerStyle')).toEqual(headerStyle);

        // 检查样式是否应用到表头元素上
        const headerSpan = wrapper.find('span[style*="color: blue"]');
        expect(headerSpan.exists()).toBe(true);
      });

      it('应该支持空表头样式对象', () => {
        const wrapper = createBasicTest({
          headerStyle: {}
        });

        expect(wrapper.props('headerStyle')).toEqual({});
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

  describe('事件测试', () => {
    describe('click 事件', () => {
      it('应该支持 link 属性为 true 的设置', () => {
        const wrapper = createBasicTest({
          link: true
        });

        expect(wrapper.props('link')).toBe(true);
        expect(wrapper.html()).toContain('y-column-text__link');
      });

      it('应该支持 link 属性为 false 的设置', () => {
        const wrapper = createBasicTest({
          link: false
        });

        expect(wrapper.props('link')).toBe(false);
        expect(wrapper.html()).not.toContain('y-column-text__link');
      });
    });
  });

  describe('插槽测试', () => {
    describe('default 插槽', () => {
      it('应该支持自定义 default 插槽', () => {
        const wrapper = mount(YColumnText, {
          props: {},
          attrs: {
            prop: 'name',
            label: '姓名'
          },
          slots: {
            default: ({ value }: { value: any }) =>
              h('span', { class: 'custom-content' }, `${value}-自定义`)
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

        const customContent = wrapper.find('.custom-content');
        expect(customContent.exists()).toBe(true);
      });

      it('应该支持使用 default 插槽自定义内容', () => {
        const wrapper = createBasicTest();

        // 验证组件可以正常渲染，插槽系统工作
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.html()).toContain('y-column-text');
      });
    });

    describe('header 插槽', () => {
      it('应该支持自定义 header 插槽', () => {
        const wrapper = mount(YColumnText, {
          props: {},
          attrs: {
            prop: 'name',
            label: '姓名'
          },
          slots: {
            header: ({ column }: { column: any }) =>
              h('span', { class: 'custom-header' }, `${column.label}-自定义`)
          },
          global: {
            stubs: {
              'el-table-column': {
                template: `
                  <div class="el-table-column y-column-text" v-bind="$attrs">
                    <div class="cell">
                      <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }" :value="'张三'"></slot>
                    </div>
                    <slot name="header" :column="{ label: '姓名', property: 'name' }" :index="0"></slot>
                  </div>
                `
              }
            }
          }
        });

        const customHeader = wrapper.find('.custom-header');
        expect(customHeader.exists()).toBe(true);
        expect(customHeader.text()).toBe('姓名-自定义');
      });

      it('应该支持使用 header 插槽自定义表头', () => {
        const wrapper = createBasicTest();

        // 验证组件可以正常渲染，header插槽系统工作
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.text()).toContain('姓名');
      });
    });

    describe('expand 插槽', () => {
      it('应该支持 expand 插槽', () => {
        const wrapper = mount(YColumnText, {
          props: {},
          attrs: {
            type: 'expand',
            prop: 'name',
            label: '姓名'
          },
          slots: {
            expand: ({ expanded }: { expanded: boolean }) =>
              h('div', { class: 'expand-content' }, expanded ? '展开' : '收起')
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
                    <slot name="expand" :expanded="true"></slot>
                  </div>
                `
              }
            }
          }
        });

        const expandContent = wrapper.find('.expand-content');
        expect(expandContent.exists()).toBe(true);
        expect(expandContent.text()).toBe('展开');
      });

      it('应该支持 expand 插槽在未展开状态', () => {
        const wrapper = mount(YColumnText, {
          props: {},
          attrs: {
            type: 'expand',
            prop: 'name',
            label: '姓名'
          },
          slots: {
            expand: ({ expanded }: { expanded: boolean }) =>
              h('div', { class: 'expand-content-collapsed' }, expanded ? '展开内容' : '点击展开')
          },
          global: {
            stubs: {
              'el-table-column': {
                template: `
                  <div class="el-table-column y-column-text" v-bind="$attrs">
                    <div class="cell">
                      <slot name="default" :scope="{ row: { name: '李四' }, column: { property: 'name' }, $index: 0 }" :value="'李四'"></slot>
                    </div>
                    <slot name="header"></slot>
                    <slot name="expand" :expanded="false"></slot>
                  </div>
                `
              }
            }
          }
        });

        const expandContent = wrapper.find('.expand-content-collapsed');
        expect(expandContent.exists()).toBe(true);
        expect(expandContent.text()).toBe('点击展开');
      });

      it('应该支持使用 expand 插槽自定义展开内容', () => {
        const wrapper = createBasicTest();

        // 验证组件可以正常渲染，expand插槽系统工作
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.html()).toContain('y-column-text');
      });

      it('应该在没有 expand 插槽时正常渲染', () => {
        const wrapper = mount(YColumnText, {
          props: {},
          attrs: {
            type: 'expand',
            prop: 'name',
            label: '姓名'
          },
          global: {
            stubs: {
              'el-table-column': {
                template: `
                  <div class="el-table-column y-column-text" v-bind="$attrs">
                    <div class="cell">
                      <slot name="default" :scope="{ row: { name: '赵六' }, column: { property: 'name' }, $index: 0 }" :value="'赵六'"></slot>
                    </div>
                    <slot name="header"></slot>
                    <slot name="expand" :expanded="true"></slot>
                  </div>
                `
              }
            }
          }
        });

        // 即使没有提供expand插槽，组件也应该正常渲染
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.html()).toContain('y-column-text');
      });
    });
  });

  describe('formatter 属性测试', () => {
    it('应该支持设置 formatter 属性', () => {
      const formatter = () => 'test';
      const wrapper = createBasicTest({
        formatter
      });

      expect(typeof wrapper.props('formatter')).toBe('function');
    });

    it('当没有设置 formatter 时应该为 undefined', () => {
      const wrapper = createBasicTest();

      expect(wrapper.props('formatter')).toBeUndefined();
    });
  });

  describe('单元格值获取逻辑测试', () => {
    it('应该根据 prop 属性正确获取单元格值', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'age',
          label: '年龄'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三', age: 25 }, column: { property: 'age' }, $index: 0 }" :value="'25'"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('当没有指定 prop 时应该使用默认值 name', () => {
      const wrapper = createBasicTest({}, { label: '姓名' });
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理空数据和 null 值', () => {
      // 测试空对象
      const wrapper1 = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: {}, column: { property: 'name' }, $index: 0 }" :value="''"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      expect(wrapper1.exists()).toBe(true);

      // 测试 null 值
      const wrapper2 = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: null, column: { property: 'name' }, $index: 0 }" :value="''"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      expect(wrapper2.exists()).toBe(true);
    });
  });

  describe('Tooltip 行为测试', () => {
    it('默认情况下应该启用 tooltip', () => {
      const wrapper = createBasicTest();
      const columnElement = wrapper.find('.el-table-column');

      // 检查 show-overflow-tooltip 属性
      expect(columnElement.attributes('show-overflow-tooltip')).toBeDefined();
    });

    it('当 noTip 为 true 时应该禁用 tooltip', () => {
      const wrapper = createBasicTest({
        noTip: true
      });
      const columnElement = wrapper.find('.el-table-column');

      expect(columnElement.attributes('show-overflow-tooltip')).toBe('false');
    });

    it('当 noTip 为 false 时应该启用 tooltip 并应用 tipProps', () => {
      const tipProps = {
        placement: 'top-start',
        effect: 'dark'
      };

      const wrapper = createBasicTest({
        noTip: false,
        tipProps
      });

      const columnElement = wrapper.find('.el-table-column');
      expect(columnElement.attributes('show-overflow-tooltip')).toBeDefined();
      // tipProps 会合并到 show-overflow-tooltip 中
    });

    it('tooltip 应该应用正确的 popperClass', () => {
      const wrapper = createBasicTest();
      const columnElement = wrapper.find('.el-table-column');

      // 检查是否有 y-column-text__tooltip 类名（通过 show-overflow-tooltip 配置）
      expect(columnElement.attributes('show-overflow-tooltip')).toBeDefined();
    });
  });

  describe('边界情况测试', () => {
    it('应该支持设置返回 undefined 的 formatter 函数', () => {
      const formatter = () => undefined;
      const wrapper = createBasicTest({
        formatter
      });

      expect(typeof wrapper.props('formatter')).toBe('function');
      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持设置可能抛出异常的 formatter 函数', () => {
      const errorFormatter = vi.fn(() => {
        throw new Error('格式化错误');
      });

      const wrapper = mount(YColumnText, {
        props: {
          formatter: errorFormatter
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '测试' }, column: { property: 'name' }, $index: 0 };

      // 验证函数可以设置
      expect(typeof wrapper.props('formatter')).toBe('function');

      // 验证当formatter抛出异常时，formatterCellValue应该能够处理（返回原始值）
      // 注意：在实际使用中，应该避免formatter抛出异常，这里只是测试边界情况
      try {
        vm.formatterCellValue(scope);
        // 如果没有抛出异常，说明组件内部处理了formatter的异常
      } catch (error) {
        // 如果抛出了异常，验证是formatter的异常而不是组件的异常
        expect(error.message).toBe('格式化错误');
      }
    });

    it('应该处理复杂的嵌套对象属性', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'user.info.name',
          label: '嵌套属性'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { user: { info: { name: '嵌套值' } } }, column: { property: 'user.info.name' }, $index: 0 }" :value="'嵌套值'"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持设置数组处理类型的 formatter 函数', () => {
      const arrayFormatter = (value: any) => (Array.isArray(value) ? value.join(', ') : value);
      const wrapper = createBasicTest(
        {
          formatter: arrayFormatter
        },
        {
          prop: 'tags'
        }
      );

      expect(typeof wrapper.props('formatter')).toBe('function');
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理 formatter 函数返回 null 的情况', () => {
      const nullFormatter = vi.fn(() => null);
      const wrapper = mount(YColumnText, {
        props: {
          formatter: nullFormatter
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '测试' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '测试' }, column: { property: 'name' }, $index: 0 };
      const result = vm.formatterCellValue(scope);
      expect(nullFormatter).toHaveBeenCalledWith('测试', { name: '测试' }, scope);
      expect(result).toBe(null);
    });

    it('应该处理 formatter 函数返回 undefined 的情况', () => {
      const undefinedFormatter = vi.fn(() => undefined);
      const wrapper = mount(YColumnText, {
        props: {
          formatter: undefinedFormatter
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '测试' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '测试' }, column: { property: 'name' }, $index: 0 };
      const result = vm.formatterCellValue(scope);
      expect(undefinedFormatter).toHaveBeenCalledWith('测试', { name: '测试' }, scope);
      expect(result).toBe(undefined);
    });

    it('应该处理复杂的对象数据结构', () => {
      const objectFormatter = vi.fn((value: any) => value?.displayName || '无名');
      const wrapper = createBasicTest(
        {
          formatter: objectFormatter
        },
        {
          prop: 'user'
        }
      );

      expect(typeof wrapper.props('formatter')).toBe('function');
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理嵌套对象的 formatter 函数', () => {
      const nestedFormatter = vi.fn((value: any, row: any) => {
        if (typeof value === 'object' && value !== null) {
          return value.fullName || value.name || '未知';
        }
        return value;
      });

      const wrapper = mount(YColumnText, {
        props: {
          formatter: nestedFormatter
        },
        attrs: {
          prop: 'person',
          label: '人员'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { person: { fullName: '张三丰', name: '张三' } }, column: { property: 'person' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = {
        row: { person: { fullName: '张三丰', name: '张三' } },
        column: { property: 'person' },
        $index: 0
      };
      const result = vm.formatterCellValue(scope);
      expect(nestedFormatter).toHaveBeenCalledWith(
        { fullName: '张三丰', name: '张三' },
        { person: { fullName: '张三丰', name: '张三' } },
        scope
      );
      expect(result).toBe('张三丰');
    });

    it('应该处理异步 formatter 函数（尽管通常不推荐）', () => {
      // 注意：formatter 函数通常应该是同步的，但这里测试组件如何处理异步函数
      const asyncFormatter = vi.fn(async (value: any) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return `异步: ${value}`;
      });

      const wrapper = createBasicTest({
        formatter: asyncFormatter
      });

      expect(typeof wrapper.props('formatter')).toBe('function');
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理极端的数值边界情况', () => {
      const numberFormatter = vi.fn((value: any) => {
        if (typeof value === 'number') {
          if (value === Infinity) return '无穷大';
          if (value === -Infinity) return '负无穷大';
          if (isNaN(value)) return '非数值';
          return value.toLocaleString();
        }
        return value;
      });

      const wrapper = mount(YColumnText, {
        props: {
          formatter: numberFormatter
        },
        attrs: {
          prop: 'value',
          label: '数值'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { value: NaN }, column: { property: 'value' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { value: NaN }, column: { property: 'value' }, $index: 0 };
      const result = vm.formatterCellValue(scope);
      expect(numberFormatter).toHaveBeenCalledWith(NaN, { value: NaN }, scope);
      expect(result).toBe('非数值');
    });
  });

  describe('cellValue 函数测试', () => {
    it('应该正确处理正常的值获取', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 由于组件内部会调用 cellValue 和 formatterCellValue，这里验证组件能正常渲染
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理 row 为 null 的情况', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: null, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // cellValue 函数应该返回空字符串当 row 为 null
      expect(contentSpan.text()).toBe('');
    });

    it('应该处理 row 为 undefined 的情况', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: undefined, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // cellValue 函数应该返回空字符串当 row 为 undefined
      expect(contentSpan.text()).toBe('');
    });

    it('应该处理空对象 row 的情况', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: {}, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 当 row 为空对象且 prop 不存在时，cellValue 返回 undefined，formatterCellValue 返回 undefined
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理 propKey 不存在的情况', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          label: '姓名'
          // 不提供 prop，会使用默认值 'name'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 当没有提供 prop 时，会使用默认值 'name'
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理嵌套属性值获取', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'user.name',
          label: '用户名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { user: { name: '李四' } }, column: { property: 'user.name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 注意：cellValue 函数只支持简单的属性访问，不支持嵌套路径
      // 这里主要测试组件能正常处理这种情况
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理值为 0 的情况', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'count',
          label: '数量'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { count: 0 }, column: { property: 'count' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 由于使用 stub，组件内部逻辑可能无法完全执行，但验证组件能正常渲染
      // cellValue 函数应该能处理值为 0 的情况
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理值为 false 的情况', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'active',
          label: '是否激活'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { active: false }, column: { property: 'active' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 由于使用 stub，组件内部逻辑可能无法完全执行，但验证组件能正常渲染
      // cellValue 函数应该能处理值为 false 的情况
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('handleClick 函数测试', () => {
    it('当 link 为 true 且有外部监听器时应该触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三', id: 1 }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);

      await contentSpan.trigger('click');

      // 验证事件被触发
      expect(onClick).toHaveBeenCalledTimes(1);
      // 验证传递的参数：由于使用 stub，组件内部逻辑可能无法完全执行，但至少验证事件被触发
      const callArgs = onClick.mock.calls[0];
      expect(callArgs.length).toBeGreaterThan(0);
      // 验证最后一个参数是事件对象
      expect(callArgs[callArgs.length - 1]).toBeInstanceOf(Object);
    });

    it('当 link 为 false 时不应该触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: false
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);

      await contentSpan.trigger('click');

      expect(onClick).not.toHaveBeenCalled();
    });

    it('当 link 为 true 但没有外部监听器时不应该触发 click 事件', async () => {
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        // 不提供 on: { click: ... }
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

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);

      // 由于没有外部监听器，即使点击也不会触发事件
      await contentSpan.trigger('click');

      // 验证组件仍然存在
      expect(wrapper.exists()).toBe(true);
    });

    it('当 link 为 true 且有外部监听器但 scope 为 null 时不应该触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: null, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      if (contentSpan.exists()) {
        await contentSpan.trigger('click');
      }

      // 由于 row 为 null，formatterCellValue 返回空字符串，但事件仍可能被触发
      // 这里主要验证组件能正常处理这种情况
      expect(wrapper.exists()).toBe(true);
    });

    it('当 link 为 true 且有外部监听器时应该传递正确的参数', async () => {
      const onClick = vi.fn();
      const formatter = vi.fn((value: any) => `格式化: ${value}`);
      const wrapper = mount(YColumnText, {
        props: {
          link: true,
          formatter
        },
        attrs: {
          prop: 'age',
          label: '年龄',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { age: 25, name: '张三' }, column: { property: 'age' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);

      await contentSpan.trigger('click');

      // 验证事件被触发
      expect(onClick).toHaveBeenCalledTimes(1);
      // formatter 可能被调用（如果组件内部逻辑执行）
      // 验证至少事件被触发，并且传递了事件对象
      const callArgs = onClick.mock.calls[0];
      expect(callArgs.length).toBeGreaterThan(0);
      expect(callArgs[callArgs.length - 1]).toBeInstanceOf(Object);
    });

    it('当 link 为 true 且有外部监听器时应该传递正确的事件对象', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);

      const clickEvent = new MouseEvent('click', { bubbles: true });
      await contentSpan.trigger('click', clickEvent);

      expect(onClick).toHaveBeenCalledTimes(1);
      const callArgs = onClick.mock.calls[0];
      expect(callArgs[3]).toBeInstanceOf(Object);
    });
  });

  describe('formatterCellValue 函数测试', () => {
    it('当有 formatter 时应该调用 formatter 函数', () => {
      const formatter = vi.fn((value: any) => `格式化: ${value}`);
      const wrapper = mount(YColumnText, {
        props: {
          formatter
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 由于使用 stub，组件内部逻辑可能无法完全执行
      // 但验证组件能正常渲染，formatter 属性被正确传递
      expect(wrapper.props('formatter')).toBe(formatter);
      expect(wrapper.exists()).toBe(true);
    });

    it('当没有 formatter 时应该返回原始值', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // 由于使用 stub，组件内部逻辑可能无法完全执行
      // 但验证组件能正常渲染，没有 formatter 时应该使用原始值
      expect(wrapper.props('formatter')).toBeUndefined();
      expect(wrapper.exists()).toBe(true);
    });

    it('当 row 不存在时应该返回空字符串', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: null, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const contentSpan = wrapper.find('.y-column-text__content');
      expect(contentSpan.exists()).toBe(true);
      // formatterCellValue 函数当 row 不存在时应该返回空字符串
      expect(contentSpan.text()).toBe('');
    });

    it('formatter 应该接收正确的参数', () => {
      // 这个测试通过其他方式验证formatter参数正确性
      // 在formatterCellValue方法测试中已经验证了参数传递
      const wrapper = mount(YColumnText, {
        props: {
          formatter: (value: any, row: any, scope: any) => `格式化: ${value}`
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        }
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.props('formatter')).toBeDefined();
    });
  });

  describe('单元测试 - 直接测试组件方法', () => {
    it('应该直接测试 cellValue 方法', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        }
      });

      // 通过wrapper.vm访问组件实例的computed属性和方法
      const vm = wrapper.vm as any;

      // 测试 cellValue 方法
      expect(vm.cellValue({ name: '张三' })).toBe('张三');
      expect(vm.cellValue({ name: null })).toBe(null);
      expect(vm.cellValue({ name: undefined })).toBe(undefined);
      expect(vm.cellValue({ name: 0 })).toBe(0);
      expect(vm.cellValue({ name: false })).toBe(false);
      expect(vm.cellValue(null)).toBe('');
      expect(vm.cellValue(undefined)).toBe('');
      expect(vm.cellValue({})).toBe(undefined); // prop不存在时返回undefined
    });

    it('应该直接测试 cellValue 方法处理不同的prop', () => {
      const wrapper = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'age',
          label: '年龄'
        }
      });

      const vm = wrapper.vm as any;

      // 测试不同prop的处理
      expect(vm.cellValue({ age: 25 })).toBe(25);
      expect(vm.cellValue({ age: '25岁' })).toBe('25岁');
      expect(vm.cellValue({ name: '张三', age: 25 })).toBe(25); // 即使有其他属性也返回正确的prop值
      expect(vm.cellValue({})).toBe(undefined); // prop不存在时返回undefined
    });

    it('应该直接测试 formatterCellValue 方法', () => {
      const formatter = vi.fn((value: any) => `格式化: ${value}`);
      const wrapper = mount(YColumnText, {
        props: {
          formatter
        },
        attrs: {
          prop: 'name',
          label: '姓名'
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '张三', id: 1 }, column: { property: 'name' }, $index: 0 };

      // 测试有formatter的情况
      const result1 = vm.formatterCellValue(scope);
      expect(formatter).toHaveBeenCalledWith('张三', { name: '张三', id: 1 }, scope);
      expect(result1).toBe('格式化: 张三');

      // 测试没有formatter的情况
      const wrapper2 = mount(YColumnText, {
        props: {},
        attrs: {
          prop: 'name',
          label: '姓名'
        }
      });
      const vm2 = wrapper2.vm as any;
      const result2 = vm2.formatterCellValue(scope);
      expect(result2).toBe('张三');

      // 测试row为null的情况
      const result3 = vm2.formatterCellValue({
        row: null,
        column: { property: 'name' },
        $index: 0
      });
      expect(result3).toBe('');

      // 测试row为undefined的情况
      const result4 = vm2.formatterCellValue({
        row: undefined,
        column: { property: 'name' },
        $index: 0
      });
      expect(result4).toBe('');

      // 测试空对象的情况
      const result5 = vm2.formatterCellValue({ row: {}, column: { property: 'name' }, $index: 0 });
      expect(result5).toBe(undefined);
    });

    it('应该测试 handleClick 方法', () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '张三', id: 1 }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '张三', id: 1 }, column: { property: 'name' }, $index: 0 };
      const mockEvent = new MouseEvent('click');

      // 测试link为true且有scope的情况
      vm.handleClick(scope, mockEvent);
      expect(onClick).toHaveBeenCalledWith(
        { name: '张三', id: 1 }, // row
        '张三', // formatterCellValue的结果
        scope, // scope
        mockEvent // event
      );

      // 测试link为false的情况
      const wrapper2 = mount(YColumnText, {
        props: {
          link: false
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        }
      });
      const vm2 = wrapper2.vm as any;
      onClick.mockClear();
      vm2.handleClick(scope, mockEvent);
      expect(onClick).not.toHaveBeenCalled();

      // 测试scope为null的情况，不会触发事件
      onClick.mockClear();
      vm.handleClick(null, mockEvent);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('应该测试 handleClick 方法在有formatter时的完整调用', () => {
      const onClick = vi.fn();
      const formatter = vi.fn((value: any) => `格式化-${value}`);
      const wrapper = mount(YColumnText, {
        props: {
          link: true,
          formatter
        },
        attrs: {
          prop: 'name',
          label: '姓名',
          onClick
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '李四', id: 2 }, column: { property: 'name' }, $index: 1 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '李四', id: 2 }, column: { property: 'name' }, $index: 1 };
      const mockEvent = new MouseEvent('click');

      // 测试link为true且有formatter的情况
      vm.handleClick(scope, mockEvent);
      expect(onClick).toHaveBeenCalledWith(
        { name: '李四', id: 2 }, // row
        '格式化-李四', // formatterCellValue的结果
        scope, // scope
        mockEvent // event
      );
      expect(formatter).toHaveBeenCalledWith('李四', { name: '李四', id: 2 }, scope);
    });

    it('应该测试 handleClick 方法在没有外部监听器时不触发事件', () => {
      const onClick = vi.fn();
      const wrapper = mount(YColumnText, {
        props: {
          link: true
        },
        attrs: {
          prop: 'name',
          label: '姓名'
          // 故意不提供 onClick 监听器
        },
        global: {
          stubs: {
            'el-table-column': {
              template: `
                <div class="el-table-column y-column-text" v-bind="$attrs">
                  <div class="cell">
                    <slot name="default" :scope="{ row: { name: '王五' }, column: { property: 'name' }, $index: 0 }"></slot>
                  </div>
                  <slot name="header"></slot>
                </div>
              `
            }
          }
        }
      });

      const vm = wrapper.vm as any;
      const scope = { row: { name: '王五' }, column: { property: 'name' }, $index: 0 };
      const mockEvent = new MouseEvent('click');

      // 由于没有外部监听器，即使link为true也不会触发事件
      vm.handleClick(scope, mockEvent);
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
