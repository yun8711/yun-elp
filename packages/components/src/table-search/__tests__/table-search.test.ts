import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { markRaw, nextTick } from 'vue';
import YTableSearch from '../src/table-search.vue';
import { ElInput, ElSelect, ElDatePicker, ElCascader, ElButton, ElLink, ElIcon } from 'element-plus';
import type { TableSearchOption } from '../src/table-search';

// Mock useAppConfig
vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: vi.fn((key: string) => {
    if (key === 'border-label') {
      return {
        width: '220px',
        height: '32px'
      };
    }
    if (key === 'table-search') {
      return {
        foldText: '收起',
        unFoldText: '高级搜索'
      };
    }
    return null;
  })
}));

// Mock YBorderLabel component
vi.mock('../../border-label/src/border-label.vue', () => ({
  default: {
    name: 'YBorderLabel',
    template: '<div class="y-border-label"><slot /></div>',
    props: ['label', 'width', 'height', 'noBorder']
  }
}));

// Mock Element Plus icons
vi.mock('@element-plus/icons-vue', () => ({
  ArrowDown: { name: 'ArrowDown', template: '<span>↓</span>' },
  ArrowUp: { name: 'ArrowUp', template: '<span>↑</span>' }
}));

// 全局组件注册
const globalComponents = {
  'el-button': ElButton,
  'el-link': ElLink,
  'el-icon': ElIcon,
  'el-input': ElInput,
  'el-select': ElSelect,
  'el-date-picker': ElDatePicker,
  'el-cascader': ElCascader,
  'el-collapse-transition': {
    name: 'ElCollapseTransition',
    template: '<div><slot /></div>',
    props: ['style']
  }
};

describe('YTableSearch', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = null;
  });

  describe('基础渲染', () => {
    it('应该正常渲染空组件', () => {
      wrapper = mount(YTableSearch, {
        props: {
          options: []
        },
        global: {
          components: globalComponents
        }
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-table-search').exists()).toBe(true);
      expect(wrapper.find('.y-table-search__left-all').exists()).toBe(true);
    });

    it('应该渲染基础搜索字段', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.find('.y-table-search__left-all').exists()).toBe(true);
      expect(wrapper.findComponent(ElButton).exists()).toBe(true);
    });
  });

  describe('字段配置', () => {
    it('应该正确渲染不同类型的组件', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          comp: markRaw(ElInput),
          first: true
        },
        {
          prop: 'status',
          label: '状态',
          comp: markRaw(ElSelect),
          innerAttrs: {
            placeholder: '请选择状态'
          }
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.findComponent(ElInput).exists()).toBe(true);
      expect(wrapper.findComponent(ElSelect).exists()).toBe(true);
    });

    it('应该支持自定义组件（custom: true）', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'custom',
          label: '自定义',
          custom: true,
          first: true
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        slots: {
          custom: '<div class="custom-slot">自定义内容</div>'
        },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.find('.custom-slot').exists()).toBe(true);
    });

    it('应该正确设置默认值', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'cascader',
          label: '级联选择',
          comp: markRaw(ElCascader),
          first: true
        },
        {
          prop: 'date',
          label: '日期选择',
          comp: markRaw(ElDatePicker),
          innerAttrs: {
            type: 'daterange'
          }
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      // 验证表单数据初始化
      const vm = wrapper.vm;
      expect(vm.form.cascader).toEqual([]);
      expect(vm.form.date).toEqual([]);
    });

    it('应该处理组件为null的情况，使用默认ElInput', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          comp: null as any,
          first: true
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.findComponent(ElInput).exists()).toBe(true);
    });

    it('输入类组件应自动生成"请输入XX"placeholder', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          comp: markRaw(ElInput),
          first: true
        }
      ];
      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.placeholder).toBe('请输入姓名');
    });

    it('选择类组件应自动生成"请选择XX"placeholder', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'status',
          label: '状态',
          comp: markRaw(ElSelect)
        }
      ];
      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.placeholder).toBe('请选择状态');
    });

    it('范围选择应自动生成"开始时间/结束时间"placeholder', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'date',
          label: '日期',
          comp: markRaw(ElDatePicker),
          innerAttrs: { type: 'daterange' }
        }
      ];
      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs['start-placeholder']).toBe('开始时间');
      expect(processed.innerAttrs['end-placeholder']).toBe('结束时间');
    });

    it('手动传入placeholder时不被覆盖', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'custom',
          label: '自定义',
          comp: markRaw(ElInput),
          innerAttrs: { placeholder: '自定义提示' }
        }
      ];
      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.placeholder).toBe('自定义提示');
    });

    it('手动传入start-placeholder/end-placeholder时不被覆盖', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'date',
          label: '日期',
          comp: markRaw(ElDatePicker),
          innerAttrs: { type: 'daterange', 'start-placeholder': '自定义开始', 'end-placeholder': '自定义结束' }
        }
      ];
      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs['start-placeholder']).toBe('自定义开始');
      expect(processed.innerAttrs['end-placeholder']).toBe('自定义结束');
    });
  });

  describe('首行自动禁用', () => {
    it('多行模式下展开时首行自动禁用，收起时自动启用', async () => {
      const options = [
        { prop: 'name', label: '姓名', first: true },
        { prop: 'age', label: '年龄' }
      ];
      wrapper = mount(YTableSearch, {
        props: { options, disabledFirst: true, defaultFold: true },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;

      // 初始为收起，首行应可用
      let processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.disabled).toBe(false);

      // 展开
      vm.isFold = false;
      await nextTick();
      processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.disabled).toBe(true);

      // 再收起
      vm.isFold = true;
      await nextTick();
      processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.disabled).toBe(false);
    });

    it('单行模式下首行不自动禁用', () => {
      const options = [
        { prop: 'name', label: '姓名', first: true }
      ];
      wrapper = mount(YTableSearch, {
        props: { options, disabledFirst: true },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.disabled).toBe(false);
    });

    it('多行模式但只有一个选项时首行不自动禁用', () => {
      const options = [
        { prop: 'name', label: '姓名', first: true }
      ];
      wrapper = mount(YTableSearch, {
        props: { options, disabledFirst: true },
        global: {
          components: globalComponents
        }
      });
      const vm = wrapper.vm;
      // 强制 hasMore 为 true
      Object.defineProperty(vm, 'hasMore', { value: true });
      const processed = vm.processOption(options[0]);
      expect(processed.innerAttrs.disabled).toBe(false);
    });
  });

  describe('动态属性', () => {
    it('应该支持动态hidden属性', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'status',
          label: '状态',
          first: true,
          hidden: (params) => params.form.name === 'hide'
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;

      // 初始状态，status字段应该显示
      expect(vm.firstOptions.find((item: any) => item.prop === 'status')).toBeDefined();

      // 设置name为'hide'，status字段应该隐藏
      vm.form.name = 'hide';
      await nextTick();

      // 由于hidden为true的字段不会渲染，我们通过检查处理后的选项来验证
      const processedOptions = vm.processOption(options[1]);
      expect(processedOptions.hidden).toBe(true);
    });

    it('应该支持动态disabled属性', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'status',
          label: '状态',
          disabled: (params) => params.isFold
        }
      ];

      wrapper = mount(YTableSearch, {
        props: {
          options,
          defaultFold: true
        },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;

      // 折叠状态下，status字段应该被禁用
      const processedOptions = vm.processOption(options[1]);
      expect(processedOptions.innerAttrs.disabled).toBe(true);
    });

    it('应该支持动态innerAttrs属性', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'date',
          label: '日期',
          comp: markRaw(ElDatePicker),
          innerAttrs: (params) => ({
            placeholder: params.form.name === 'test' ? '测试日期' : '请选择日期'
          })
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;

      // 初始状态
      let processedOptions = vm.processOption(options[1]);
      expect(processedOptions.innerAttrs.placeholder).toBe('请选择日期');

      // 设置name为'test'
      vm.form.name = 'test';
      await nextTick();

      processedOptions = vm.processOption(options[1]);
      expect(processedOptions.innerAttrs.placeholder).toBe('测试日期');
    });
  });

  describe('多行显示', () => {
    it('应该正确显示多行布局', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄'
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.find('.y-table-search__left-first').exists()).toBe(true);
      expect(wrapper.find('.y-table-search__left-more').exists()).toBe(true);
      expect(wrapper.findComponent(ElLink).exists()).toBe(true);
    });

    it('应该正确处理折叠/展开', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄'
        }
      ];

      wrapper = mount(YTableSearch, {
        props: {
          options,
          defaultFold: true
        },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;
      expect(vm.isFold).toBe(true);

      // 点击展开按钮
      await wrapper.findComponent(ElLink).trigger('click');
      expect(vm.isFold).toBe(false);
    });

    it('应该触发fold事件', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄'
        }
      ];

      const onFold = vi.fn();
      wrapper = mount(YTableSearch, {
        props: {
          options,
          defaultFold: true,
          onFold
        },
        global: {
          components: globalComponents
        }
      });

      await wrapper.findComponent(ElLink).trigger('click');
      expect(onFold).toHaveBeenCalledWith(false);
    });

    it('应该支持disabledFirst属性', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄'
        }
      ];

      wrapper = mount(YTableSearch, {
        props: {
          options,
          disabledFirst: true,
          defaultFold: false
        },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;
      const processedOptions = vm.processOption(options[0]);
      expect(processedOptions.innerAttrs.disabled).toBe(true);
    });
  });

  describe('事件处理', () => {
    it('应该触发搜索事件', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        }
      ];

      const onSearch = vi.fn();
      wrapper = mount(YTableSearch, {
        props: {
          options,
          onSearch
        },
        global: {
          components: globalComponents
        }
      });

      // 设置表单值
      const vm = wrapper.vm;
      vm.form.name = '张三';

      // 点击搜索按钮
      const searchButton = wrapper.findComponent(ElButton);
      await searchButton.trigger('click');

      expect(onSearch).toHaveBeenCalledWith({ name: '张三' });
    });

    it('应该触发重置事件', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          value: '初始值',
          first: true
        }
      ];

      const onReset = vi.fn();
      wrapper = mount(YTableSearch, {
        props: {
          options,
          onReset
        },
        global: {
          components: globalComponents
        }
      });

      // 修改表单值
      const vm = wrapper.vm;
      vm.form.name = '修改后的值';

      // 点击重置按钮
      const buttons = wrapper.findAllComponents(ElButton);
      const resetButton = buttons[1]; // 第二个按钮是重置按钮
      await resetButton.trigger('click');

      expect(onReset).toHaveBeenCalledWith({ name: '初始值' });
      expect(vm.form.name).toBe('初始值');
    });

    it('应该触发change事件', async () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        }
      ];

      const onChange = vi.fn();
      wrapper = mount(YTableSearch, {
        props: {
          options,
          onChange
        },
        global: {
          components: globalComponents
        }
      });

      // 修改表单值
      const vm = wrapper.vm;
      vm.form.name = '新值';

      await flushPromises();

      expect(onChange).toHaveBeenCalledWith({ name: '新值' });
    });
  });

  describe('插槽', () => {
    it('应该渲染右侧插槽', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        slots: {
          right: '<button class="right-slot">右侧按钮</button>'
        },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.find('.y-table-search__right').exists()).toBe(true);
      expect(wrapper.find('.right-slot').exists()).toBe(true);
    });

        it('应该传递正确的插槽参数', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'custom',
          label: '自定义',
          custom: true,
          first: true
        }
      ];

      const slotContent = vi.fn();
      wrapper = mount(YTableSearch, {
        props: { options },
        slots: {
          custom: slotContent
        },
        global: {
          components: globalComponents
        }
      });

      // 验证插槽被调用
      expect(slotContent).toHaveBeenCalled();

      // 获取插槽调用参数并验证关键属性
      const slotCallArg = slotContent.mock.calls[0][0];
      console.log('插槽参数结构:', JSON.stringify(slotCallArg, null, 2));

      expect(slotCallArg.prop).toBe('custom');
      expect(slotCallArg.value).toBe('');
      expect(slotCallArg.key).toBe(0);

      // 验证 item 对象的关键属性
      expect(slotCallArg.item.prop).toBe('custom');
      expect(slotCallArg.item.custom).toBe(true);
      expect(slotCallArg.item.first).toBe(true);
      expect(slotCallArg.item.hidden).toBe(false);

      // 验证 form 对象存在且包含对应字段
      expect(slotCallArg.form).toBeDefined();
      expect(slotCallArg.form.custom).toBe('');
    });
  });

  describe('属性配置', () => {
    it('应该支持自定义折叠文本', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄'
        }
      ];

      wrapper = mount(YTableSearch, {
        props: {
          options,
          foldText: '收起搜索',
          unFoldText: '展开搜索',
          defaultFold: true
        },
        global: {
          components: globalComponents
        }
      });

      const linkText = wrapper.findComponent(ElLink).text();
      expect(linkText).toContain('展开搜索');
    });

    it('应该支持自定义过渡时间', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄'
        }
      ];

      wrapper = mount(YTableSearch, {
        props: {
          options,
          duration: 0.5
        },
        global: {
          components: globalComponents
        }
      });

      const transition = wrapper.findComponent({ name: 'ElCollapseTransition' });
      expect(transition.attributes('style')).toContain('transition-duration: 0.5s');
    });
  });

  describe('函数式options', () => {
    it('应该支持函数式options', () => {
      const optionsFn = vi.fn((params: any) => [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄',
          hidden: params.isFold
        }
      ]);

      wrapper = mount(YTableSearch, {
        props: {
          options: optionsFn
        },
        global: {
          components: globalComponents
        }
      });

      expect(optionsFn).toHaveBeenCalled();
      expect(wrapper.findComponent(ElInput).exists()).toBe(true);
    });

    it('函数式options应该响应参数变化', async () => {
      const optionsFn = vi.fn((params: any) => [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄',
          hidden: params.isFold
        }
      ]);

      wrapper = mount(YTableSearch, {
        props: {
          options: optionsFn,
          defaultFold: true
        },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;

      // 展开时，optionsFn应该被重新调用
      vm.isFold = false;
      await nextTick();

      expect(optionsFn).toHaveBeenCalledWith(expect.objectContaining({
        isFold: false
      }));
    });
  });

  describe('边界情况', () => {
    it('应该处理空选项数组', () => {
      wrapper = mount(YTableSearch, {
        props: { options: [] },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.find('.y-table-search__left-all').exists()).toBe(true);
      expect(wrapper.findComponent(ElButton).exists()).toBe(true);
    });

    it('应该处理所有字段都是第一行的情况', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'age',
          label: '年龄',
          first: true
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      expect(wrapper.find('.y-table-search__left-all').exists()).toBe(true);
      expect(wrapper.find('.y-table-search__left-first').exists()).toBe(false);
    });

    it('应该正确处理hidden字段', () => {
      const options: TableSearchOption[] = [
        {
          prop: 'name',
          label: '姓名',
          first: true
        },
        {
          prop: 'hidden',
          label: '隐藏字段',
          hidden: true
        }
      ];

      wrapper = mount(YTableSearch, {
        props: { options },
        global: {
          components: globalComponents
        }
      });

      const vm = wrapper.vm;
      const processedOptions = vm.processOption(options[1]);
      expect(processedOptions.hidden).toBe(true);
    });
  });
});
