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
        modelValue: true
      }
    });
    expect(wrapper.find('.y-page-progress').exists()).toBe(true);
  });

  it('默认不显示进度条', () => {
    wrapper = mount(YPageProgress);
    const progress = wrapper.find('.y-page-progress');
    expect(progress.exists()).toBe(true);
    expect(progress.attributes('style')).toContain('display: none');
  });

  it('当modelValue为true时应该显示进度条', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true
      }
    });
    await nextTick();
    expect(wrapper.find('.y-page-progress').exists()).toBe(true);
  });

  // 属性测试
  it('应该正确应用modelValue属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true
      }
    });
    await nextTick();
    expect(wrapper.find('.y-page-progress').exists()).toBe(true);
  });

  it('应该正确应用color属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true
      },
      attrs: {
        color: '#ff0000'
      }
    });
    await nextTick();
    // 检查组件是否接收到了color属性
    expect(wrapper.vm.$attrs.color).toBe('#ff0000');
  });

  it('应该正确应用delay属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true,
        delay: 500
      }
    });
    const vm = wrapper.vm as any;
    expect(vm.delay).toBe(500);
  });

  // 方法测试
  it('start方法应该开始进度条', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.start();
    await nextTick();

    expect(vm.isStarted).toBe(true);
    expect(vm.percentage).toBe(0);
  });

  it('done方法应该完成进度条', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 先启动进度条
    vm.start();
    await nextTick();

    vm.done();
    await nextTick();

    // 应该设置为100%
    expect(vm.percentage).toBe(100);

    // 延迟后应该隐藏
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('set方法应该设置进度值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.set(75);
    await nextTick();

    expect(vm.percentage).toBe(75);
  });

  it('inc方法应该增加进度值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 先设置初始值
    vm.set(10);
    await nextTick();

    // 增加进度
    vm.inc(20);
    await nextTick();

    expect(vm.percentage).toBe(30);
  });

  it('inc方法默认应该智能增加进度值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.set(10);
    await nextTick();

    vm.inc();
    await nextTick();

    // 从10开始应该增加10，变成20（0-20%范围的智能增量）
    expect(vm.percentage).toBe(20);
  });

  // 自动增量测试
  it('启用trickle时应该自动增加进度', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        trickle: true,
        speed: 50
      }
    });
    const vm = wrapper.vm as any;

    // 启动进度条，这会触发trickle
    vm.start();

    await nextTick();
    vi.advanceTimersByTime(100); // 推进定时器
    await nextTick();

    // 进度应该已经增加
    expect(vm.percentage).toBeGreaterThan(0);
  });

  // 属性测试
  it('应该正确应用step属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        step: 10
      }
    });
    const vm = wrapper.vm as any;

    vm.set(5);
    await nextTick();

    expect(vm.percentage).toBe(10);
  });

  it('进度值应该不大于100', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    vm.set(150);
    await nextTick();

    expect(vm.percentage).toBe(100);
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

    // 队列应该被清空，进度应该设置为100%
    expect(vm.queue.length).toBe(0);
    expect(vm.percentage).toBe(100);
  });
});
