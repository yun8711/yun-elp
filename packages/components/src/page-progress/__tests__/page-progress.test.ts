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

  it('应该正确应用spinner属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true,
        spinner: true
      }
    });
    await nextTick();

    // 检查组件接收到的spinner属性
    const vm = wrapper.vm as any;
    expect(vm.spinner).toBe(true);
  });

  it('当未启动时spinner类名不应该出现', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        spinner: true
      }
    });
    await nextTick();

    const progress = wrapper.findComponent({ name: 'ElProgress' });
    expect(progress.classes()).not.toContain('y-page-progress__spinner');
  });

  it('应该正确应用speed属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        speed: 100
      }
    });
    const vm = wrapper.vm as any;

    vm.start();
    await nextTick();

    // 初始进度为0
    expect(vm.percentage).toBe(0);

    // 等待100ms，进度应该增加
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(vm.percentage).toBeGreaterThan(0);

    // 再等待100ms，进度应该继续增加
    const previousPercentage = vm.percentage;
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(vm.percentage).toBeGreaterThan(previousPercentage);
  });

  it('应该正确应用strokeWidth属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true
      },
      attrs: {
        strokeWidth: 4
      }
    });
    await nextTick();

    const progress = wrapper.findComponent({ name: 'ElProgress' });
    expect(progress.props('strokeWidth')).toBe(4);
  });

  it('应该正确应用indeterminate属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true
      },
      attrs: {
        indeterminate: true
      }
    });
    await nextTick();

    const progress = wrapper.findComponent({ name: 'ElProgress' });
    expect(progress.props('indeterminate')).toBe(true);
  });

  it('应该正确应用striped和stripedFlow属性', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: true
      },
      attrs: {
        striped: true,
        stripedFlow: true
      }
    });
    await nextTick();

    const progress = wrapper.findComponent({ name: 'ElProgress' });
    expect(progress.props('striped')).toBe(true);
    expect(progress.props('stripedFlow')).toBe(true);
  });

  it('组件卸载时应该清理定时器和队列', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 启动进度条，创建定时器
    vm.start();
    await nextTick();

    // 添加一些队列任务
    vm.queue.push(() => {});
    vm.queue.push(() => {});

    // 验证定时器和队列存在
    expect(vm.trickleTimer).not.toBeNull();
    expect(vm.queue.length).toBe(2);

    // 卸载组件
    wrapper.unmount();
    await nextTick();

    // 验证定时器被清理，队列被清空
    expect(vm.trickleTimer).toBeNull();
    expect(vm.queue.length).toBe(0);
  });

  it('modelValue从true切换到false时应该正确完成进度条', async () => {
    const emitSpy = vi.fn();
    wrapper = mount(YPageProgress, {
      props: {
        modelValue: false // 先设置为false
      },
      emits: {
        'update:modelValue': emitSpy
      }
    });
    const vm = wrapper.vm as any;
    await nextTick();

    // 先手动启动进度条
    vm.start();
    await nextTick();

    expect(vm.isStarted).toBe(true);
    expect(vm.percentage).toBe(0);

    // 设置modelValue为true，模拟外部控制
    await wrapper.setProps({ modelValue: true });
    await nextTick();

    // 切换modelValue为false，模拟完成操作
    await wrapper.setProps({ modelValue: false });
    await nextTick();

    // 应该立即设置为100%并停止trickle
    expect(vm.percentage).toBe(100);
    expect(vm.trickleTimer).toBeNull();

    // 等待delay时间后，应该隐藏并发射事件
    vi.advanceTimersByTime(200);
    await nextTick();

    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('done方法使用force参数时应该强制完成进度条', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 不启动进度条，直接调用done(true)
    vm.done(true);
    await nextTick();

    // 应该设置为100%
    expect(vm.percentage).toBe(100);

    // 延迟后应该隐藏
    vi.advanceTimersByTime(200);
    await nextTick();
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('done方法不使用force参数且未启动时应该无操作', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 不启动进度条，调用done()（不传force参数）
    vm.done();
    await nextTick();

    // 应该保持初始状态
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('完成进度条时应该调整动画duration以实现快速隐藏', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        delay: 400
      }
    });
    const vm = wrapper.vm as any;

    // 启动进度条
    vm.start();
    await nextTick();

    // 验证初始duration
    expect(vm.duration).toBe(3);

    // 调用done
    vm.done();
    await nextTick();

    // done方法应该立即设置percentage为100
    expect(vm.percentage).toBe(100);

    // 等待整个delay时间，应该完成整个隐藏过程
    vi.advanceTimersByTime(400);
    await nextTick();

    // 最终应该隐藏
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('step为0时应该使用0作为最小步进值', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        step: 0
      }
    });
    const vm = wrapper.vm as any;

    vm.set(5);
    await nextTick();

    // 由于step为0，Math.max(0, 5) = 5，所以结果是5
    expect(vm.percentage).toBe(5);

    // 测试设置负值的情况
    vm.set(-10);
    await nextTick();
    // Math.max(0, Math.min(100, -10)) = Math.max(0, -10) = 0
    expect(vm.percentage).toBe(0);
  });

  it('speed为0时应该创建定时器但增量行为可能不同', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        speed: 0
      }
    });
    const vm = wrapper.vm as any;

    vm.start();
    await nextTick();

    // speed为0时仍然会创建定时器（间隔为0）
    expect(vm.trickleTimer).not.toBeNull();

    // 由于speed为0，定时器会立即触发多次，但inc方法有上限保护（不超过99%）
    // 这里我们只是验证定时器被创建了，具体行为取决于实现
    expect(vm.isStarted).toBe(true);
  });

  it('delay为0时应该立即完成进度条', async () => {
    wrapper = mount(YPageProgress, {
      props: {
        delay: 0
      }
    });
    const vm = wrapper.vm as any;

    vm.start();
    vm.done();
    await nextTick();

    // delay为0时应该立即设置为100%
    expect(vm.percentage).toBe(100);

    // 由于delay为0，等待时间也为0，应该立即触发快速隐藏
    // duration会设置为delay * 0.3 = 0
    vi.advanceTimersByTime(0);
    await nextTick();
    expect(vm.duration).toBe(0);

    // 快速隐藏动画时间为0，应该立即完成
    vi.advanceTimersByTime(0);
    await nextTick();
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('set方法应该处理无效的进度值', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 设置负数进度
    vm.set(-10);
    await nextTick();
    expect(vm.percentage).toBe(8); // 应该被step值（8）限制

    // 设置超过100的进度
    vm.set(150);
    await nextTick();
    expect(vm.percentage).toBe(100); // 应该被限制为100
  });

  it('应该支持连续的开始和完成操作', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 第一次操作：开始 -> 完成
    vm.start();
    await nextTick();
    expect(vm.isStarted).toBe(true);
    expect(vm.percentage).toBe(0);

    vm.done();
    await nextTick();
    expect(vm.percentage).toBe(100);

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);

    // 第二次操作：开始 -> 完成
    vm.start();
    await nextTick();
    expect(vm.isStarted).toBe(true);
    expect(vm.percentage).toBe(0);

    vm.done();
    await nextTick();
    expect(vm.percentage).toBe(100);

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('应该支持复杂的手动进度控制', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 启动进度条
    vm.start();
    await nextTick();
    expect(vm.percentage).toBe(0);

    // 手动设置进度
    vm.set(25);
    await nextTick();
    expect(vm.percentage).toBe(25);

    // 增量进度
    vm.inc(15);
    await nextTick();
    expect(vm.percentage).toBe(40);

    // 智能增量：40在20-50%范围内，增量为4
    vm.inc();
    await nextTick();
    expect(vm.percentage).toBe(44); // 40 + 4

    // 再次智能增量：44在20-50%范围内，增量为4
    vm.inc();
    await nextTick();
    expect(vm.percentage).toBe(48); // 44 + 4

    // 完成
    vm.done();
    await nextTick();
    expect(vm.percentage).toBe(100);

    vi.advanceTimersByTime(200);
    await nextTick();
    expect(vm.isStarted).toBe(false);
    expect(vm.percentage).toBe(0);
  });

  it('应该正确处理动画队列中的多个操作', async () => {
    wrapper = mount(YPageProgress);
    const vm = wrapper.vm as any;

    // 启动并设置动画中状态
    vm.start();
    vm.isAnimating = true;
    await nextTick();

    // 快速连续调用多个done操作
    vm.done();
    vm.done();
    vm.done();
    await nextTick();

    // 每次调用done都会添加到队列中，所以应该有3个操作
    expect(vm.queue.length).toBe(3);

    // 完成当前动画，会执行队列中的第一个操作
    vm.complete();
    await nextTick();

    // 队列中应该还剩下2个操作，进度设置为100%
    expect(vm.queue.length).toBe(2);
    expect(vm.percentage).toBe(100);

    // 再次完成，会执行下一个操作
    vm.complete();
    await nextTick();
    expect(vm.queue.length).toBe(1);

    // 最后完成
    vm.complete();
    await nextTick();
    expect(vm.queue.length).toBe(0);
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
