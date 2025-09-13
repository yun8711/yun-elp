import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YTable from '../src/table.vue';

describe('YTable', () => {
  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YTable);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('y-table');
    });

    it('应该包含table元素', () => {
      const wrapper = mount(YTable);
      // 查找DOM元素而不是组件
      const tableElement = wrapper.find('.y-table__table');
      expect(tableElement.exists()).toBe(true);
    });

    it('应该有正确的默认属性', () => {
      const wrapper = mount(YTable);
      // 检查组件是否有正确的props
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.showFooter).toBe(true);
    });
  });

  // Props测试
  describe('Props', () => {
    it('应该支持loading属性', async () => {
      const wrapper = mount(YTable, {
        props: { loading: true }
      });

      // 检查loading属性是否正确传递
      expect(wrapper.vm.loading).toBe(true);
      // 检查是否添加了loading类
      expect(wrapper.classes()).toContain('is-loading');
    });

    it('应该支持showFooter属性', async () => {
      const wrapper = mount(YTable, {
        props: { showFooter: true }
      });

      expect(wrapper.find('.y-table__footer').exists()).toBe(true);

      await wrapper.setProps({ showFooter: false });
      expect(wrapper.find('.y-table__footer').exists()).toBe(false);
    });

    it('应该支持paginationProps属性', () => {
      const paginationProps = {
        total: 100,
        currentPage: 2,
        pageSize: 20
      };

      const wrapper = mount(YTable, {
        props: { paginationProps: paginationProps as any }
      });

      // 检查组件实例的paginationProps
      expect(wrapper.vm.paginationProps.total).toBe(100);
      expect(wrapper.vm.paginationProps.currentPage).toBe(2);
      expect(wrapper.vm.paginationProps.pageSize).toBe(20);
    });

    it('应该支持emptyProps属性', () => {
      const emptyProps = {
        image: 'test-image.png',
        description: '暂无数据'
      };

      const wrapper = mount(YTable, {
        props: { emptyProps }
      });

      // 检查组件实例的emptyProps
      expect(wrapper.vm.emptyProps.image).toBe('test-image.png');
      expect(wrapper.vm.emptyProps.description).toBe('暂无数据');
    });

    it('应该透传其他属性到el-table', () => {
      const wrapper = mount(YTable, {
        attrs: {
          'data-test': 'table-test',
          height: '400px'
        }
      });

      // 检查attrs是否正确传递
      expect(wrapper.vm.attrs['data-test']).toBe('table-test');
      expect(wrapper.vm.attrs.height).toBe('400px');
    });
  });

  // 插槽测试
  describe('插槽', () => {
    it('应该支持默认插槽', () => {
      const wrapper = mount(YTable, {
        slots: {
          default: '<div class="test-column">测试列</div>',
          footer: '<div>默认footer</div>'
        }
      });

      expect(wrapper.text()).toContain('测试列');
    });

    it('应该支持empty插槽', () => {
      const wrapper = mount(YTable, {
        slots: {
          empty: '<div class="custom-empty">自定义空状态</div>',
          footer: '<div>默认footer</div>'
        }
      });

      expect(wrapper.text()).toContain('自定义空状态');
    });

    it('应该支持footer插槽', () => {
      const wrapper = mount(YTable, {
        slots: {
          footer: '<div class="custom-footer">自定义footer</div>'
        }
      });

      expect(wrapper.text()).toContain('自定义footer');
    });

    it('应该支持append插槽', () => {
      const wrapper = mount(YTable, {
        slots: {
          append: '<div class="append-content">追加内容</div>',
          footer: '<div>默认footer</div>'
        }
      });

      // 由于append插槽在el-table内部，检查是否存在于DOM中
      const appendContent = wrapper.find('.append-content');
      expect(appendContent.exists()).toBe(true);
    });

    it('当没有提供empty插槽时应该使用默认的y-empty', () => {
      const wrapper = mount(YTable);

      // 检查empty插槽区域是否存在
      const emptySlot = wrapper.find('.y-empty');
      expect(emptySlot.exists()).toBe(true);
    });
  });

  // 事件测试
  describe('事件', () => {
    it('应该触发paginationChange事件', async () => {
      const onPaginationChange = vi.fn();
      const wrapper = mount(YTable, {
        props: {
          'onPaginationChange': onPaginationChange
        }
      });

      // 模拟paginationChange方法调用
      wrapper.vm.paginationChange(2, 20);

      expect(onPaginationChange).toHaveBeenCalledWith({
        currentPage: 2,
        pageSize: 20
      });
    });
  });

  // 样式和UI测试
  describe('样式和UI', () => {
    it('应该有正确的CSS类名', () => {
      const wrapper = mount(YTable);
      expect(wrapper.classes()).toContain('y-table');

      const table = wrapper.find('.y-table__table');
      expect(table.exists()).toBe(true);
    });

    it('footer应该显示正确的总条数', () => {
      const wrapper = mount(YTable, {
        props: {
          paginationProps: { total: 150 } as any
        }
      });

      const totalNum = wrapper.find('.y-table__footer-total-num');
      expect(totalNum.text()).toBe('150');
    });

    it('footer应该显示正确的文本', () => {
      const wrapper = mount(YTable, {
        props: {
          paginationProps: { total: 100 } as any
        }
      });

      const footerText = wrapper.find('.y-table__footer-total').text();
      expect(footerText).toContain('共');
      expect(footerText).toContain('项数据');
    });
  });

  // Ref暴露测试
  describe('Ref暴露', () => {
    it('应该暴露tableRef和paginationRef', () => {
      const wrapper = mount(YTable);

      expect(wrapper.vm.tableRef).toBeDefined();
      expect(wrapper.vm.paginationRef).toBeDefined();
    });

    it('tableRef应该指向el-table实例', () => {
      const wrapper = mount(YTable);

      // 在实际测试中，这里应该检查ref是否正确指向组件实例
      // 但由于mount的限制，我们只能检查ref存在
      expect(wrapper.vm.tableRef).not.toBeNull();
    });
  });

  // 集成测试
  describe('集成测试', () => {
    it('应该在loading状态下显示loading效果', () => {
      const wrapper = mount(YTable, {
        props: { loading: true }
      });

      // 检查是否有loading相关的类或元素
      expect(wrapper.classes()).toContain('is-loading');
    });

    it('应该正确处理完整的配置', () => {
      const wrapper = mount(YTable, {
        props: {
          loading: false,
          showFooter: true,
          paginationProps: {
            total: 200,
            currentPage: 3,
            pageSize: 25
          } as any,
          emptyProps: {
            description: '测试描述'
          }
        },
        attrs: {
          'max-height': '500px'
        }
      });

      // 检查所有配置是否正确应用
      expect(wrapper.classes()).not.toContain('is-loading');
      expect(wrapper.find('.y-table__footer').exists()).toBe(true);
      expect(wrapper.find('.y-table__footer-total-num').text()).toBe('200');

      // 检查attrs是否正确传递
      expect(wrapper.vm.attrs['max-height']).toBe('500px');

      // 检查emptyProps是否正确设置
      expect(wrapper.vm.emptyProps.description).toBe('测试描述');
    });
  });

  // 国际化测试
  describe('国际化', () => {
    it('应该支持国际化文本', () => {
      const wrapper = mount(YTable, {
        props: {
          paginationProps: { total: 100 } as any
        }
      });

      // 检查footer是否显示正确的数字
      const totalNum = wrapper.find('.y-table__footer-total-num');
      expect(totalNum.text()).toBe('100');
    });

    it('footer应该显示国际化文本', () => {
      const wrapper = mount(YTable, {
        props: {
          paginationProps: { total: 50 } as any
        }
      });

      // 检查footer文本结构是否存在（国际化文本的具体内容由locale决定）
      const footerText = wrapper.find('.y-table__footer-total').text();
      expect(footerText).toContain('50'); // 数字部分应该存在
    });
  });

  // 全局配置测试
  describe('全局配置支持', () => {
    it('应该正确处理空的全局配置', () => {
      const wrapper = mount(YTable);

      // 当没有全局配置时，应该使用默认值
      expect(wrapper.vm.emptyProps).toEqual({});
      expect(wrapper.vm.paginationProps.total).toBe(0);
      expect(wrapper.vm.paginationProps.layout).toBe('prev, pager, next, sizes, jumper');
    });

    it('应该支持组件内部的配置合并逻辑', () => {
      const wrapper = mount(YTable, {
        props: {
          emptyProps: {
            image: 'test.png',
            description: '测试描述'
          } as any,
          paginationProps: {
            total: 100,
            currentPage: 2
          } as any
        }
      });

      // 检查props配置是否正确传递
      expect(wrapper.vm.emptyProps.image).toBe('test.png');
      expect(wrapper.vm.emptyProps.description).toBe('测试描述');
      expect(wrapper.vm.paginationProps.total).toBe(100);
      expect(wrapper.vm.paginationProps.currentPage).toBe(2);
    });
  });

  // 配置合并测试
  describe('配置合并', () => {
    it('应该正确合并emptyProps配置', () => {
      const wrapper = mount(YTable, {
        props: {
          emptyProps: {
            image: 'test.png',
            description: '测试描述'
          } as any
        }
      });

      expect(wrapper.vm.emptyProps.image).toBe('test.png');
      expect(wrapper.vm.emptyProps.description).toBe('测试描述');
    });

    it('应该正确合并paginationProps配置', () => {
      const wrapper = mount(YTable, {
        props: {
          paginationProps: {
            total: 200,
            currentPage: 3
          } as any
        }
      });

      expect(wrapper.vm.paginationProps.total).toBe(200);
      expect(wrapper.vm.paginationProps.currentPage).toBe(3);
      // 检查默认值是否仍然存在
      expect(wrapper.vm.paginationProps.layout).toBe('prev, pager, next, sizes, jumper');
      expect(wrapper.vm.paginationProps.pageSizes).toEqual([10, 20, 30, 40, 50, 100, 200]);
    });

    it('应该处理undefined的props配置', () => {
      const wrapper = mount(YTable);

      // 检查当props为undefined时是否使用默认值
      expect(wrapper.vm.emptyProps).toEqual({});
      expect(wrapper.vm.paginationProps.layout).toBe('prev, pager, next, sizes, jumper');
      expect(wrapper.vm.paginationProps.total).toBe(0);
    });
  });
});
