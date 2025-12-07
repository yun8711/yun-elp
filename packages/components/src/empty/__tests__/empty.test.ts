/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import YEmpty from '../src/empty.vue';

// Mock useAppConfig
vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: vi.fn(() => ({
    image: 'default-image.png',
    imageSize: 120,
    description: '默认描述',
    style: {
      '--el-empty-padding': '20px'
    }
  }))
}));

// Mock useLocale
vi.mock('../../../hooks/use-locale', () => ({
  useLocale: vi.fn(() => ({
    t: vi.fn((key: string) => {
      const translations: Record<string, string> = {
        'empty.description': '暂无数据'
      };
      return translations[key] || key;
    })
  }))
}));

// Mock Element Plus components
const ElEmpty = {
  name: 'ElEmpty',
  template: `
    <div class="el-empty" v-bind="$attrs">
      <slot />
      <slot name="image" />
      <slot name="description" />
    </div>
  `,
  props: ['image', 'imageSize', 'description']
};

// 全局配置
const globalConfig = {
  global: {
    components: {
      'el-empty': ElEmpty
    }
  }
};

describe('YEmpty 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('基础渲染', () => {
    const wrapper = mount(YEmpty, globalConfig);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.el-empty').exists()).toBe(true);
    expect(wrapper.find('.y-empty').exists()).toBe(true);
  });

  it('组件名称正确', () => {
    const wrapper = mount(YEmpty, globalConfig);
    expect(wrapper.vm.$options.name).toBe('YEmpty');
  });

  it('inheritAttrs 为 true', () => {
    const wrapper = mount(YEmpty, globalConfig);
    expect(wrapper.vm.$options.inheritAttrs).toBe(true);
  });

  describe('Props 传递', () => {
    it('传递 image 属性', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { image: 'custom-image.png' }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('image')).toBe('custom-image.png');
    });

    it('传递 imageSize 属性', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { imageSize: 150 }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('imageSize')).toBe(150);
    });

    it('传递 description 属性', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { description: '自定义描述' }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('description')).toBe('自定义描述');
    });

    it('传递 style 属性', () => {
      const customStyle = {
        '--el-empty-padding': '30px',
        '--el-empty-image-width': '80px'
      };
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { style: customStyle }
      });
      const elEmpty = wrapper.find('.el-empty');
      expect(elEmpty.attributes('style')).toContain('--el-empty-padding: 30px');
      expect(elEmpty.attributes('style')).toContain('--el-empty-image-width: 80px');
    });
  });

  describe('默认值处理', () => {
    it('未传递 image 时使用配置默认值', () => {
      const wrapper = mount(YEmpty, globalConfig);
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('image')).toBe('default-image.png');
    });

    it('未传递 imageSize 时使用配置默认值', () => {
      const wrapper = mount(YEmpty, globalConfig);
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('imageSize')).toBe(120);
    });

    it('未传递 description 时使用配置默认值', () => {
      const wrapper = mount(YEmpty, globalConfig);
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('description')).toBe('默认描述');
    });

    it('未传递 style 时使用配置默认样式', () => {
      const wrapper = mount(YEmpty, globalConfig);
      const elEmpty = wrapper.find('.el-empty');
      expect(elEmpty.attributes('style')).toContain('--el-empty-padding: 20px');
    });
  });

  describe('插槽功能', () => {
    it('默认插槽渲染', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        slots: { default: '<div class="custom-content">自定义内容</div>' }
      });
      expect(wrapper.find('.custom-content').exists()).toBe(true);
      expect(wrapper.text()).toContain('自定义内容');
    });

    it('image 插槽渲染', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        slots: { image: '<div class="custom-image">自定义图片</div>' }
      });
      expect(wrapper.find('.custom-image').exists()).toBe(true);
      expect(wrapper.text()).toContain('自定义图片');
    });

    it('description 插槽渲染', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        slots: { description: '<div class="custom-description">自定义描述</div>' }
      });
      expect(wrapper.find('.custom-description').exists()).toBe(true);
      expect(wrapper.text()).toContain('自定义描述');
    });

    it('多个插槽同时使用', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        slots: {
          default: '<div class="main-content">主要内容</div>',
          image: '<div class="slot-image">插槽图片</div>',
          description: '<div class="slot-description">插槽描述</div>'
        }
      });
      expect(wrapper.find('.main-content').exists()).toBe(true);
      expect(wrapper.find('.slot-image').exists()).toBe(true);
      expect(wrapper.find('.slot-description').exists()).toBe(true);
    });
  });

  describe('样式合并', () => {
    it('配置样式和 props 样式合并', () => {
      const propsStyle = {
        '--el-empty-padding': '40px',
        '--el-empty-image-width': '100px'
      };
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { style: propsStyle }
      });
      const elEmpty = wrapper.find('.el-empty');
      const style = elEmpty.attributes('style');
      // 配置样式和 props 样式都应该存在
      expect(style).toContain('--el-empty-padding: 40px'); // props 样式覆盖配置样式
      expect(style).toContain('--el-empty-image-width: 100px'); // props 样式
    });

    it('props 样式优先级高于配置样式', () => {
      const propsStyle = {
        '--el-empty-padding': '50px'
      };
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { style: propsStyle }
      });
      const elEmpty = wrapper.find('.el-empty');
      const style = elEmpty.attributes('style');
      // props 样式应该覆盖配置样式
      expect(style).toContain('--el-empty-padding: 50px');
      expect(style).not.toContain('--el-empty-padding: 20px');
    });
  });

  describe('边界情况', () => {
    it('image 为空字符串时使用配置默认值', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { image: '' }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('image')).toBe('default-image.png');
    });

    it('imageSize 为 0 时使用配置默认值', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { imageSize: 0 }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('imageSize')).toBe(120);
    });

    it('description 为空字符串时使用配置默认值', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { description: '' }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('description')).toBe('默认描述');
    });

    it('style 为空对象', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { style: {} }
      });
      const elEmpty = wrapper.find('.el-empty');
      // 应该只包含配置样式
      expect(elEmpty.attributes('style')).toContain('--el-empty-padding: 20px');
    });

    it('style 为 undefined', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { style: undefined }
      });
      const elEmpty = wrapper.find('.el-empty');
      // 应该只包含配置样式
      expect(elEmpty.attributes('style')).toContain('--el-empty-padding: 20px');
    });
  });

  describe('配置覆盖', () => {
    it('props 优先级高于配置', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: {
          image: 'props-image.png',
          imageSize: 200,
          description: 'props描述'
        }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('image')).toBe('props-image.png');
      expect(elEmpty.props('imageSize')).toBe(200);
      expect(elEmpty.props('description')).toBe('props描述');
    });

    it('部分 props 未传递时使用配置值', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: {
          image: 'props-image.png'
          // 不传递 imageSize 和 description
        }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('image')).toBe('props-image.png');
      expect(elEmpty.props('imageSize')).toBe(120); // 使用配置值
      expect(elEmpty.props('description')).toBe('默认描述'); // 使用配置值
    });
  });

  describe('国际化支持', () => {
    it('使用国际化描述文本', () => {
      const wrapper = mount(YEmpty, globalConfig);
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('description')).toBe('默认描述');
    });

    it('props description 覆盖国际化文本', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: { description: '自定义描述' }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('description')).toBe('自定义描述');
    });
  });

  describe('组件结构', () => {
    it('包含正确的 CSS 类名', () => {
      const wrapper = mount(YEmpty, globalConfig);
      expect(wrapper.find('.y-empty').exists()).toBe(true);
      expect(wrapper.find('.el-empty').exists()).toBe(true);
    });

    it('正确传递 v-bind 属性', () => {
      const wrapper = mount(YEmpty, {
        ...globalConfig,
        props: {
          image: 'test.png',
          imageSize: 100,
          description: '测试描述'
        }
      });
      const elEmpty = wrapper.findComponent(ElEmpty);
      expect(elEmpty.props('image')).toBe('test.png');
      expect(elEmpty.props('imageSize')).toBe(100);
      expect(elEmpty.props('description')).toBe('测试描述');
    });
  });
});
