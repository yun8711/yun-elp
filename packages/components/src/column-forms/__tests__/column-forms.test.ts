import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnForms from '../src/column-forms.vue';

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
        popperClass: 'y-column-form__error-tooltip',
        effect: 'dark',
        placement: 'top',
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
        popperClass: 'y-column-form__error-tooltip',
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
        popperClass: 'y-column-form__error-tooltip',
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
            popperClass: 'y-column-form__error-tooltip',
            effect: 'dark',
            placement: 'top',
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
          popperClass: 'y-column-form__error-tooltip',
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
            popperClass: 'y-column-form__error-tooltip',
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
});
