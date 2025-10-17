import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnOperation from '../src/column-operation.vue';
import type { ColumnOperationItemType, TableItemScope } from '../src/column-operation';

describe('YColumnOperation 表格操作列组件', () => {
  describe('基本功能', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YColumnOperation, {
        props: { options: [] }
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.html()).toContain('y-column-operation');
    });

    it('应该支持自定义列属性', () => {
      const wrapper = mount(YColumnOperation, {
        props: { options: [] },
        attrs: {
          width: 150,
          'min-width': 120,
          fixed: 'left'
        }
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Props 测试', () => {
    it('应该支持 options 属性', () => {
      const options: ColumnOperationItemType[] = [
        { label: '编辑', prop: 'edit' },
        { label: '删除', prop: 'delete' }
      ];

      const wrapper = mount(YColumnOperation, {
        props: { options }
      });

      expect(wrapper.props('options')).toEqual(options);
    });

    it('应该支持 options 为函数', () => {
      const optionsFn = vi.fn((scope: TableItemScope) => [
        { label: '编辑', prop: 'edit' },
        { label: '删除', prop: 'delete' }
      ]);

      const wrapper = mount(YColumnOperation, {
        props: { options: optionsFn }
      });

      expect(typeof wrapper.props('options')).toBe('function');
    });

    it('应该支持 headerStyle 属性', () => {
      const headerStyle = { color: 'red', fontSize: '14px' };

      const wrapper = mount(YColumnOperation, {
        props: { headerStyle, options: [] }
      });

      expect(wrapper.props('headerStyle')).toEqual(headerStyle);
    });

    it('应该支持 disabledDefaultTip 属性', () => {
      const tip = '操作被禁用';

      const wrapper = mount(YColumnOperation, {
        props: { disabledDefaultTip: tip, options: [] }
      });

      expect(wrapper.props('disabledDefaultTip')).toBe(tip);
    });
  });

  describe('操作项配置测试', () => {
    it('应该支持各种操作项状态', () => {
      const options: ColumnOperationItemType[] = [
        { label: '编辑', prop: 'edit', loading: true },
        { label: '删除', prop: 'delete', disabled: true },
        { label: '查看', prop: 'view', show: true },
        { label: '隐藏', prop: 'hidden', hide: true },
        { label: '更多', prop: 'more', dropdown: true }
      ];

      const wrapper = mount(YColumnOperation, {
        props: { options }
      });

      expect(wrapper.props('options')).toHaveLength(5);
    });

    it('应该支持复杂的disabled配置', () => {
      const options: ColumnOperationItemType[] = [
        { label: '编辑', prop: 'edit', disabled: [true, '无权限编辑'] },
        {
          label: '删除',
          prop: 'delete',
          disabled: [
            [true, '无权限删除'],
            [false, '其他原因']
          ]
        },
        { label: '查看', prop: 'view', disabled: vi.fn(() => false) }
      ];

      const wrapper = mount(YColumnOperation, {
        props: { options }
      });

      expect(wrapper.props('options')).toHaveLength(3);
    });

    it('应该支持函数类型的配置', () => {
      const labelFn = vi.fn();
      const showFn = vi.fn();
      const confirmFn = vi.fn();

      const options: ColumnOperationItemType[] = [
        {
          label: labelFn,
          prop: 'edit',
          show: showFn,
          confirm: confirmFn
        }
      ];

      const wrapper = mount(YColumnOperation, {
        props: { options }
      });

      expect(typeof wrapper.props('options')[0].label).toBe('function');
      expect(typeof wrapper.props('options')[0].show).toBe('function');
      expect(typeof wrapper.props('options')[0].confirm).toBe('function');
    });
  });

  describe('插槽测试', () => {
    it('应该支持header插槽', () => {
      const wrapper = mount(YColumnOperation, {
        props: { options: [] },
        slots: {
          header: '<span>操作</span>'
        }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持操作项的具名插槽', () => {
      const wrapper = mount(YColumnOperation, {
        props: { options: [] },
        slots: {
          edit: '<span>自定义编辑按钮</span>',
          delete: '<span>自定义删除按钮</span>'
        }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('集成测试', () => {
    it('应该能在表格中使用', () => {
      const wrapper = mount({
        template: `
          <el-table :data="tableData">
            <y-column-operation :options="options" />
          </el-table>
        `,
        components: { YColumnOperation },
        setup() {
          const tableData = [
            { id: 1, name: '项目1' },
            { id: 2, name: '项目2' }
          ];
          const options: ColumnOperationItemType[] = [
            { label: '编辑', prop: 'edit' },
            { label: '删除', prop: 'delete' }
          ];

          return { tableData, options };
        }
      });

      const columnOperation = wrapper.findComponent(YColumnOperation);
      expect(columnOperation.exists()).toBe(true);
    });

    it('应该支持动态配置选项', () => {
      const wrapper = mount({
        template: `
          <div>
            <y-column-operation
              v-for="(item, index) in tableData"
              :key="item.id"
              :options="getOptions(item, index)"
            />
          </div>
        `,
        components: { YColumnOperation },
        setup() {
          const tableData = [
            { id: 1, name: '项目1', status: 'active' },
            { id: 2, name: '项目2', status: 'inactive' }
          ];

          const getOptions = (row: any, index: number): ColumnOperationItemType[] => [
            {
              label: '编辑',
              prop: 'edit',
              disabled: row.status === 'inactive'
            },
            { label: '删除', prop: 'delete' }
          ];

          return { tableData, getOptions };
        }
      });

      const operations = wrapper.findAllComponents(YColumnOperation);
      expect(operations).toHaveLength(2);
    });
  });

  describe('样式测试', () => {
    it('应该应用正确的CSS类名', () => {
      const wrapper = mount(YColumnOperation, {
        props: { options: [] }
      });
      expect(wrapper.classes()).toContain('y-column-operation');
    });
  });
});
