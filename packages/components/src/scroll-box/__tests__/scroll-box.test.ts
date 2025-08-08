import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElScrollbar, ElIcon } from 'element-plus';
import YScrollBox from '../src/scroll-box.vue';

describe('YScrollBox', () => {
  it('should render correctly', () => {
    const wrapper = mount(YScrollBox, {
      global: {
        components: {
          ElScrollbar,
          ElIcon
        }
      }
    });

    expect(wrapper.find('.y-scroll-box').exists()).toBe(true);
    expect(wrapper.find('.y-scroll-box__container').exists()).toBe(true);
  });

  it('should render with default props', () => {
    const wrapper = mount(YScrollBox, {
      global: {
        components: {
          ElScrollbar,
          ElIcon
        }
      }
    });

    expect(wrapper.classes()).toContain('y-scroll-box--horizontal');
  });

  it('should render with vertical direction', () => {
    const wrapper = mount(YScrollBox, {
      props: {
        direction: 'vertical'
      },
      global: {
        components: {
          ElScrollbar,
          ElIcon
        }
      }
    });

    expect(wrapper.classes()).toContain('y-scroll-box--vertical');
  });

  it('should render arrows when arrowModel is always', () => {
    const wrapper = mount(YScrollBox, {
      props: {
        arrowModel: 'always'
      },
      global: {
        components: {
          ElScrollbar,
          ElIcon
        }
      }
    });

    expect(wrapper.find('.y-scroll-box__arrow--prev').exists()).toBe(true);
    expect(wrapper.find('.y-scroll-box__arrow--next').exists()).toBe(true);
  });

  it('should render content correctly', () => {
    const wrapper = mount(YScrollBox, {
      slots: {
        default: '<div>Test Content</div>'
      },
      global: {
        components: {
          ElScrollbar,
          ElIcon
        }
      }
    });

    expect(wrapper.text()).toContain('Test Content');
  });
});
