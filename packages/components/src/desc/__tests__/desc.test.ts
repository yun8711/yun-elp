import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, h } from 'vue';
import YDesc from '../src/desc.vue';
import type { DescItem } from '../src/desc';

// Mock YTextTooltip component
vi.mock('../../text-tooltip/src/text-tooltip.vue', () => ({
  default: {
    name: 'YTextTooltip',
    props: ['placement'],
    render() {
      return h('div', { class: 'y-text-tooltip' }, this.$slots.default?.());
    }
  }
}));

// Mock useElementSize
vi.mock('@vueuse/core', () => ({
  useElementSize: vi.fn(() => ({
    width: { value: 800 },
    height: { value: 600 }
  }))
}));

describe('YDesc 组件测试', () => {
  const mockData = {
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    address: '北京市朝阳区',
    phone: '13800138000',
    department: '技术部',
    salary: 10000,
    status: 'active',
    nested: {
      company: 'ABC公司',
      position: '前端工程师'
    }
  };

  const mockConfig: DescItem[] = [
    { label: '姓名', path: 'name', prop: 'name' } as DescItem,
    { label: '年龄', path: 'age', prop: 'age' } as DescItem,
    { label: '邮箱', path: 'email', prop: 'email' } as DescItem,
    { label: '地址', path: 'address', prop: 'address' } as DescItem,
    { label: '电话', path: 'phone', prop: 'phone' } as DescItem,
    { label: '部门', path: 'department', prop: 'department' } as DescItem
  ];

  it('基础渲染正常', () => {
    const wrapper = mount(YDesc, {
      props: {
        data: {},
        config: []
      }
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('y-desc');
  });

  it('正确显示数据', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    expect(items.length).toBe(mockConfig.length);

    // 检查第一个项目
    const firstItem = items[0];
    const label = firstItem.find('.y-desc__item-label');
    const content = firstItem.find('.y-desc__item-content');

    expect(label.text()).toBe('姓名');
    expect(content.text()).toBe('张三');
  });

  it('支持静态content内容', async () => {
    const configWithContent: DescItem[] = [
      { label: '静态内容', content: '固定值', prop: 'static' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithContent
      }
    });

    await nextTick();

    const content = wrapper.find('.y-desc__item-content');
    expect(content.text()).toBe('固定值');
  });

  it('支持路径访问嵌套数据', async () => {
    const configWithNested: DescItem[] = [
      { label: '公司', path: 'nested.company', prop: 'company' } as DescItem,
      { label: '职位', path: 'nested.position', prop: 'position' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithNested
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    expect(items[0].find('.y-desc__item-content').text()).toBe('ABC公司');
    expect(items[1].find('.y-desc__item-content').text()).toBe('前端工程师');
  });

  it('未指定path时使用label作为取值路径', async () => {
    const configWithLabelAsPath: DescItem[] = [
      { label: 'name', prop: 'name' } as DescItem, // label作为路径，应该获取到mockData.name
      { label: 'age', prop: 'age' } as DescItem,   // label作为路径，应该获取到mockData.age
      { label: '不存在的字段', prop: 'nonexistent' } as DescItem // 不存在的路径，应该显示emptyText
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithLabelAsPath,
        emptyText: '暂无数据'
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    expect(items[0].find('.y-desc__item-content').text()).toBe('张三');
    expect(items[1].find('.y-desc__item-content').text()).toBe('25');
    expect(items[2].find('.y-desc__item-content').text()).toBe('暂无数据');
  });

  it('支持格式化函数', async () => {
    const configWithFormat: DescItem[] = [
      {
        label: '薪资',
        path: 'salary',
        prop: 'salary',
        format: (value: number) => `¥${value.toLocaleString()}`
      } as DescItem,
      {
        label: '状态',
        path: 'status',
        prop: 'status',
        format: (value: string) => value === 'active' ? '活跃' : '非活跃'
      } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithFormat
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    expect(items[0].find('.y-desc__item-content').text()).toBe('¥10,000');
    expect(items[1].find('.y-desc__item-content').text()).toBe('活跃');
  });

  it('处理空值和emptyText', async () => {
    const dataWithNull = { ...mockData, name: null, age: undefined };
    const config: DescItem[] = [
      { label: '姓名', path: 'name', prop: 'name' } as DescItem,
      { label: '年龄', path: 'age', prop: 'age' } as DescItem,
      { label: '不存在字段', path: 'nonexistent', prop: 'nonexistent' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: dataWithNull,
        config,
        emptyText: '暂无数据'
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    expect(items[0].find('.y-desc__item-content').text()).toBe('暂无数据');
    expect(items[1].find('.y-desc__item-content').text()).toBe('暂无数据');
    expect(items[2].find('.y-desc__item-content').text()).toBe('暂无数据');
  });

  it('支持列数配置', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig,
        column: 2
      }
    });

    await nextTick();

    // 检查CSS变量是否设置正确
    const descElement = wrapper.find('.y-desc');
    expect(descElement.attributes('style')).toContain('--y-desc-columns: 2');
  });

  it('支持自适应列数', async () => {
    const columnFunction = vi.fn((width: number) => width > 600 ? 4 : 2);

    mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig,
        column: columnFunction
      }
    });

    await nextTick();

    expect(columnFunction).toHaveBeenCalledWith(800); // Mock的width值
  });

  it('支持垂直布局', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig,
        direction: 'vertical'
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    expect(items.some(item => item.classes().includes('y-desc__item--vertical'))).toBe(true);
  });

  it('支持span配置', async () => {
    const configWithSpan: DescItem[] = [
      { label: '全行项目', path: 'name', prop: 'name', span: 'column' } as DescItem,
      { label: '两列项目', path: 'age', prop: 'age', span: 2 } as DescItem,
      { label: '单列项目', path: 'email', prop: 'email', span: 1 } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithSpan,
        column: 3
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    const item0Style = items[0].attributes('style') || '';
    const item1Style = items[1].attributes('style') || '';
    const item2Style = items[2].attributes('style') || '';

    expect(item0Style).toContain('grid-column: span 3');
    expect(item1Style).toContain('grid-column: span 2');
    expect(item2Style).not.toContain('grid-column');
  });

  it('支持边框显示', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig
      },
      attrs: {
        border: true
      }
    });

    await nextTick();

    expect(wrapper.classes()).toContain('y-desc--bordered');

    const items = wrapper.findAll('.y-desc__item');
    expect(items.some(item => item.classes().includes('y-desc__item--bordered'))).toBe(true);
  });

  it('支持对齐方式配置', async () => {
    const configWithAlign: DescItem[] = [
      {
        label: '居中标签',
        path: 'name',
        prop: 'name',
        labelAlign: 'center',
        contentAlign: 'right'
      } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithAlign
      }
    });

    await nextTick();

    const label = wrapper.find('.y-desc__item-label');
    const content = wrapper.find('.y-desc__item-content');

    expect(label.attributes('style')).toContain('align-items: center');
    expect(content.attributes('style')).toContain('align-items: right');
  });

  it('支持全局样式配置', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig,
        labelStyle: { fontWeight: 'bold' },
        contentStyle: { color: 'red' },
        labelWidth: '120px'
      }
    });

    await nextTick();

    // 组件能正常渲染说明样式配置被接受
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll('.y-desc__item').length).toBe(mockConfig.length);
  });

  it('支持项目级样式配置', async () => {
    const configWithStyle: DescItem[] = [
      {
        label: '样式项目',
        path: 'name',
        prop: 'name',
        labelStyle: { fontSize: '14px' },
        contentStyle: { fontSize: '16px' },
        labelWidth: '100px'
      } as unknown as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithStyle
      }
    });

    await nextTick();

    const label = wrapper.find('.y-desc__item-label');
    const content = wrapper.find('.y-desc__item-content');

    expect(label.attributes('style')).toContain('font-size: 14px');
    expect(label.attributes('style')).toContain('width: 100px');
    expect(content.attributes('style')).toContain('font-size: 16px');
  });

  it('支持Tooltip功能', async () => {
    const configWithTooltip: DescItem[] = [
      { label: '带Tooltip', path: 'address', prop: 'address', textTooltip: { placement: 'top' } } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithTooltip
      }
    });

    await nextTick();

    // 组件能正常渲染说明Tooltip配置被接受
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.y-desc__item-content').text()).toBe('北京市朝阳区');
  });

  it('支持禁用Tooltip', async () => {
    const configWithNoTooltip: DescItem[] = [
      { label: '无Tooltip', path: 'name', prop: 'name', noTooltip: true } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithNoTooltip,
        noTooltip: false
      }
    });

    await nextTick();

    const tooltip = wrapper.findComponent({ name: 'YTextTooltip' });
    expect(tooltip.exists()).toBe(false);
  });

  it('支持全局禁用Tooltip', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig,
        noTooltip: true
      }
    });

    await nextTick();

    const tooltips = wrapper.findAllComponents({ name: 'YTextTooltip' });
    expect(tooltips.length).toBe(0);
  });

  it('支持插槽功能', async () => {
    const configWithSlots: DescItem[] = [
      { label: '插槽项目', prop: 'slot-item' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithSlots
      },
      slots: {
        'slot-item-label': '<em>自定义标签</em>',
        'slot-item-content': '<strong>自定义内容</strong>'
      }
    });

    await nextTick();

    const labelSlot = wrapper.find('.y-desc__item-label em');
    const contentSlot = wrapper.find('.y-desc__item-content strong');

    expect(labelSlot.exists()).toBe(true);
    expect(contentSlot.exists()).toBe(true);
    expect(labelSlot.text()).toBe('自定义标签');
    expect(contentSlot.text()).toBe('自定义内容');
  });

  it('支持默认插槽功能', async () => {
    const configWithDefaultSlots: DescItem[] = [
      { label: '默认标签项目1', path: 'name' } as DescItem,
      { label: '默认标签项目2', path: 'age' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithDefaultSlots
      },
      slots: {
        label: ({ item }: any) => h('span', { class: 'default-label' }, [`★${item.label}`]),
        content: ({ item, index }: any) => {
          // 在默认插槽中，我们需要手动获取值，就像组件内部一样
          const value = item.content || (item.path ? mockData[item.path] : mockData) || '';
          return h('span', { class: 'default-content' }, [String(value)]);
        }
      }
    });

    await nextTick();

    const defaultLabels = wrapper.findAll('.y-desc__item-label .default-label');
    const defaultContents = wrapper.findAll('.y-desc__item-content .default-content');

    expect(defaultLabels.length).toBe(2);
    expect(defaultContents.length).toBe(2);
    expect(defaultLabels[0].text()).toContain('默认标签项目1');
    expect(defaultLabels[1].text()).toContain('默认标签项目2');
    expect(defaultContents[0].text()).toContain('张三');
    expect(defaultContents[1].text()).toContain('25');
  });

  it('优先使用prop插槽而非默认插槽', async () => {
    const configWithMixedSlots: DescItem[] = [
      { label: '有prop项目', path: 'name', prop: 'name' } as DescItem,
      { label: '无prop项目', path: 'age' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithMixedSlots
      },
      slots: {
        'name-label': () => h('em', 'prop标签'),
        'name-content': () => h('strong', 'prop内容'),
        label: ({ item }: any) => h('span', { class: 'default-label' }, `默认标签-${item.label}`),
        content: ({ item }: any) => h('span', { class: 'default-content' }, `默认内容-${item.content || '无'}`)
      }
    });

    await nextTick();

    // 有prop的项目应该使用prop插槽
    const propLabel = wrapper.find('.y-desc__item-label em');
    const propContent = wrapper.find('.y-desc__item-content strong');

    // 无prop的项目应该使用默认插槽
    const defaultLabel = wrapper.find('.y-desc__item-label .default-label');
    const defaultContent = wrapper.find('.y-desc__item-content .default-content');

    expect(propLabel.exists()).toBe(true);
    expect(propContent.exists()).toBe(true);
    expect(defaultLabel.exists()).toBe(true);
    expect(defaultContent.exists()).toBe(true);
  });

  it('正确处理项目key', async () => {
    const configWithKeys: DescItem[] = [
      { label: '有prop', path: 'name', prop: 'name' } as DescItem,
      { label: '无prop', path: 'age' } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: configWithKeys
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    // Vue的key属性在DOM中不直接显示，检查项目是否正确渲染
    expect(items.length).toBe(2);
    expect(items[0].find('.y-desc__item-label').text()).toBe('有prop');
    expect(items[1].find('.y-desc__item-label').text()).toBe('无prop');
  });

  it('支持响应式容器样式', async () => {
    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: mockConfig,
        column: 3
      },
      attrs: {
        style: {
          margin: '10px',
          padding: '20px'
        }
      }
    });

    await nextTick();

    const descElement = wrapper.find('.y-desc');
    const style = descElement.attributes('style');
    expect(style).toContain('--y-desc-columns: 3');
    expect(style).toContain('margin: 10px');
    expect(style).toContain('padding: 20px');
  });

  it('处理无效配置', async () => {
    const invalidConfig: DescItem[] = [
      { label: '无效span', path: 'name', span: -1 } as DescItem,
      { label: '字符串span', path: 'age', span: 'invalid' as any } as DescItem
    ];

    const wrapper = mount(YDesc, {
      props: {
        data: mockData,
        config: invalidConfig,
        column: 2
      }
    });

    await nextTick();

    const items = wrapper.findAll('.y-desc__item');
    const item0Style = items[0].attributes('style') || '';
    const item1Style = items[1].attributes('style') || '';

    expect(item0Style).not.toContain('grid-column');
    expect(item1Style).not.toContain('grid-column');
  });
});
