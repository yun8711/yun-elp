/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick, reactive, h, defineComponent, inject } from 'vue';
import Form from '../src/form.vue';
import FormItem from '../../form-item/src/form-item.vue';
import { Y_FORM_INJECTION_KEY } from '../src/form';

describe('YForm 组件', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const RowStub = defineComponent({
    name: 'ElRow',
    props: ['gutter', 'justify', 'align', 'tag', 'class', 'style'],
    template: '<div class="el-row y-form__row"><slot /></div>'
  });

  const rowStub = {
    ElRow: RowStub
  };

  const FormStub = defineComponent({
    name: 'ElForm',
    props: ['model', 'rules', 'labelWidth', 'inline', 'labelPosition'],
    methods: {
      validate: vi.fn().mockResolvedValue(true)
    },
    template: '<form class="el-form y-form"><slot /></form>'
  });

  const ColCapture = defineComponent({
    name: 'ElCol',
    props: ['span', 'offset', 'push', 'pull', 'xs', 'sm', 'md', 'lg', 'xl', 'tag'],
    setup(props, { slots }) {
      return () => h('div', { class: 'el-col' }, slots.default?.());
    }
  });

  const FormItemCapture = defineComponent({
    name: 'ElFormItem',
    props: ['prop', 'label', 'rules', 'labelWidth', 'required', 'inlineMessage'],
    template: '<div class="el-form-item"><slot /><slot name="label" /><slot name="error" /></div>'
  });

  const formItemStubs = {
    'el-col': ColCapture,
    'el-form-item': FormItemCapture
  };

  const createFormStub = (validate: ReturnType<typeof vi.fn>) =>
    defineComponent({
      name: 'ElForm',
      methods: { validate },
      template: '<form class="el-form y-form"><slot /></form>'
    });

  it('基础渲染', () => {
    const wrapper = mount(Form, {
      props: { model: { name: '' } },
      global: { stubs: rowStub }
    });
    expect(wrapper.find('.y-form').exists()).toBe(true);
    expect(wrapper.find('.y-form__row').exists()).toBe(true);
  });

  it('config 在字段变化时触发', async () => {
    const config = vi.fn();
    const model = reactive({ type: '' });
    mount(Form, {
      props: {
        model,
        config,
        debounce: 0
      },
      global: { stubs: rowStub }
    });

    model.type = 'a';
    await nextTick();
    await flushPromises();

    expect(config).toHaveBeenCalled();
    expect(config.mock.calls[0][1]).toMatchObject({
      field: 'type',
      prevValue: '',
      newValue: 'a'
    });
  });

  it('staticFields 不触发 config', async () => {
    const config = vi.fn();
    const model = reactive({ remark: '' });
    mount(Form, {
      props: {
        model,
        config,
        staticFields: ['remark'],
        debounce: 0
      },
      global: { stubs: rowStub }
    });

    model.remark = 'test';
    await nextTick();
    await flushPromises();

    expect(config).not.toHaveBeenCalled();
  });

  it('debounce 延迟触发 config', async () => {
    const config = vi.fn();
    const model = reactive({ keyword: '' });
    mount(Form, {
      props: {
        model,
        config,
        debounce: 300
      },
      global: { stubs: rowStub }
    });

    model.keyword = 'a';
    await nextTick();
    expect(config).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);
    await flushPromises();
    expect(config).toHaveBeenCalledTimes(1);
  });

  it('config 第一个参数为 model', async () => {
    const config = vi.fn();
    const model = reactive({ type: 'a' });
    mount(Form, {
      props: {
        model,
        config,
        debounce: 0
      },
      global: { stubs: rowStub }
    });

    model.type = 'b';
    await nextTick();
    await flushPromises();

    expect(config).toHaveBeenCalledWith(model, expect.objectContaining({ field: 'type' }));
  });

  it('debounce 期间同字段多次变化合并为最新值', async () => {
    const config = vi.fn();
    const model = reactive({ keyword: '' });
    mount(Form, {
      props: {
        model,
        config,
        debounce: 300
      },
      global: { stubs: rowStub }
    });

    model.keyword = 'a';
    model.keyword = 'ab';
    model.keyword = 'abc';
    await nextTick();

    vi.advanceTimersByTime(300);
    await flushPromises();

    expect(config).toHaveBeenCalledTimes(1);
    expect(config.mock.calls[0][1]).toMatchObject({
      field: 'keyword',
      newValue: 'abc'
    });
  });

  it('rowClass 应用到 el-row', () => {
    const wrapper = mount(Form, {
      props: {
        model: {},
        rowClass: 'custom-row'
      },
      global: { stubs: rowStub }
    });

    expect(wrapper.findComponent(RowStub).props('class')).toContain('custom-row');
  });

  it('布局属性分发给 el-row', () => {
    const wrapper = mount(Form, {
      props: { model: {} },
      attrs: { gutter: 24, justify: 'center' },
      global: { stubs: rowStub }
    });

    const row = wrapper.findComponent(RowStub);
    expect(row.props('gutter')).toBe(24);
    expect(row.props('justify')).toBe('center');
  });

  it('表单属性分发给 el-form', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        rules: { name: [{ required: true }] }
      },
      attrs: { 'label-width': '120px', inline: true },
      global: {
        stubs: {
          ...rowStub,
          'el-form': FormStub
        }
      }
    });

    const form = wrapper.findComponent(FormStub);
    expect(form.props('labelWidth')).toBe('120px');
    expect(form.props('inline')).toBe(true);
    expect(form.props('rules')).toEqual({ name: [{ required: true }] });
  });

  it('validateSync 校验通过时返回 model', async () => {
    const validate = vi.fn().mockResolvedValue(true);
    const model = { name: 'test' };
    const wrapper = mount(Form, {
      props: { model },
      global: {
        stubs: {
          ...rowStub,
          'el-form': createFormStub(validate)
        }
      }
    });

    await expect(wrapper.vm.validateSync()).resolves.toEqual(model);
    expect(validate).toHaveBeenCalled();
  });

  it('validateSync 校验失败时 reject', async () => {
    const validate = vi.fn().mockResolvedValue(false);
    const wrapper = mount(Form, {
      props: { model: { name: '' } },
      global: {
        stubs: {
          ...rowStub,
          'el-form': createFormStub(validate)
        }
      }
    });

    await expect(wrapper.vm.validateSync()).rejects.toThrow('validate failed');
  });

  it('通过 provide 向子组件传递 span', () => {
    const SpanProbe = defineComponent({
      setup() {
        const yForm = inject(Y_FORM_INJECTION_KEY);
        return () => h('span', { class: 'span-probe' }, String(yForm?.span.value ?? ''));
      }
    });

    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        span: 8
      },
      slots: {
        default: () => h(SpanProbe)
      },
      global: { stubs: rowStub }
    });

    expect(wrapper.find('.span-probe').text()).toBe('8');
  });

  it('与 y-form-item 配合时 span 向下传递', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        span: 12
      },
      slots: {
        default: () => h(FormItem, { label: '姓名', prop: 'name' })
      },
      global: {
        stubs: {
          ...rowStub,
          ...formItemStubs
        }
      }
    });

    expect(wrapper.findComponent(ColCapture).props('span')).toBe(12);
  });

  it('y-form-item 可通过 span 覆盖 y-form 默认值', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        span: 12
      },
      slots: {
        default: () => h(FormItem, { label: '备注', prop: 'remark', span: 24 })
      },
      global: {
        stubs: {
          ...rowStub,
          ...formItemStubs
        }
      }
    });

    expect(wrapper.findComponent(ColCapture).props('span')).toBe(24);
  });

  it('y-form-item 栅格属性分发给 el-col', () => {
    const wrapper = mount(Form, {
      props: {
        model: { name: '' },
        span: 12
      },
      slots: {
        default: () => h(FormItem, { label: '姓名', prop: 'name', span: 8, offset: 4, push: 2 })
      },
      global: {
        stubs: {
          ...rowStub,
          ...formItemStubs
        }
      }
    });

    const col = wrapper.findComponent(ColCapture);
    expect(col.props('span')).toBe(8);
    expect(col.props('offset')).toBe(4);
    expect(col.props('push')).toBe(2);
  });
});
