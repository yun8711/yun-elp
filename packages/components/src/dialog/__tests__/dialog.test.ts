import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YDialog from '../src/dialog.vue';
import { appConfigKey } from '../../app-wrap/src/use-app-config';

// 通用的全局 stubs，确保可点击与读取样式
const globalStubs = {
  // 将 el-dialog 简化为容器，支持 v-model 并透传 attrs 与插槽
  'el-dialog': {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
      '<div class="el-dialog" :modelvalue="modelValue ? \'true\' : \'false\'" v-bind="$attrs"><slot name="header"></slot><slot></slot><slot name="footer"></slot></div>'
  },
  // 用原生 button 模拟 y-button，便于触发 click 与读取文本/属性
  'y-button': {
    props: ['type'],
    template: '<button class="y-button" :data-type="type"><slot/></button>'
  }
};

describe('YDialog', () => {
  it('渲染正常', () => {
    const wrapper = mount(YDialog, { global: { stubs: globalStubs } });
    expect(wrapper.exists()).toBe(true);
  });

  it('默认不显示（受控，默认 modelValue=false）', () => {
    const wrapper = mount(YDialog, { global: { stubs: globalStubs } });
    // 仅校验 prop 默认值
    expect(wrapper.props('modelValue')).toBe(false);
  });

  it('通过 modelValue 控制显示状态（受控）', async () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });
    expect(wrapper.props('modelValue')).toBe(true);
  });

  it('点击确认：无外部监听器 -> 仅触发 update:modelValue(false)，不触发 confirm', async () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });

    const buttons = wrapper.findAll('button.y-button');
    // 第一个按钮为确认
    await buttons[0].trigger('click');

    expect(wrapper.emitted('confirm')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });

  it('点击确认：有外部监听器 -> 仅触发 confirm，不触发 update:modelValue', async () => {
    const onConfirm = () => {};
    const wrapper = mount(YDialog, {
      props: { modelValue: true, onConfirm },
      global: { stubs: globalStubs }
    });

    const buttons = wrapper.findAll('button.y-button');
    await buttons[0].trigger('click');

    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('点击取消：无外部监听器 -> 仅触发 update:modelValue(false)，不触发 cancel', async () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });

    const buttons = wrapper.findAll('button.y-button');
    // 第二个按钮为取消
    await buttons[1].trigger('click');

    expect(wrapper.emitted('cancel')).toBeUndefined();
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
  });

  it('点击取消：有外部监听器 -> 仅触发 cancel，不触发 update:modelValue', async () => {
    const onCancel = () => {};
    const wrapper = mount(YDialog, {
      props: { modelValue: true, onCancel },
      global: { stubs: globalStubs }
    });

    const buttons = wrapper.findAll('button.y-button');
    await buttons[1].trigger('click');

    expect(wrapper.emitted('cancel')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('showFooter=false 时不渲染底部按钮', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, showFooter: false },
      global: { stubs: globalStubs }
    });
    expect(wrapper.findAll('button.y-button').length).toBe(0);
  });

  it('noConfirm=true 隐藏确认按钮，仅保留取消按钮', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, noConfirm: true },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    expect(buttons.length).toBe(1);
  });

  it('noCancel=true 隐藏取消按钮，仅保留确认按钮', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, noCancel: true },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    expect(buttons.length).toBe(1);
  });

  it('支持自定义确认/取消按钮文案', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, confirmText: 'OK', cancelText: 'NO' },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    expect(buttons[0].text()).toBe('OK');
    expect(buttons[1].text()).toBe('NO');
  });

  it('确认/取消按钮 props 透传（验证 type 合并）', () => {
    const wrapper = mount(YDialog, {
      props: {
        modelValue: true,
        confirmProps: { type: 'success' },
        cancelProps: { type: 'info' }
      },
      global: { stubs: globalStubs }
    });
    const buttons = wrapper.findAll('button.y-button');
    expect(buttons[0].attributes('data-type')).toBe('success');
    expect(buttons[1].attributes('data-type')).toBe('info');
  });

  it('title 文案渲染', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, title: '测试标题' },
      global: { stubs: globalStubs }
    });
    expect(wrapper.text()).toContain('测试标题');
  });

  it('通过 CSS 变量传递 bodyMaxHeight 到样式（style 上存在 --body-max-height）', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, bodyMaxHeight: '300px' },
      global: { stubs: globalStubs }
    });
    const style = wrapper.find('.el-dialog').attributes('style') || '';
    expect(style.replace(/\s/g, '')).toContain('--body-max-height:300px');
  });

  it('dialogVisible 与 el-dialog 的 v-model 正确绑定', async () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: false },
      global: { stubs: globalStubs }
    });

    // 测试 modelValue=false 时，el-dialog 的 modelValue 应该是 false
    expect(wrapper.find('.el-dialog').attributes('modelvalue')).toBe('false');

    // 更新 props，验证响应性
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.find('.el-dialog').attributes('modelvalue')).toBe('true');
  });

  it('dialogVisible computed 属性正确响应外部更新', async () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true },
      global: { stubs: globalStubs }
    });

    // 验证初始状态
    expect(wrapper.find('.el-dialog').attributes('modelvalue')).toBe('true');

    // 模拟父组件更新 modelValue（比如点击外部关闭按钮）
    await wrapper.setProps({ modelValue: false });

    // 验证 el-dialog 接收到新的值
    expect(wrapper.find('.el-dialog').attributes('modelvalue')).toBe('false');
  });

  it('dialogVisible 作为受控组件的完整双向绑定测试', async () => {
    const onUpdateModelValue = vi.fn();
    const wrapper = mount(YDialog, {
      props: {
        modelValue: true,
        'onUpdate:modelValue': onUpdateModelValue
      },
      global: { stubs: globalStubs }
    });

    // 验证初始状态
    expect(wrapper.find('.el-dialog').attributes('modelvalue')).toBe('true');

    // 模拟用户通过其他方式关闭 dialog（比如点击确认按钮）
    const confirmButton = wrapper.findAll('button.y-button')[0];
    await confirmButton.trigger('click');

    // 验证触发了 update:modelValue 事件
    expect(onUpdateModelValue).toHaveBeenCalledWith(false);
  });
});

describe('YDialog - 合并配置与插槽/样式', () => {
  it('从 AppWrap 注入的 dialog 配置会透传为 el-dialog 的 attrs', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true },
      global: {
        stubs: globalStubs,
        provide: {
          [appConfigKey as unknown as string]: {
            dialog: {
              width: '800px',
              closeOnClickModal: true
            }
          }
        }
      }
    });

    const el = wrapper.find('.el-dialog');
    // 作为 attribute 透传（Vue 会转为 kebab-case）：width、close-on-click-modal
    const styleOrAttrs = el.attributes();
    expect(styleOrAttrs['width']).toBe('800px');
    // boolean attr 在 stub 上会序列化为 'true'
    expect(styleOrAttrs['closeonclickmodal'] || styleOrAttrs['close-on-click-modal']).toBeTruthy();
  });

  it('组件 attrs（未声明为 props 的属性）应覆盖 AppWrap 的同名字段', () => {
    const wrapper = mount(YDialog, {
      // 这里传入的 closeOnClickModal 不是 props，而是 attrs，按源码应覆盖 app 配置
      props: { modelValue: true, closeOnClickModal: false } as any,
      global: {
        stubs: globalStubs,
        provide: {
          [appConfigKey as unknown as string]: {
            dialog: {
              closeOnClickModal: true
            }
          }
        }
      }
    });

    const el = wrapper.find('.el-dialog');
    const attrs = el.attributes();
    // 覆盖后应为 false（在属性上通常体现为缺省或 'false'，不同运行时会有差异，这里只要不是 true 即可）
    expect((attrs['closeonclickmodal'] || attrs['close-on-click-modal']) === 'true').toBe(false);
  });

  it('title 插槽应覆盖基于 props.title 的默认标题内容', () => {
    const wrapper = mount(YDialog, {
      props: { modelValue: true, title: 'Props 标题' },
      slots: {
        title: () => 'Slot 标题'
      },
      global: { stubs: globalStubs }
    });

    const headerTitle = wrapper.find('.y-dialog__header-title');
    expect(headerTitle.exists()).toBe(true);
    expect(headerTitle.text()).toContain('Slot 标题');
    // 不应该再显示 props 中的标题（因为 slot 覆盖）
    expect(headerTitle.text()).not.toContain('Props 标题');
  });

  it('titleStyle 合并：AppWrap 中的 titleStyle 与 props.titleStyle 合并后应用到标题节点样式', () => {
    const wrapper = mount(YDialog, {
      props: {
        modelValue: true,
        titleStyle: { fontWeight: '700' }
      },
      global: {
        stubs: globalStubs,
        provide: {
          [appConfigKey as unknown as string]: {
            dialog: {
              titleStyle: { color: 'red' }
            }
          }
        }
      }
    });

    const style = wrapper.find('.y-dialog__header-title').attributes('style') || '';
    const normalized = style.replace(/\s/g, '').toLowerCase();
    expect(normalized).toContain('color:red');
    expect(normalized).toContain('font-weight:700');
  });
});
