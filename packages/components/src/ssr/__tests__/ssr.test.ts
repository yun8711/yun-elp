// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createSSRApp, defineComponent, h, type App, type ComponentInternalInstance } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createMemoryHistory, createRouter } from 'vue-router';
import YunElp, {
  YButton,
  YColumnOp,
  YDialog,
  YEcharts,
  YForm,
  YPageProgress,
  YScrollBox,
  YStickyLayout,
  YTable,
  YTextTooltip,
  YWebView
} from '../../../index';

async function render(setup: () => unknown, install?: (app: App) => void) {
  const errors: unknown[] = [];
  const app = createSSRApp(defineComponent({ name: 'SsrHarness', setup }));
  app.config.errorHandler = error => {
    errors.push(error);
  };
  install?.(app);
  const html = await renderToString(app);
  return { html, errors };
}

describe('SSR', () => {
  it('在没有 window 的环境中渲染', () => {
    expect(typeof window).toBe('undefined');
  });

  it('全量安装后可以渲染基础组件', async () => {
    const { html, errors } = await render(
      () => () =>
        h('div', [
          h(YButton, () => '提交'),
          h(YForm, { model: { name: '' } }),
          h(YDialog, { modelValue: false, title: '标题' }),
          h(YTable, { data: [], showFooter: false })
        ]),
      app => app.use(YunElp)
    );

    expect(errors).toEqual([]);
    expect(html).toContain('y-button');
    expect(html).toContain('提交');
    expect(html).toContain('y-form');
    expect(html).toContain('y-table');
  });

  it('column-op 未安装路由时可以渲染', async () => {
    const { html, errors } = await render(
      () => () =>
        h(YTable, { data: [{ id: 1 }], showFooter: false }, () =>
          h(YColumnOp, { options: [{ label: '编辑', prop: 'edit' }] })
        )
    );

    expect(errors).toEqual([]);
    expect(html).toContain('编辑');
  });

  it('column-op 安装路由后可以渲染', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { render: () => null } }]
    });
    await router.push('/');
    await router.isReady();

    const { html, errors } = await render(
      () => () =>
        h(YTable, { data: [{ id: 1 }], showFooter: false }, () =>
          h(YColumnOp, { options: [{ label: '编辑', prop: 'edit' }] })
        ),
      app => app.use(router)
    );

    expect(errors).toEqual([]);
    expect(html).toContain('编辑');
  });

  it('page-progress 在服务端进入开始状态时不访问 window', async () => {
    const progressInstances: ComponentInternalInstance[] = [];

    const { html, errors } = await render(
      () => () => h(YPageProgress, { modelValue: false }),
      app => {
        app.mixin({
          serverPrefetch() {
            const instance = (this as unknown as { $: ComponentInternalInstance }).$;
            if (instance.type.name !== 'YPageProgress') return;
            progressInstances.push(instance);
            // watch 没有 immediate，首屏 modelValue 不会进入 startTrickle。这里在 setup 之后调用 start。
            const start = instance.setupState.start as () => void;
            try {
              start();
            } catch (error) {
              errors.push(error);
            }
          }
        });
      }
    );

    expect(errors).toEqual([]);
    expect(html).toContain('y-page-progress');
    const started = progressInstances.at(-1)?.setupState.isStarted as { value: boolean } | boolean;
    const startedValue = typeof started === 'object' && started ? started.value : started;
    expect(startedValue).toBe(true);
    const timer = progressInstances.at(-1)?.setupState.trickleTimer as { value: unknown } | null;
    const timerValue = timer && typeof timer === 'object' && 'value' in timer ? timer.value : timer;
    expect(timerValue).toBeNull();
  });

  it('测量类组件可以输出初始 HTML', async () => {
    const { html, errors } = await render(
      () => () =>
        h('div', [
          h(YTextTooltip, () => '说明'),
          h(YEcharts, { option: {} }),
          h(YStickyLayout, () => '内容'),
          h(YScrollBox, () => '滚动'),
          h(YWebView, { src: 'https://example.com' })
        ])
    );

    expect(errors).toEqual([]);
    expect(html).toContain('y-text-tooltip');
    expect(html).toContain('说明');
    expect(html).toContain('y-echarts');
    expect(html).toContain('y-sticky-layout');
    expect(html).toContain('y-scroll-box');
    expect(html).toContain('y-web-view');
    expect(html).toContain('https://example.com');
  });
});
