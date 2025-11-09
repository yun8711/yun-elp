import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YDrawer from '../src/drawer.vue';

// 全局 stubs：最小化实现，便于断言 attrs、插槽与点击
const globalStubs = {
  'el-drawer': {
    template:
      '<div class="el-drawer" v-bind="$attrs"><slot name="header"></slot><slot></slot><slot name="footer"></slot></div>'
  },
  'y-button': {
    props: ['type'],
    template: '<button class="y-button" :data-type="type"><slot/></button>'
  }
};

describe('YDrawer', () => {
  it('渲染正常', () => {
    const wrapper = mount(YDrawer, { global: { stubs: globalStubs } });
    expect(wrapper.exists()).toBe(true);
  });

  it('默认不显示（受控，默认 modelValue=false）', () => {
    const wrapper = mount(YDrawer, { global: { stubs: globalStubs } });
    expect(wrapper.props('modelValue')).toBe(false);
  });

  it('通过 modelValue 控制显示状态（受控）', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    expect(wrapper.props('modelValue')).toBe(true);
  });

  it('点击确认：无外部监听器 -> 仅触发 update:modelValue(false)，不触发 confirm', async () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });

  it('点击确认：有外部监听器 -> 仅触发 confirm，不触发 update:modelValue', async () => {
    const onConfirm = () => {};
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, onConfirm },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    await buttons[0].trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('点击取消：无外部监听器 -> 仅触发 update:modelValue(false)，不触发 cancel', async () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    await buttons[1].trigger('click');
    expect(wrapper.emitted('cancel')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });

  it('点击取消：有外部监听器 -> 仅触发 cancel，不触发 update:modelValue', async () => {
    const onCancel = () => {};
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, onCancel },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    await buttons[1].trigger('click');
    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('showFooter=false 时不渲染底部按钮', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, showFooter: false },
      global: { stubs: globalStubs }
    });
    expect(wrapper.findAll('button.y-button').length).toBe(0);
  });

  it('noConfirm=true 隐藏确认按钮，仅保留取消按钮', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, noConfirm: true },
      global: { stubs: globalStubs }
    });
    expect(wrapper.findAll('button.y-button').length).toBe(1);
  });

  it('noCancel=true 隐藏取消按钮，仅保留确认按钮', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, noCancel: true },
      global: { stubs: globalStubs }
    });
    expect(wrapper.findAll('button.y-button').length).toBe(1);
  });

  it('支持自定义确认/取消按钮文案', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, confirmText: 'OK', cancelText: 'NO' },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    expect(buttons[0].text()).toBe('OK');
    expect(buttons[1].text()).toBe('NO');
  });

  it('默认确认/取消文案来自 i18n（zh-CN：确认/取消）', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    expect(buttons[0].text()).toBe('确认');
    expect(buttons[1].text()).toBe('取消');
  });

  it('确认按钮类型：默认 primary，可通过 confirmProps 覆盖', async () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    let btns = wrapper.findAll('button.y-button');
    expect(btns[0].attributes('data-type')).toBe('primary');

    await wrapper.setProps({ confirmProps: { type: 'success' } } as any);
    await nextTick();
    btns = wrapper.findAll('button.y-button');
    expect(btns[0].attributes('data-type')).toBe('success');
  });

  it('title 文案渲染', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, title: '测试标题' },
      global: { stubs: globalStubs }
    });
    expect(wrapper.text()).toContain('测试标题');
  });

  it('header/body/footer class 属性与 size 透传至 el-drawer，且 size 默认 640px', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    const attrs = wrapper.find('.el-drawer').attributes();
    const get = (key: string) => attrs[key] ?? attrs[key.replace(/([A-Z])/g, '-$1').toLowerCase()] ?? attrs[key.toLowerCase()];
    expect(get('headerClass')).toBe('y-drawer__header');
    expect(get('bodyClass')).toBe('y-drawer__body');
    expect(get('footerClass')).toBe('y-drawer__footer');
    expect(attrs['size']).toBe('640px');
  });

  it('attrs 透传：传入 size 应覆盖默认 size', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, size: '500px' } as any,
      global: { stubs: globalStubs }
    });
    const attrs = wrapper.find('.el-drawer').attributes();
    expect(attrs['size']).toBe('500px');
  });

  it('confirm/cancel 具名插槽应覆盖默认按钮', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      slots: {
        confirm: () => '自定义确认',
        cancel: () => '自定义取消'
      },
      global: { stubs: globalStubs }
    });
    expect(wrapper.findAll('button.y-button').length).toBe(0);
    expect(wrapper.text()).toContain('自定义确认');
    expect(wrapper.text()).toContain('自定义取消');
  });

  it('支持自定义 header 插槽', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      slots: { header: '<div class="custom-header">自定义头部</div>' },
      global: { stubs: globalStubs }
    });
    expect(wrapper.find('.custom-header').exists()).toBe(true);
    expect(wrapper.find('.custom-header').text()).toContain('自定义头部');
  });

  it('title 插槽应覆盖基于 props.title 的默认标题内容', () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true, title: 'Props 标题' },
      slots: { title: () => 'Slot 标题' },
      global: { stubs: globalStubs }
    });
    const headerTitle = wrapper.find('.y-drawer__header-title');
    expect(headerTitle.exists()).toBe(true);
    expect(headerTitle.text()).toContain('Slot 标题');
    expect(headerTitle.text()).not.toContain('Props 标题');
  });

  it('defineExpose 暴露 drawerRef（在实例上可访问该字段）', async () => {
    const wrapper = mount(YDrawer, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    const vmAny: any = wrapper.vm as any;
    // 暴露的 ref 会在代理上解包，故这里只断言字段存在且可访问
    expect('drawerRef' in vmAny).toBe(true);
    // 挂载后应可访问到（可能为 null 或子组件实例，视运行时而定）
    // 仅校验不为 undefined
    expect(vmAny.drawerRef).not.toBeUndefined();
  });

  it('el-drawer 的 v-model 变化时触发 drawerVisible setter（点击关闭按钮或遮罩）', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(YDrawer, {
      props: {
        modelValue: true,
        'onUpdate:modelValue': onUpdateModelValue
      },
      global: { stubs: globalStubs }
    });

    // 模拟 el-drawer 触发 update:modelValue 事件（比如点击关闭按钮）
    // 直接设置 drawerVisible 来触发 setter（这会模拟 v-model 的双向绑定）
    wrapper.vm.drawerVisible = false;

    // 验证触发了父组件的 update:modelValue 监听器
    expect(onUpdateModelValue).toHaveBeenCalledWith(false);
    expect(onUpdateModelValue).toHaveBeenCalledTimes(1);
  });
});
