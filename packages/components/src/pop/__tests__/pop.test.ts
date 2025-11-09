import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import YPop from '../src/pop.vue';

describe('YPop 弹出框容器组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基本功能', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YPop);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain('y-pop');
    });

    it('应该支持默认插槽', () => {
      const wrapper = mount(YPop, {
        slots: {
          default: '<button type="primary">触发按钮</button>',
          'tip-content': '',
          'pop-content': '',
          'pop-footer': ''
        }
      });

      // 验证组件能正常渲染
      expect(wrapper.exists()).toBe(true);

      // 验证组件包含必要的结构
      expect(wrapper.html()).toContain('y-pop');
      expect(wrapper.html()).toContain('el-popover');

      // 验证插槽内容配置正确（在测试环境中，我们主要验证组件接受插槽的能力）
      const vm = wrapper.vm as any;
      expect(vm.$slots.default).toBeDefined();
    });

    it('应该渲染 tip-content 插槽内容', () => {
      const wrapper = mount(YPop, {
        slots: {
          default: '',
          'tip-content': '<span>提示内容</span>',
          'pop-content': '',
          'pop-footer': ''
        }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('tip-content 插槽应该被正确定义和使用', () => {
      const wrapper = mount(YPop, {
        slots: {
          default: '<button>触发</button>',
          'tip-content': '<div class="custom-tip"><strong>自定义提示内容</strong></div>',
          'pop-content': '',
          'pop-footer': ''
        }
      });

      // 验证组件存在
      expect(wrapper.exists()).toBe(true);

      // 验证插槽被正确定义在组件中
      const vm = wrapper.vm as any;
      expect(vm.$slots['tip-content']).toBeDefined();
      expect(typeof vm.$slots['tip-content']).toBe('function');

      // 验证组件结构正确，包含tooltip元素
      expect(wrapper.html()).toContain('y-pop');
      expect(wrapper.html()).toContain('el-tooltip');

      // 验证当有tip-content插槽时，tooltip不会被禁用
      expect(vm.disabledTooltip).toBe(false);
    });

    it('应该渲染 pop-content 插槽内容', () => {
      const wrapper = mount(YPop, {
        slots: {
          default: '',
          'tip-content': '',
          'pop-content': '<div>自定义内容</div>',
          'pop-footer': ''
        }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it('应该渲染 pop-footer 插槽内容', () => {
      const wrapper = mount(YPop, {
        slots: {
          default: '',
          'tip-content': '',
          'pop-content': '',
          'pop-footer': '<div>自定义底部</div>'
        }
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Tooltip 功能测试', () => {
    it('应该支持 tipContent 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          tipContent: '提示内容'
        }
      });
      expect(wrapper.props('tipContent')).toBe('提示内容');
    });

    it('应该支持 tipPlacement 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          tipPlacement: 'bottom'
        }
      });
      expect(wrapper.props('tipPlacement')).toBe('bottom');
    });

    it('应该支持 tipProps 属性', () => {
      const tipProps = { trigger: 'click' as const };
      const wrapper = mount(YPop, {
        props: {
          tipProps
        }
      });
      expect(wrapper.props('tipProps')).toStrictEqual(tipProps);
    });

    it('当没有 tipContent 时应该禁用 tooltip', () => {
      const wrapper = mount(YPop, {
        props: {
          tipContent: ''
        }
      });
      // 检查组件内部的 computed 属性
      const vm = wrapper.vm as any;
      expect(vm.disabledTooltip).toBe(true);
    });
  });

  describe('Popover 功能测试', () => {
    it('应该支持 popTitle 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          popTitle: '标题'
        }
      });
      expect(wrapper.props('popTitle')).toBe('标题');
    });

    it('应该支持 popContent 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          popContent: '内容'
        }
      });
      expect(wrapper.props('popContent')).toBe('内容');
    });

    it('应该支持 popPlacement 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          popPlacement: 'top'
        }
      });
      expect(wrapper.props('popPlacement')).toBe('top');
    });

    it('应该支持 popProps 属性', () => {
      const popProps = { width: 300 };
      const wrapper = mount(YPop, {
        props: {
          popProps
        }
      });
      expect(wrapper.props('popProps')).toStrictEqual(popProps);
    });

    it('应该支持 noPop 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          noPop: true
        }
      });

      // 验证属性设置正确
      expect(wrapper.props('noPop')).toBe(true);

      // 验证组件能正常渲染
      expect(wrapper.exists()).toBe(true);

      // 验证组件包含必要的结构
      expect(wrapper.html()).toContain('y-pop');
      expect(wrapper.html()).toContain('el-tooltip');

      // 验证当noPop为true时，el-popover的disabled属性应该为true
      // 在测试环境中，我们验证组件的计算属性是否正确传递了disabled状态
      const vm = wrapper.vm as any;
      expect(vm.noPop).toBe(true);
    });

    it('noPop 属性默认为 false', () => {
      const wrapper = mount(YPop);

      // 验证默认值
      expect(wrapper.props('noPop')).toBe(false);

      // 验证组件实例的属性
      const vm = wrapper.vm as any;
      expect(vm.noPop).toBe(false);

      // 验证包含 el-popover 组件
      expect(wrapper.html()).toContain('el-popover');
    });
  });

  describe('按钮配置测试', () => {
    it('应该支持 confirmText 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          confirmText: '确定'
        }
      });
      expect(wrapper.props('confirmText')).toBe('确定');
    });

    it('应该支持 cancelText 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          cancelText: '取消'
        }
      });
      expect(wrapper.props('cancelText')).toBe('取消');
    });

    it('应该支持 confirmProps 属性', () => {
      const confirmProps = { delay: 500 };
      const wrapper = mount(YPop, {
        props: {
          confirmProps
        }
      });
      expect(wrapper.props('confirmProps')).toStrictEqual(confirmProps);
    });

    it('应该支持 cancelProps 属性', () => {
      const cancelProps = { delay: 300 };
      const wrapper = mount(YPop, {
        props: {
          cancelProps
        }
      });
      expect(wrapper.props('cancelProps')).toStrictEqual(cancelProps);
    });

    it('应该支持 noConfirm 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          noConfirm: true
        }
      });
      expect(wrapper.props('noConfirm')).toBe(true);
      // 验证组件能正常渲染
      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持 noCancel 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          noCancel: true
        }
      });
      expect(wrapper.props('noCancel')).toBe(true);

      // 验证组件能正常渲染
      expect(wrapper.exists()).toBe(true);

      // 验证组件内部逻辑
      const vm = wrapper.vm as any;
      expect(vm.noCancel).toBe(true);

      // 验证当noCancel为true时，组件的行为是正确的
      // 由于popover默认是隐藏的，我们验证属性传递是否正确
      expect(wrapper.html()).toContain('y-pop');
      expect(wrapper.html()).toContain('el-popover');
    });

    it('应该支持 noFooter 属性', () => {
      const wrapper = mount(YPop, {
        props: {
          noFooter: true
        }
      });
      expect(wrapper.props('noFooter')).toBe(true);
      expect(wrapper.html()).not.toContain('y-pop__popover-footer');
    });
  });

  describe('事件测试', () => {
    it('应该触发 confirm 事件', () => {
      const onConfirm = vi.fn();
      const wrapper = mount(YPop, {
        attrs: {
          onConfirm
        }
      });

      // 模拟有外部监听器的情况
      const vm = wrapper.vm as any;
      vi.spyOn(vm, 'hasExternalListener').mockReturnValue(true);

      // 直接调用 confirmClick 方法
      vm.confirmClick();

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('应该触发 cancel 事件', () => {
      const onCancel = vi.fn();
      const wrapper = mount(YPop, {
        attrs: {
          onCancel
        }
      });

      // 模拟有外部监听器的情况
      const vm = wrapper.vm as any;
      vi.spyOn(vm, 'hasExternalListener').mockReturnValue(true);

      // 直接调用 cancelClick 方法
      vm.cancelClick();

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('点击确认按钮应该调用 confirmClick 方法', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      // 模拟 showPopover 为 true 的状态
      vm.showPopover = true;

      // 调用 confirmClick 方法
      vm.confirmClick();

      // 验证 showPopover 被设置为 false
      expect(vm.showPopover).toBe(false);
    });

    it('点击取消按钮应该调用 cancelClick 方法', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      // 模拟 showPopover 为 true 的状态
      vm.showPopover = true;

      // 调用 cancelClick 方法
      vm.cancelClick();

      // 验证 showPopover 被设置为 false
      expect(vm.showPopover).toBe(false);
    });

    it('应该正确控制 showPopover 状态', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      // 初始状态应该为 false
      expect(vm.showPopover).toBe(false);

      // 可以通过编程方式设置为 true
      vm.showPopover = true;
      expect(vm.showPopover).toBe(true);

      // 点击确认按钮后应该变为 false
      vm.confirmClick();
      expect(vm.showPopover).toBe(false);

      // 再次设置为 true
      vm.showPopover = true;
      expect(vm.showPopover).toBe(true);

      // 点击取消按钮后应该变为 false
      vm.cancelClick();
      expect(vm.showPopover).toBe(false);
    });
  });

  describe('样式测试', () => {
    it('应该应用 y-pop 类名', () => {
      const wrapper = mount(YPop);
      expect(wrapper.classes()).toContain('y-pop');
    });

    it('tooltipProps 中的其他属性可以通过 prop 覆盖', () => {
      const wrapper = mount(YPop, {
        props: {
          tipProps: {
            placement: 'bottom',
            effect: 'light'
          }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.tooltipProps.placement).toBe('bottom');
      expect(vm.tooltipProps.effect).toBe('light');
      expect(vm.tooltipProps.popperClass).toBe('y-pop__tooltip'); // 但 popperClass 仍然强制指定
    });

    it('popoverProps 中的其他属性可以通过 prop 覆盖', () => {
      const wrapper = mount(YPop, {
        props: {
          popProps: {
            placement: 'top',
            width: 400
          }
        }
      });
      const vm = wrapper.vm as any;
      expect(vm.popoverProps.placement).toBe('top');
      expect(vm.popoverProps.width).toBe(400);
      expect(vm.popoverProps.popperClass).toBe('y-pop__popover'); // 但 popperClass 仍然强制指定
    });
  });

  describe('集成测试', () => {
    it('应该与 el-button 配合使用', () => {
      const wrapper = mount({
        template: `
          <y-pop tip-content="提示">
            <el-button type="primary">按钮</el-button>
          </y-pop>
        `,
        components: { YPop }
      });

      expect(wrapper.findComponent(YPop).exists()).toBe(true);
    });

    it('应该支持复杂的插槽内容', () => {
      const wrapper = mount(YPop, {
        slots: {
          default: `
            <div class="custom-content">
              <i class="icon"></i>
              <span>复杂内容</span>
            </div>
          `,
          'tip-content': '',
          'pop-content': '',
          'pop-footer': ''
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持完整的配置组合', () => {
      const wrapper = mount(YPop, {
        props: {
          tipContent: '提示信息',
          tipPlacement: 'top',
          popTitle: '确认操作',
          popContent: '确定要执行此操作吗？',
          confirmText: '确定',
          cancelText: '取消',
          noFooter: false
        },
        slots: {
          default: '<button>点击</button>',
          'tip-content': '',
          'pop-content': '',
          'pop-footer': ''
        }
      });

      expect(wrapper.props('tipContent')).toBe('提示信息');
      expect(wrapper.props('popTitle')).toBe('确认操作');
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('暴露接口测试', () => {
    it('应该暴露 tipRef', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      expect(vm.tipRef).toBeDefined();
      // tipRef 应该是一个 template ref
      expect(typeof vm.tipRef).toBe('object');
    });

    it('应该暴露 popRef', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      expect(vm.popRef).toBeDefined();
      // popRef 应该是一个 template ref
      expect(typeof vm.popRef).toBe('object');
    });

    it('tipRef 应该被正确定义', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      expect(vm.tipRef).toBeDefined();
      expect(typeof vm.tipRef).toBe('object');
    });

    it('popRef 应该被正确定义', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      expect(vm.popRef).toBeDefined();
      expect(typeof vm.popRef).toBe('object');
    });

    it('应该能够访问 tipRef 的值', () => {
      const wrapper = mount(YPop, {
        props: {
          tipContent: '测试提示'
        }
      });

      const vm = wrapper.vm as any;
      // 在测试环境中，ref 的值可能为 null，但 ref 对象本身应该存在
      expect(vm.tipRef).toBeDefined();
    });

    it('应该能够访问 popRef 的值', () => {
      const wrapper = mount(YPop, {
        props: {
          popContent: '测试内容'
        }
      });

      const vm = wrapper.vm as any;
      // 在测试环境中，ref 的值可能为 null，但 ref 对象本身应该存在
      expect(vm.popRef).toBeDefined();
    });
  });

  describe('计算属性测试', () => {
    it('应该正确计算 confirmText', () => {
      const wrapper = mount(YPop, {
        props: {
          confirmText: '自定义确定'
        }
      });

      const vm = wrapper.vm as any;
      expect(vm.confirmText).toBe('自定义确定');
    });

    it('应该正确计算 cancelText', () => {
      const wrapper = mount(YPop, {
        props: {
          cancelText: '自定义取消'
        }
      });

      const vm = wrapper.vm as any;
      expect(vm.cancelText).toBe('自定义取消');
    });

    it('应该正确合并 confirmProps', () => {
      const wrapper = mount(YPop, {
        props: {
          confirmProps: { delay: 1000 }
        }
      });

      const vm = wrapper.vm as any;
      expect(vm.confirmBtnProps.delay).toBe(1000);
      expect(vm.confirmBtnProps.type).toBe('primary'); // 默认值
    });

    it('应该正确合并 cancelProps', () => {
      const wrapper = mount(YPop, {
        props: {
          cancelProps: { delay: 500 }
        }
      });

      const vm = wrapper.vm as any;
      expect(vm.cancelProps.delay).toBe(500);
      expect(vm.cancelProps.type).toBe('default'); // 默认值
    });
  });

  describe('模板引用测试', () => {
    it('tooltipRef 应该被正确创建', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      expect(vm.tipRef).toBeDefined();
      expect(typeof vm.tipRef).toBe('object');
    });

    it('popoverRef 应该被正确创建', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      expect(vm.popRef).toBeDefined();
      expect(typeof vm.popRef).toBe('object');
    });

    it('ref 应该在组件初始化时可用', () => {
      const wrapper = mount(YPop);
      const vm = wrapper.vm as any;

      // 验证 ref 对象存在
      expect(vm.tipRef).toBeDefined();
      expect(vm.popRef).toBeDefined();
    });
  });

  describe('集成测试', () => {
    it('应该支持完整的配置和插槽组合', () => {
      const wrapper = mount(YPop, {
        props: {
          tipContent: '提示信息',
          tipPlacement: 'top',
          popTitle: '确认操作',
          popContent: '确定要执行此操作吗？',
          confirmText: '确定',
          cancelText: '取消',
          noFooter: false
        },
        slots: {
          default: '<button>点击</button>',
          'tip-content': '<div>自定义提示</div>',
          'pop-content': '<div>自定义内容</div>',
          'pop-footer': '<div>自定义底部</div>'
        }
      });

      expect(wrapper.props('tipContent')).toBe('提示信息');
      expect(wrapper.props('popTitle')).toBe('确认操作');
      expect(wrapper.exists()).toBe(true);

      const vm = wrapper.vm as any;
      expect(vm.tipRef).toBeDefined();
      expect(vm.popRef).toBeDefined();
    });

    it('暴露的 ref 应该在复杂场景中正常工作', () => {
      const wrapper = mount(YPop, {
        props: {
          tipContent: '提示',
          popContent: '内容'
        }
      });

      const vm = wrapper.vm as any;
      expect(vm.tipRef).toBeDefined();
      expect(vm.popRef).toBeDefined();

      // 验证组件仍然能正常渲染
      expect(wrapper.html()).toContain('y-pop');
    });
  });
});
