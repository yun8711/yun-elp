import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YPageTitle from '../src/page-title.vue';

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    meta: {
      title: '路由标题'
    }
  })
}));

// Mock lodash-es
vi.mock('lodash-es', () => ({
  get: (obj: any, path: string, defaultValue: any) => {
    if (path === 'meta.title') {
      return obj.meta?.title || defaultValue;
    }
    return defaultValue;
  },
  isEmpty: (value: any) => {
    return value === undefined || value === null || value === '';
  }
}));

// Mock app-wrap配置
vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: () => ({})
}));

describe('YPageTitle 组件测试', () => {
  describe('基础渲染测试', () => {
    it('应该正确渲染组件基础结构', () => {
      // 测试目的：验证组件的基础DOM结构是否正确渲染
      const wrapper = mount(YPageTitle);

      expect(wrapper.find('.y-page-title').exists()).toBe(true);
      expect(wrapper.find('.y-page-title__left').exists()).toBe(true);
      expect(wrapper.find('.y-page-title__left-title').exists()).toBe(true);
      expect(wrapper.find('.y-page-title__left-extra').exists()).toBe(true);
      expect(wrapper.find('.y-page-title__right').exists()).toBe(true);
    });

    it('应该正确渲染传入的标题文本', () => {
      // 测试目的：验证title属性是否正确显示在组件中
      const wrapper = mount(YPageTitle, {
        props: {
          title: '测试标题'
        }
      });

      expect(wrapper.find('.y-page-title__left-title').text()).toBe('测试标题');
    });

    it('当没有传入title时应该显示路由标题', () => {
      // 测试目的：验证当没有传入title时，组件会从路由meta.title中获取标题
      const wrapper = mount(YPageTitle);

      expect(wrapper.find('.y-page-title__left-title').text()).toBe('路由标题');
    });
  });

  describe('样式属性测试', () => {
    it('应该正确应用height属性', () => {
      // 测试目的：验证height属性是否正确应用到容器样式
      const wrapper = mount(YPageTitle, {
        props: {
          height: '80px'
        }
      });

      const container = wrapper.find('.y-page-title');
      expect(container.attributes('style')).toContain('height: 80px');
    });

    it('应该正确应用border属性为true', () => {
      // 测试目的：验证border属性为true时是否正确添加边框样式类
      const wrapper = mount(YPageTitle, {
        props: {
          border: true
        }
      });

      expect(wrapper.find('.y-page-title--border').exists()).toBe(true);
    });

    it('应该正确应用border属性为false', () => {
      // 测试目的：验证border属性为false时是否正确移除边框样式类
      const wrapper = mount(YPageTitle, {
        props: {
          border: false
        }
      });

      expect(wrapper.find('.y-page-title--border').exists()).toBe(false);
    });

    it('应该正确应用paddingX字符串属性', () => {
      // 测试目的：验证paddingX为字符串时是否正确应用到左右内边距
      const wrapper = mount(YPageTitle, {
        props: {
          paddingX: '32px'
        }
      });

      const container = wrapper.find('.y-page-title');
      expect(container.attributes('style')).toContain('padding-left: 32px');
      expect(container.attributes('style')).toContain('padding-right: 32px');
    });

    it('应该正确应用paddingX数组属性', () => {
      // 测试目的：验证paddingX为数组时是否正确分别应用到左右内边距
      const wrapper = mount(YPageTitle, {
        props: {
          paddingX: ['16px', '32px']
        }
      });

      const container = wrapper.find('.y-page-title');
      expect(container.attributes('style')).toContain('padding-left: 16px');
      expect(container.attributes('style')).toContain('padding-right: 32px');
    });

    it('应该正确应用titleStyle属性', () => {
      // 测试目的：验证titleStyle属性是否正确应用到标题元素
      const titleStyle = { color: 'red', fontSize: '24px' };
      const wrapper = mount(YPageTitle, {
        props: {
          title: '测试标题',
          titleStyle
        }
      });

      const title = wrapper.find('.y-page-title__left-title');
      expect(title.attributes('style')).toContain('color: red');
      expect(title.attributes('style')).toContain('font-size: 24px');
    });
  });

  describe('插槽测试', () => {
    it('应该正确渲染title插槽', () => {
      // 测试目的：验证title插槽是否正确渲染，覆盖默认的标题显示
      const wrapper = mount(YPageTitle, {
        props: {
          title: '默认标题'
        },
        slots: {
          title: '<span>自定义标题</span>'
        }
      });

      expect(wrapper.find('.y-page-title__left-title span').text()).toBe('自定义标题');
      expect(wrapper.find('.y-page-title__left-title').text()).not.toContain('默认标题');
    });

    it('应该正确渲染extra插槽', () => {
      // 测试目的：验证extra插槽是否正确渲染在标题右侧
      const wrapper = mount(YPageTitle, {
        slots: {
          extra: '<button>额外按钮</button>'
        }
      });

      expect(wrapper.find('.y-page-title__left-extra button').text()).toBe('额外按钮');
    });

    it('应该正确渲染right插槽', () => {
      // 测试目的：验证right插槽是否正确渲染在组件右侧
      const wrapper = mount(YPageTitle, {
        slots: {
          right: '<div>右侧内容</div>'
        }
      });

      expect(wrapper.find('.y-page-title__right div').text()).toBe('右侧内容');
    });

    it('应该同时渲染多个插槽', () => {
      // 测试目的：验证多个插槽能够同时正确渲染
      const wrapper = mount(YPageTitle, {
        slots: {
          title: '<span>自定义标题</span>',
          extra: '<button>额外按钮</button>',
          right: '<div>右侧内容</div>'
        }
      });

      expect(wrapper.find('.y-page-title__left-title span').text()).toBe('自定义标题');
      expect(wrapper.find('.y-page-title__left-extra button').text()).toBe('额外按钮');
      expect(wrapper.find('.y-page-title__right div').text()).toBe('右侧内容');
    });
  });

  describe('默认值测试', () => {
    it('应该使用默认高度40px', () => {
      // 测试目的：验证当没有传入height时，组件使用默认高度40px
      const wrapper = mount(YPageTitle);

      const container = wrapper.find('.y-page-title');
      expect(container.attributes('style')).toContain('height: 40px');
    });

    it('应该使用默认边框样式', () => {
      // 测试目的：验证当没有传入border时，组件默认显示边框
      const wrapper = mount(YPageTitle);

      expect(wrapper.find('.y-page-title--border').exists()).toBe(true);
    });

    it('应该使用默认内边距24px', () => {
      // 测试目的：验证当没有传入paddingX时，组件使用默认左右内边距24px
      const wrapper = mount(YPageTitle);

      const container = wrapper.find('.y-page-title');
      expect(container.attributes('style')).toContain('padding-left: 24px');
      expect(container.attributes('style')).toContain('padding-right: 24px');
    });
  });

  describe('边界情况测试', () => {
    it('当title为空字符串时应该显示路由标题', () => {
      // 测试目的：验证当title为空字符串时，组件会回退到路由标题
      const wrapper = mount(YPageTitle, {
        props: {
          title: ''
        }
      });

      expect(wrapper.find('.y-page-title__left-title').text()).toBe('路由标题');
    });

    it('当paddingX为空时应该使用默认值', () => {
      // 测试目的：验证当paddingX为空时，组件使用默认内边距
      const wrapper = mount(YPageTitle, {
        props: {
          paddingX: ''
        }
      });

      const container = wrapper.find('.y-page-title');
      expect(container.attributes('style')).toContain('padding-left: 24px');
      expect(container.attributes('style')).toContain('padding-right: 24px');
    });

    it('当titleStyle为空对象时不应该影响渲染', () => {
      // 测试目的：验证当titleStyle为空对象时，组件正常渲染
      const wrapper = mount(YPageTitle, {
        props: {
          title: '测试标题',
          titleStyle: {}
        }
      });

      expect(wrapper.find('.y-page-title__left-title').exists()).toBe(true);
      expect(wrapper.find('.y-page-title__left-title').text()).toBe('测试标题');
    });
  });
});
