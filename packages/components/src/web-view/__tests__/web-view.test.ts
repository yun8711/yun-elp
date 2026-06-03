import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import WebView from '../src/web-view.vue';

/**
 * 获取组件渲染的 iframe DOM 元素
 */
function getIframeEl(wrapper: ReturnType<typeof mount>): HTMLIFrameElement {
  return wrapper.find('iframe').element as HTMLIFrameElement;
}

/**
 * 在真实的 iframe 元素上通过 defineProperty 注入 contentWindow mock
 * （useTemplateRef 返回 Readonly<ShallowRef>，无法从外部改写 .value，
 *   因此通过操作 DOM 元素本身让 iframeRef.value.contentWindow 返回 mock）
 */
function mockContentWindow(wrapper: ReturnType<typeof mount>) {
  const iframe = getIframeEl(wrapper);
  const contentWindow = {
    postMessage: vi.fn(),
    location: { reload: vi.fn() },
  };
  Object.defineProperty(iframe, 'contentWindow', {
    value: contentWindow,
    writable: true,
    configurable: true,
  });
  return contentWindow;
}

describe('YWebView 组件', () => {
  // ==================== 渲染 ====================
  describe('基本渲染', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.exists()).toBe(true);
    });

    it('根元素应包含 y-web-view 类名', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.classes()).toContain('y-web-view');
    });

    it('iframe 应包含 y-web-view__iframe 类名', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.find('iframe').classes()).toContain('y-web-view__iframe');
    });

    it('应该渲染一个 iframe 元素', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.find('iframe').exists()).toBe(true);
    });
  });

  // ==================== Props ====================
  describe('Props', () => {
    it('应该将 src 绑定到 iframe', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.find('iframe').attributes('src')).toBe('https://example.com');
    });

    it('src 为必填项，缺失时应告警', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mount(WebView, {} as any);
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('width 默认值为 100%', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.element.style.width).toBe('100%');
    });

    it('height 默认值为 100%', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(wrapper.element.style.height).toBe('100%');
    });

    it('支持自定义 width 和 height', () => {
      const wrapper = mount(WebView, {
        props: { src: 'https://example.com', width: '800px', height: '600px' },
      });
      expect(wrapper.element.style.width).toBe('800px');
      expect(wrapper.element.style.height).toBe('600px');
    });

    it('border 默认值为 0', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      // happy-dom 会将 border: 0 序列化为 0px
      expect(wrapper.find('iframe').element.style.border).toBe('0px');
    });

    it('支持自定义 border', () => {
      const wrapper = mount(WebView, {
        props: { src: 'https://example.com', border: '1px solid red' },
      });
      expect(wrapper.find('iframe').element.style.border).toBe('1px solid red');
    });
  });

  // ==================== Attribute 透传 ====================
  describe('Attribute 透传（inheritAttrs: false）', () => {
    it('非 prop attrs 应透传到 iframe 而非根 div', () => {
      const wrapper = mount(WebView, {
        props: { src: 'https://example.com' },
        attrs: { id: 'my-iframe', 'data-test': 'val' },
      });
      expect(wrapper.find('iframe').attributes('id')).toBe('my-iframe');
      expect(wrapper.find('iframe').attributes('data-test')).toBe('val');
      // 根 div 不应有这些透传属性
      expect(wrapper.attributes('id')).toBeUndefined();
    });

    it('iframe 自带 width/height attribute 为 100%', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const iframe = wrapper.find('iframe');
      expect(iframe.attributes('width')).toBe('100%');
      expect(iframe.attributes('height')).toBe('100%');
    });
  });

  // ==================== postMessage ====================
  describe('postMessage（expose）', () => {
    it('应该调用 contentWindow.postMessage 并传递参数', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const cw = mockContentWindow(wrapper);
      const vm = wrapper.vm as any;

      vm.postMessage('hello', '*');

      expect(cw.postMessage).toHaveBeenCalledOnce();
      expect(cw.postMessage).toHaveBeenCalledWith('hello', '*');
    });

    it('应该透传 message 对象和用户指定的 targetOrigin', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const cw = mockContentWindow(wrapper);
      const vm = wrapper.vm as any;

      vm.postMessage({ foo: 'bar' }, 'https://other.com');

      expect(cw.postMessage).toHaveBeenCalledWith({ foo: 'bar' }, 'https://other.com');
    });

    it('targetOrigin 为空时退化为 iframe src 的 origin', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const cw = mockContentWindow(wrapper);
      const vm = wrapper.vm as any;

      vm.postMessage('data', '');

      expect(cw.postMessage).toHaveBeenCalledWith('data', 'https://example.com');
    });

    it('iframe 未挂载时静默跳过', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const vm = wrapper.vm as any;
      // contentWindow 为 null 时 postMessage 应静默跳过
      const iframeEl = getIframeEl(wrapper);
      Object.defineProperty(iframeEl, 'contentWindow', {
        value: null,
        writable: true,
        configurable: true,
      });

      expect(() => vm.postMessage('data', '*')).not.toThrow();
    });

    it('expose 应暴露 postMessage', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(typeof (wrapper.vm as any).postMessage).toBe('function');
    });
  });

  // ==================== reload ====================
  describe('reload（expose）', () => {
    it('同源时应该调用 contentWindow.location.reload', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const cw = mockContentWindow(wrapper);
      const vm = wrapper.vm as any;

      vm.reload();

      expect(cw.location.reload).toHaveBeenCalledOnce();
    });

    it('跨域异常时 fallback 重新设置 src', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));

      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const cw = mockContentWindow(wrapper);
      const vm = wrapper.vm as any;
      const iframeEl = getIframeEl(wrapper);

      cw.location.reload = vi.fn(() => {
        throw new DOMException('Blocked', 'SecurityError');
      });

      const originalSrc = iframeEl.src;
      vm.reload();

      expect(iframeEl.src).not.toBe(originalSrc);
      // happy-dom 会在域名后保留斜杠
      expect(iframeEl.src).toBe('https://example.com/?t=1704067200000');

      vi.useRealTimers();
    });

    it('iframe 未挂载时静默跳过', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const vm = wrapper.vm as any;
      Object.defineProperty(getIframeEl(wrapper), 'contentWindow', { value: null });

      expect(() => vm.reload()).not.toThrow();
    });

    it('expose 应暴露 reload', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(typeof (wrapper.vm as any).reload).toBe('function');
    });
  });

  // ==================== message 事件监听 ====================
  describe('message 事件监听', () => {
    it('mount 时注册 window.message 监听', () => {
      const spy = vi.spyOn(window, 'addEventListener');
      mount(WebView, { props: { src: 'https://example.com' } });
      expect(spy).toHaveBeenCalledWith('message', expect.any(Function));
      spy.mockRestore();
    });

    it('收到来自本 iframe 的消息时 emit message', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      mockContentWindow(wrapper);
      const iframeEl = getIframeEl(wrapper);

      const event = new MessageEvent('message', {
        data: { hello: 'world' },
        origin: 'https://example.com',
        source: iframeEl.contentWindow as any,
      });
      window.dispatchEvent(event);

      expect(wrapper.emitted('message')).toBeTruthy();
      expect(wrapper.emitted('message')![0]).toEqual([event]);
    });

    it('只转发 source 匹配的消息，过滤其他 source', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      mockContentWindow(wrapper);
      const iframeEl = getIframeEl(wrapper);

      // 匹配的消息 — 应触发
      const matchEvent = new MessageEvent('message', {
        data: 'from-me',
        source: iframeEl.contentWindow as any,
      });
      window.dispatchEvent(matchEvent);
      expect(wrapper.emitted('message')).toHaveLength(1);

      // 不匹配的消息 — 应过滤
      const otherEvent = new MessageEvent('message', {
        data: 'from-other',
        source: {} as any,
      });
      window.dispatchEvent(otherEvent);
      expect(wrapper.emitted('message')).toHaveLength(1);
    });

    it('source 为 null 的消息应被过滤', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      mockContentWindow(wrapper);

      const event = new MessageEvent('message', {
        data: 'cross-origin',
        source: null,
      });
      window.dispatchEvent(event);

      expect(wrapper.emitted('message')).toBeUndefined();
    });

    it('unmount 时移除 message 监听', () => {
      const spy = vi.spyOn(window, 'removeEventListener');
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });

      wrapper.unmount();

      expect(spy).toHaveBeenCalledWith('message', expect.any(Function));
      spy.mockRestore();
    });

    it('unmount 后不再响应消息', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      mockContentWindow(wrapper);
      const iframeEl = getIframeEl(wrapper);

      wrapper.unmount();

      const event = new MessageEvent('message', {
        data: 'after-unmount',
        source: iframeEl.contentWindow as any,
      });
      window.dispatchEvent(event);

      expect(wrapper.emitted('message')).toBeUndefined();
    });
  });

  // ==================== Expose ====================
  describe('defineExpose', () => {
    it('应暴露 iframeRef（指向 iframe DOM 元素）', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      const vm = wrapper.vm as any;
      const iframeEl = wrapper.find('iframe').element;
      expect(vm.iframeRef).toBeDefined();
      // @vue/test-utils 在 defineExpose 时会自动 unwrap ref，
      // 所以 vm.iframeRef 直接拿到 DOM 元素
      expect(vm.iframeRef).toBe(iframeEl);
    });

    it('应暴露 postMessage 函数', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(typeof (wrapper.vm as any).postMessage).toBe('function');
    });

    it('应暴露 reload 函数', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      expect(typeof (wrapper.vm as any).reload).toBe('function');
    });
  });

  // ==================== 边界情况 ====================
  describe('边界情况', () => {
    it('contentWindow 为 null 时 postMessage 静默跳过', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      mockContentWindow(wrapper);
      const vm = wrapper.vm as any;
      Object.defineProperty(getIframeEl(wrapper), 'contentWindow', { value: null });

      expect(() => vm.postMessage('data', '*')).not.toThrow();
    });

    it('contentWindow 为 null 时 reload 静默跳过', () => {
      const wrapper = mount(WebView, { props: { src: 'https://example.com' } });
      mockContentWindow(wrapper);
      const vm = wrapper.vm as any;
      Object.defineProperty(getIframeEl(wrapper), 'contentWindow', { value: null });

      expect(() => vm.reload()).not.toThrow();
    });
  });
});
