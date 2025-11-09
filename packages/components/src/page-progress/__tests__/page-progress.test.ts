/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from '@vue/runtime-core';
import YPageProgress from '../src/page-progress.vue';

describe('YPageProgress', () => {
  let wrapper: any;

  beforeEach(() => {
    // 模拟定时器
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (wrapper) {
      wrapper.unmount();
    }
  });

  // 基础渲染测试
  it('应该正确渲染基础结构', () => {
    wrapper = mount(YPageProgress, {
      props: {
        show: true
      }
    });
    expect(wrapper.classes()).toContain('y-page-progress');
  });

  it('默认不显示进度条', () => {
    wrapper = mount(YPageProgress);
    expect(wrapper.find('.y-page-progress').exists()).toBe(false);
  });

  it('当show为true时应该显示进度条', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        show: true
      }
    });
    await nextTick();
    expect(wrapper.find('.y-page-progress').exists()).toBe(true);
  });

  // 属性测试
  it('应该正确应用percentage属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        show: true,
        percentage: 0.5
      }
    });
    await nextTick();
    const bar = wrapper.find('.y-page-progress__bar');
    expect(bar.attributes('style')).toContain('width: 50%');
  });

  it('应该正确应用color属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        show: true,
        color: '#ff0000'
      }
    });
    await nextTick();
    const bar = wrapper.find('.y-page-progress__bar');
    expect(bar.attributes('style')).toContain('background-color: #ff0000');
  });

  it('应该正确应用showSpinner属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        show: true,
        showSpinner: false
      }
    });
    await nextTick();
    expect(wrapper.find('.y-page-progress__peg').exists()).toBe(false);
  });

  it('应该正确应用speed和easing属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        show: true,
        speed: 500,
        easing: 'linear'
      }
    });
    await nextTick();
    const bar = wrapper.find('.y-page-progress__bar');
    expect(bar.attributes('style')).toContain('transition: width 500ms linear');
  });

  // 方法测试
  it('start方法应该开始进度条', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.start();
    await nextTick();

    expect(wrapper.emitted()['update:show'][0]).toEqual([true]);
  });

  it('done方法应该完成进度条', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 先启动进度条
    vm.start();
    await nextTick();

    vm.done();
    await nextTick();

    // 应该发射update:show事件
    expect(wrapper.emitted()['update:show']).toBeDefined();
    expect(wrapper.emitted()['update:show'].length).toBeGreaterThanOrEqual(1);
  });

  it('set方法应该设置进度值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.set(0.75);
    await nextTick();

    expect(wrapper.emitted()['update:percentage'][0]).toEqual([0.75]);
  });

  it('inc方法应该增加进度值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 先设置初始值
    vm.set(0.1);
    await nextTick();

    // 增加进度
    vm.inc(0.2);
    await nextTick();

    const emittedValue = wrapper.emitted()['update:percentage'][1][0];
    expect(emittedValue).toBeCloseTo(0.3, 5); // 使用近似比较
  });

  it('inc方法默认应该增加随机值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.set(0.1);
    await nextTick();

    vm.inc();
    await nextTick();

    const emittedValue = wrapper.emitted()['update:percentage'][1][0];
    expect(emittedValue).toBeGreaterThan(0.1);
    expect(emittedValue).toBeLessThanOrEqual(1);
  });

  // 自动增量测试
  it('启用trickle时应该自动增加进度', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        trickle: true,
        trickleSpeed: 50
      }
    });
    const vm = wrapper.vm as any;

    // 启动进度条，这会触发trickle
    vm.start();

    await nextTick();
    vi.advanceTimersByTime(100); // 推进两次定时器
    await nextTick();

    // 应该有进度更新（至少有初始设置和一次增量）
    expect(wrapper.emitted()['update:percentage']).toBeDefined();
    expect(wrapper.emitted()['update:percentage'].length).toBeGreaterThanOrEqual(2);
  });

  // 配置测试
  it('configure方法应该更新配置', () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.configure({ color: '#00ff00', speed: 300 });

    expect(vm.settings.color).toBe('#00ff00');
    expect(vm.settings.speed).toBe(300);
  });

  // 最小值测试
  it('进度值应该不小于minimum', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        minimum: 0.1
      }
    });
    const vm = wrapper.vm as any;

    vm.set(0.05);
    await nextTick();

    expect(wrapper.emitted()['update:percentage'][0]).toEqual([0.1]);
  });

  // 最大值测试
  it('进度值应该不大于1', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.set(1.5);
    await nextTick();

    expect(wrapper.emitted()['update:percentage'][0]).toEqual([1]);
  });

  // 队列机制测试
  it('应该正确处理队列中的动画', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 先启动进度条
    vm.start();
    await nextTick();

    // 模拟动画进行中
    vm.isAnimating = true;

    vm.done();
    await nextTick();

    // 应该加入队列
    expect(vm.queue.length).toBe(1);

    // 完成当前动画
    vm.complete();
    await nextTick();

    // 队列应该被清空
    expect(vm.queue.length).toBe(0);
  });
});
