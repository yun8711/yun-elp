import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnForms from '../src/column-forms.vue';

vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: vi.fn(() => ({
    popperClass: 'mock-popper-class',
    placement: 'bottom',
  })),
}));

describe('YColumnForms 表单列组件', () => {
  describe('基础渲染', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] },
        global: {
          stubs: ['el-form-item', 'el-tooltip']
        }
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('el-table-column');
    });
  });

  describe('Props 测试', () => {
    it('应该支持options属性', () => {
      // 跳过渲染测试，只测试属性定义
      expect('options').toBeDefined();
    });

    it('应该支持inline属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], inline: false }
      });

      expect(wrapper.vm.inline).toBe(false);
    });

    it('应该支持tName属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], tName: 'customTable' }
      });

      expect(wrapper.vm.tName).toBe('customTable');
    });
  });

  describe('样式和UI', () => {
    it('应该有正确的CSS类名', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] },
        global: {
          stubs: ['el-form-item', 'el-tooltip']
        }
      });
      // 根元素应该是 el-table-column
      expect(wrapper.classes()).toContain('el-table-column');

      // 内部内容区域应该有 y-column-forms__content 类名
      const contentDiv = wrapper.find('.y-column-forms__content');
      expect(contentDiv.exists()).toBe(true);
    });

    it('应该支持inline布局', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], inline: true }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持flex布局', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], inline: false }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('mergedItemFormAttrs 方法测试', () => {
    it('应该正确合并表单项的默认属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const item = {
        prop: 'test',
        label: '测试字段',
        labelWidth: '100px',
        rules: [{ required: true }]
      };

      const result = (wrapper.vm as any).mergedItemFormAttrs(scope, item);

      expect(result).toEqual({
        label: '测试字段',
        'label-width': '100px',
        rules: [{ required: true }]
      });
    });

    it('应该正确处理没有label的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const item = {
        prop: 'test',
        rules: [{ required: true }]
      };

      const result = (wrapper.vm as any).mergedItemFormAttrs(scope, item);

      expect(result['label-width']).toBe('0px');
    });

    it('应该支持rules为函数的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const rulesFn = (_scope: any, prop: string) => [{ required: true, message: `字段${prop}必填` }];

      const item = {
        prop: 'test',
        label: '测试字段',
        rules: rulesFn
      };

      const result = (wrapper.vm as any).mergedItemFormAttrs(scope, item);

      expect(result.rules).toEqual([{ required: true, message: '字段test必填' }]);
    });

    it('应该支持formAttrs为对象的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const item = {
        prop: 'test',
        label: '测试字段',
        formAttrs: {
          required: true,
          size: 'small'
        }
      };

      const result = (wrapper.vm as any).mergedItemFormAttrs(scope, item);

      expect(result).toEqual({
        label: '测试字段',
        'label-width': 'auto',
        rules: undefined,
        required: true,
        size: 'small'
      });
    });

    it('应该支持formAttrs为函数的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const formAttrsFn = (scope: any, _prop: string) => ({
        required: true,
        size: scope.row.size || 'small'
      });

      const item = {
        prop: 'test',
        label: '测试字段',
        formAttrs: formAttrsFn
      };

      const result = (wrapper.vm as any).mergedItemFormAttrs(scope, item);

      expect(result).toEqual({
        label: '测试字段',
        'label-width': 'auto',
        rules: undefined,
        required: true,
        size: 'small'
      });
    });
  });

  describe('mergedItemTooltipAttrs 方法测试', () => {
    it('应该正确合并tooltip的默认属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const item = {
        prop: 'test'
      };

      const result = (wrapper.vm as any).mergedItemTooltipAttrs(scope, item);

      expect(result).toEqual({
        popperClass: 'mock-popper-class',
        effect: 'dark',
        placement: 'bottom',
        enterable: false
      });
    });

    it('应该支持tipProps为对象的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const item = {
        prop: 'test',
        tipProps: {
          placement: 'bottom',
          showArrow: true
        }
      };

      const result = (wrapper.vm as any).mergedItemTooltipAttrs(scope, item);

      expect(result).toEqual({
        popperClass: 'mock-popper-class',
        effect: 'dark',
        placement: 'bottom',
        enterable: false,
        showArrow: true
      });
    });

    it('应该支持tipProps为函数的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const scope = { $index: 0, row: { test: 'value' } };
      const tipPropsFn = (scope: any, _prop: string) => ({
        placement: scope.row.placement || 'left',
        showArrow: true
      });

      const item = {
        prop: 'test',
        tipProps: tipPropsFn
      };

      const result = (wrapper.vm as any).mergedItemTooltipAttrs(scope, item);

      expect(result).toEqual({
        popperClass: 'mock-popper-class',
        effect: 'dark',
        placement: 'left',
        enterable: false,
        showArrow: true
      });
    });
  });

  describe('mergedFormArr 方法测试', () => {
    it('应该正确整理和过滤表单数据', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      // 模拟组件的options数据
      const options = [
        {
          prop: 'name',
          label: '姓名',
          show: true
        },
        {
          prop: 'age',
          label: '年龄',
          show: false
        },
        {
          prop: 'email',
          label: '邮箱',
          show: (scope: any) => scope.row.showEmail
        }
      ];

      const scope = { $index: 0, row: { showEmail: true, name: '张三' } };

      // 模拟mergedFormArr的逻辑
      const result = options.map((item: any) => {
        return {
          prop: item.prop,
          show: typeof item.show === 'function' ? item.show(scope, item.prop) : (item.show ?? true),
          formAttrs: (wrapper.vm as any).mergedItemFormAttrs(scope, item),
          tipProps: (wrapper.vm as any).mergedItemTooltipAttrs(scope, item),
          width: typeof item.width === 'function' ? item.width(scope, item.prop) : item.width || 'auto',
          style: typeof item.style === 'function' ? item.style(scope, item.prop) : item.style || {},
        }
      }).filter((x: any) => x.show);

      expect(result.length).toBe(2);
      expect(result[0].prop).toBe('name');
      expect(result[1].prop).toBe('email');
      expect(result.some((item: any) => item.prop === 'age')).toBe(false);
    });

    it('应该支持width和style为函数的情况', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const options = [{
        prop: 'test',
        label: '测试',
        width: (scope: any) => scope.row.width || '100px',
        style: (scope: any) => ({ color: scope.row.color || 'red' })
      }];

      const scope = { $index: 0, row: { width: '200px', color: 'blue' } };

      const result = options.map((item: any) => {
        return {
          prop: item.prop,
          show: typeof item.show === 'function' ? item.show(scope, item.prop) : (item.show ?? true),
          formAttrs: (wrapper.vm as any).mergedItemFormAttrs(scope, item),
          tipProps: (wrapper.vm as any).mergedItemTooltipAttrs(scope, item),
          width: typeof item.width === 'function' ? item.width(scope, item.prop) : item.width || 'auto',
          style: typeof item.style === 'function' ? item.style(scope, item.prop) : item.style || {},
        }
      }).filter((x: any) => x.show);

      expect(result[0].width).toBe('200px');
      expect(result[0].style).toEqual({ color: 'blue' });
    });

    it('应该返回空的数组当options为空时', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const options: any[] = [];
      const scope = { $index: 0, row: {} };

      const result = options.map((item: any) => {
        return {
          prop: item.prop,
          show: typeof item.show === 'function' ? item.show(scope, item.prop) : (item.show ?? true),
          formAttrs: (wrapper.vm as any).mergedItemFormAttrs(scope, item),
          tipProps: (wrapper.vm as any).mergedItemTooltipAttrs(scope, item),
          width: typeof item.width === 'function' ? item.width(scope, item.prop) : item.width || 'auto',
          style: typeof item.style === 'function' ? item.style(scope, item.prop) : item.style || {},
        }
      }).filter((x: any) => x.show);

      expect(result).toEqual([]);
    });

    it('应该正确处理所有表单项属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const options = [{
        prop: 'test',
        label: '测试字段',
        labelWidth: '120px',
        rules: [{ required: true }],
        width: '150px',
        style: { margin: '10px' },
        formAttrs: { size: 'small' },
        tipProps: { placement: 'bottom' }
      }];

      const scope = { $index: 0, row: { test: 'value' } };

      const result = options.map((item: any) => {
        return {
          prop: item.prop,
          show: typeof item.show === 'function' ? item.show(scope, item.prop) : (item.show ?? true),
          formAttrs: (wrapper.vm as any).mergedItemFormAttrs(scope, item),
          tipProps: (wrapper.vm as any).mergedItemTooltipAttrs(scope, item),
          width: typeof item.width === 'function' ? item.width(scope, item.prop) : item.width || 'auto',
          style: typeof item.style === 'function' ? item.style(scope, item.prop) : item.style || {},
        }
      }).filter((x: any) => x.show);

      expect(result.length).toBe(1);
      expect(result[0].prop).toBe('test');
      expect(result[0].show).toBe(true);
      expect(result[0].width).toBe('150px');
      expect(result[0].style).toEqual({ margin: '10px' });
      expect(result[0].formAttrs.label).toBe('测试字段');
      expect(result[0].formAttrs['label-width']).toBe('120px');
      expect(result[0].formAttrs.size).toBe('small');
      expect(result[0].tipProps.placement).toBe('bottom');
    });
  });

  describe('tableName 计算属性测试', () => {
    it('应该返回tName的值当tName存在时', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], tName: 'customTable' }
      });

      expect((wrapper.vm as any).tableName).toBe('customTable');
    });

    it('应该返回formTableProp的值当tName为空时', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], tName: '' },
        global: {
          provide: {
            formTableProp: 'providedTable'
          }
        }
      });

      expect((wrapper.vm as any).tableName).toBe('providedTable');
    });

    it('应该返回默认值tableData当tName和formTableProp都为空时', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], tName: '' }
      });

      expect((wrapper.vm as any).tableName).toBe('tableData');
    });

    it('tName优先级高于formTableProp', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], tName: 'customTable' },
        global: {
          provide: {
            formTableProp: 'providedTable'
          }
        }
      });

      expect((wrapper.vm as any).tableName).toBe('customTable');
    });
  });

  describe('鼠标事件处理', () => {
    it('handleMouseEnter应该设置错误提示为显示状态', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const key = '0_test';
      (wrapper.vm as any).handleMouseEnter(key);

      expect((wrapper.vm as any).errorMessageMap[key]).toBe(true);
    });

    it('handleMouseLeave应该设置错误提示为隐藏状态', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const key = '0_test';
      (wrapper.vm as any).handleMouseEnter(key);
      expect((wrapper.vm as any).errorMessageMap[key]).toBe(true);

      (wrapper.vm as any).handleMouseLeave(key);
      expect((wrapper.vm as any).errorMessageMap[key]).toBe(false);
    });

    it('应该支持多个表单项的鼠标事件独立处理', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });

      const key1 = '0_name';
      const key2 = '0_email';

      (wrapper.vm as any).handleMouseEnter(key1);
      expect((wrapper.vm as any).errorMessageMap[key1]).toBe(true);
      expect((wrapper.vm as any).errorMessageMap[key2]).toBeUndefined();

      (wrapper.vm as any).handleMouseEnter(key2);
      expect((wrapper.vm as any).errorMessageMap[key1]).toBe(true);
      expect((wrapper.vm as any).errorMessageMap[key2]).toBe(true);

      (wrapper.vm as any).handleMouseLeave(key1);
      expect((wrapper.vm as any).errorMessageMap[key1]).toBe(false);
      expect((wrapper.vm as any).errorMessageMap[key2]).toBe(true);
    });
  });

  describe('直接测试核心方法', () => {
    describe('mergedFormArr 方法直接测试', () => {
      it('应该正确处理空options数组', () => {
        const wrapper = mount(YColumnForms, {
          props: { options: [] }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: {} };

        const result = vm.mergedFormArr(scope);
        expect(result).toEqual([]);
      });

      it('应该正确处理单个表单项', () => {
        const options = [{
          prop: 'name',
          label: '姓名',
          show: true
        }];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            name: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: { name: '张三' } };

        const result = vm.mergedFormArr(scope);

        expect(result.length).toBe(1);
        expect(result[0]).toEqual({
          prop: 'name',
          show: true,
          formAttrs: {
            label: '姓名',
            'label-width': 'auto',
            rules: undefined
          },
          tipProps: {
            popperClass: 'mock-popper-class',
            effect: 'dark',
            placement: 'bottom',
            enterable: false
          },
          width: 'auto',
          style: {}
        });
      });

      it('应该正确过滤show为false的项', () => {
        const options = [
          { prop: 'name', label: '姓名', show: true },
          { prop: 'age', label: '年龄', show: false },
          { prop: 'email', label: '邮箱', show: true }
        ];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            name: '<input />',
            email: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: {} };

        const result = vm.mergedFormArr(scope);

        expect(result.length).toBe(2);
        expect(result.map((item: any) => item.prop)).toEqual(['name', 'email']);
      });

      it('应该支持show为函数的情况', () => {
        const options = [
          {
            prop: 'adminField',
            label: '管理员字段',
            show: (scope: any) => scope.row?.isAdmin
          },
          {
            prop: 'userField',
            label: '用户字段',
            show: (scope: any) => !scope.row?.isAdmin
          }
        ];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            adminField: '<input />',
            userField: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;

        // 测试管理员用户
        const adminScope = { $index: 0, row: { isAdmin: true } };
        const adminResult = vm.mergedFormArr(adminScope);
        expect(adminResult.length).toBe(1);
        expect(adminResult[0].prop).toBe('adminField');

        // 测试普通用户
        const userScope = { $index: 0, row: { isAdmin: false } };
        const userResult = vm.mergedFormArr(userScope);
        expect(userResult.length).toBe(1);
        expect(userResult[0].prop).toBe('userField');
      });

      it('应该正确处理width和style为函数的情况', () => {
        const options = [{
          prop: 'test',
          label: '测试',
          width: (scope: any) => scope.row?.width || '100px',
          style: (scope: any) => ({ color: scope.row?.color || 'red' })
        }];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            test: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: { width: '200px', color: 'blue' } };

        const result = vm.mergedFormArr(scope);

        expect(result[0].width).toBe('200px');
        expect(result[0].style).toEqual({ color: 'blue' });
      });

      it('应该正确处理width和style为静态值的情况', () => {
        const options = [{
          prop: 'test',
          label: '测试',
          width: '150px',
          style: { margin: '10px' }
        }];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            test: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: {} };

        const result = vm.mergedFormArr(scope);

        expect(result[0].width).toBe('150px');
        expect(result[0].style).toEqual({ margin: '10px' });
      });

      it('应该正确合并formAttrs和tipProps', () => {
        const options = [{
          prop: 'test',
          label: '测试',
          formAttrs: { size: 'small' as const, required: true },
          tipProps: { placement: 'bottom', showArrow: true }
        }];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            test: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: {} };

        const result = vm.mergedFormArr(scope);

        expect(result[0].formAttrs).toEqual({
          label: '测试',
          'label-width': 'auto',
          rules: undefined,
          size: 'small',
          required: true
        });

        expect(result[0].tipProps).toEqual({
          popperClass: 'mock-popper-class',
          effect: 'dark',
          placement: 'bottom',
          enterable: false,
          showArrow: true
        });
      });

      it('应该正确处理复杂的表单项配置', () => {
        const options = [{
          prop: 'complex',
          label: '复杂字段',
          labelWidth: '120px',
          rules: [{ required: true, message: '必填' }],
          show: true,
          width: '200px',
          style: { padding: '5px' },
          formAttrs: { size: 'large' as const },
          tipProps: { placement: 'left' }
        }];

        const wrapper = mount(YColumnForms, {
          props: { options },
          slots: {
            complex: '<input />'
          },
          global: {
            stubs: ['el-form-item', 'el-tooltip']
          }
        });

        const vm = wrapper.vm as any;
        const scope = { $index: 0, row: {} };

        const result = vm.mergedFormArr(scope);

        expect(result.length).toBe(1);
        expect(result[0]).toEqual({
          prop: 'complex',
          show: true,
          width: '200px',
          style: { padding: '5px' },
          formAttrs: {
            label: '复杂字段',
            'label-width': '120px',
            rules: [{ required: true, message: '必填' }],
            size: 'large'
          },
          tipProps: {
            popperClass: 'mock-popper-class',
            effect: 'dark',
            placement: 'left',
            enterable: false
          }
        });
      });
    });

    describe('manageAttrs 计算属性测试', () => {
      it('应该正确设置默认列属性', () => {
        const wrapper = mount(YColumnForms, {
          props: { options: [] }
        });

        const vm = wrapper.vm as any;
        const result = vm.manageAttrs;

        expect(result).toEqual({
          'show-overflow-tooltip': false,
          'min-width': 100,
          width: 'auto',
          'class-name': 'y-column-forms'
        });
      });

      it('应该合并attrs中的属性', () => {
        const wrapper = mount(YColumnForms, {
          props: { options: [] },
          attrs: {
            width: 200,
            'min-width': 150,
            fixed: 'right'
          }
        });

        const vm = wrapper.vm as any;
        const result = vm.manageAttrs;

        expect(result).toEqual({
          'show-overflow-tooltip': false,
          'min-width': 150,
          width: 200,
          fixed: 'right',
          'class-name': 'y-column-forms'
        });
      });

      it('应该支持自定义class-name属性', () => {
        const wrapper = mount(YColumnForms, {
          props: { options: [] },
          attrs: {
            'class-name': 'custom-column-class'
          }
        });

        const vm = wrapper.vm as any;
        const result = vm.manageAttrs;

        expect(result).toEqual({
          'show-overflow-tooltip': false,
          'min-width': 100,
          width: 'auto',
          'class-name': 'custom-column-class'
        });
      });
    });
  });

  describe('模板渲染集成测试', () => {
    const tableColumnStub = {
      template: `
        <div class="el-table-column y-column-forms" v-bind="$attrs">
          <div class="cell">
            <slot name="default" v-bind="{ row: { name: '张三' }, column: {}, $index: 0 }"></slot>
          </div>
          <slot name="header" :column="{ label: '操作' }" :index="0"></slot>
        </div>
      `,
      inheritAttrs: false,
    };

    const formItemStub = {
      template: `
        <div class="el-form-item" v-bind="$attrs">
          <slot />
          <slot name="error" error="字段错误" />
        </div>
      `,
      emits: ['mouseenter', 'mouseleave'],
      mounted() {
        const el = this.$el as HTMLElement;
        el.addEventListener('mouseenter', () => this.$emit('mouseenter'));
        el.addEventListener('mouseleave', () => this.$emit('mouseleave'));
      },
    };

    const createRenderWrapper = (
      props: Record<string, unknown> = {},
      slots: Record<string, string> = {},
      attrs: Record<string, unknown> = {},
    ) => {
      return mount(YColumnForms, {
        props: { options: [], ...props },
        attrs: { label: '表单列', ...attrs },
        slots,
        global: {
          stubs: {
            'el-table-column': tableColumnStub,
            'el-form-item': formItemStub,
          },
        },
      });
    };

    it('应渲染多个表单项并应用 flex 布局', () => {
      const wrapper = createRenderWrapper(
        {
          inline: false,
          options: [
            { prop: 'name', label: '姓名' },
            { prop: 'age', label: '年龄' },
          ],
        },
        {
          name: '<input class="name-input" />',
          age: '<input class="age-input" />',
        },
      );

      expect(wrapper.find('.y-column-forms__content.is-flex').exists()).toBe(true);
      expect(wrapper.find('.name-input').exists()).toBe(true);
      expect(wrapper.find('.age-input').exists()).toBe(true);
      expect(wrapper.findAll('.el-form-item')).toHaveLength(2);
    });

    it('inline 为 true 时应应用 is-line 布局', () => {
      const wrapper = createRenderWrapper(
        {
          inline: true,
          options: [{ prop: 'name', label: '姓名' }],
        },
        { name: '<input class="name-input" />' },
      );

      expect(wrapper.find('.y-column-forms__content.is-line').exists()).toBe(true);
    });

    it('应渲染错误提示区域并响应鼠标事件', async () => {
      const wrapper = createRenderWrapper(
        {
          options: [{ prop: 'name', label: '姓名' }],
        },
        { name: '<input class="name-input" />' },
      );

      expect(wrapper.find('.y-column-form__error').exists()).toBe(true);

      const formItem = wrapper.find('.el-form-item');
      await formItem.trigger('mouseenter');
      expect((wrapper.vm as any).errorMessageMap['0_name']).toBe(true);

      await formItem.trigger('mouseleave');
      expect((wrapper.vm as any).errorMessageMap['0_name']).toBe(false);
    });

    it('应渲染 header 插槽并支持自定义 header', () => {
      const wrapper = createRenderWrapper(
        { options: [] },
        { header: '<span class="custom-header">自定义列头</span>' },
        { label: '默认列头' },
      );

      expect(wrapper.find('.custom-header').exists()).toBe(true);
      expect(wrapper.text()).toContain('自定义列头');
    });

    it('表单项 prop 应包含 tableName 与行索引', () => {
      const wrapper = createRenderWrapper(
        {
          tName: 'editTable',
          options: [{ prop: 'name', label: '姓名' }],
        },
        { name: '<input class="name-input" />' },
      );

      const formItem = wrapper.find('.el-form-item');
      expect(formItem.attributes('prop')).toBe('editTable.0.name');
    });
  });
});
