import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { TABLE_INJECTION_KEY } from 'element-plus/es/components/table/src/tokens.mjs';
import YColumnSelect from '../index';

const row = { id: 1, name: '张三' };

const createTableColumnStub = () =>
  defineComponent({
    name: 'ElTableColumn',
    props: ['type', 'selectable'],
    template: `
      <div class="el-table-column" :data-type="type">
        <slot name="header" v-bind="{ column: {}, $index: 0 }" />
        <slot v-bind="{ row, column: {}, $index: 0 }" />
      </div>
    `,
    setup() {
      return { row };
    }
  });

const ElTooltipStub = defineComponent({
  name: 'ElTooltip',
  props: ['disabled', 'content'],
  template: '<div class="el-tooltip" :data-disabled="disabled" :data-content="content"><slot /></div>'
});

const ElCheckboxStub = defineComponent({
  name: 'ElCheckbox',
  props: ['modelValue', 'disabled'],
  emits: ['update:modelValue'],
  template: `
    <button
      class="el-checkbox"
      :class="$attrs.class"
      :disabled="disabled"
      :data-checked="modelValue"
      @click="$emit('update:modelValue', !modelValue)">
      <slot />
    </button>
  `
});

const mountInTable = (props: Record<string, unknown> = {}, tableApi: Record<string, any> = {}) => {
  const selection = ref(tableApi.selection ?? []);
  const currentRow = ref(tableApi.currentRow);
  const toggleRowSelection = tableApi.toggleRowSelection ?? vi.fn();
  const setCurrentRow = tableApi.setCurrentRow ?? vi.fn((value?: any) => {
    currentRow.value = value;
  });
  const tableContext = {
    store: {
      states: {
        selection,
        currentRow
      }
    },
    toggleRowSelection,
    setCurrentRow
  };

  const ElTableStub = defineComponent({
    name: 'ElTable',
    setup(_, { slots }) {
      return {
        ...tableContext,
        slots
      };
    },
    template: '<div class="el-table"><slot /></div>'
  });

  const wrapper = mount({
    components: {
      YColumnSelect,
      ElTable: ElTableStub
    },
    template: '<el-table><y-column-select v-bind="columnProps"><template v-if="hasHeader" #header>选择</template></y-column-select></el-table>',
    setup() {
      return {
        columnProps: props,
        hasHeader: Boolean(props.single)
      };
    }
  }, {
    global: {
      stubs: {
        'el-table-column': createTableColumnStub(),
        'el-tooltip': ElTooltipStub,
        'el-checkbox': ElCheckboxStub
      },
      provide: {
        [TABLE_INJECTION_KEY as symbol]: tableContext
      }
    }
  });

  return {
    wrapper,
    selection,
    currentRow,
    toggleRowSelection,
    setCurrentRow
  };
};

describe('YColumnSelect', () => {
  it('应该按多选列渲染并使用默认列属性', () => {
    const { wrapper } = mountInTable();
    const column = wrapper.find('.el-table-column');
    const vm = wrapper.findComponent(YColumnSelect).vm as any;

    expect(column.attributes('data-type')).toBe('selection');
    expect(vm.managedColumnAttrs).toMatchObject({
      width: 55,
      'min-width': 55,
      resizable: false,
      'class-name': 'y-column-select',
      'show-overflow-tooltip': false
    });
  });

  it('应该在多选模式调用表格 toggleRowSelection', () => {
    const toggleRowSelection = vi.fn();
    const { wrapper } = mountInTable({}, { toggleRowSelection });
    const vm = wrapper.findComponent(YColumnSelect).vm as any;

    vm.handleSelect({ row, column: {}, $index: 0 }, true);

    expect(toggleRowSelection).toHaveBeenCalledWith(row, true);
  });

  it('应该在单选模式调用表格 setCurrentRow', () => {
    const setCurrentRow = vi.fn();
    const { wrapper } = mountInTable({ single: true }, { setCurrentRow });
    const vm = wrapper.findComponent(YColumnSelect).vm as any;

    expect(wrapper.find('.el-table-column').attributes('data-type')).toBeUndefined();
    expect(wrapper.text()).toContain('选择');

    vm.handleSelect({ row, column: {}, $index: 0 }, true);

    expect(setCurrentRow).toHaveBeenCalledWith(row);
  });

  it('应该根据 selectable 设置禁用状态', () => {
    const { wrapper } = mountInTable({
      selectable: () => false
    });

    expect(wrapper.find('.el-checkbox').attributes('disabled')).toBeDefined();
  });

  it('禁用行不应该触发单选切换', () => {
    const setCurrentRow = vi.fn();
    const { wrapper } = mountInTable({
      single: true,
      selectable: () => false
    }, { setCurrentRow });
    const vm = wrapper.findComponent(YColumnSelect).vm as any;

    vm.handleSelect({ row, column: {}, $index: 0 }, true);

    expect(setCurrentRow).not.toHaveBeenCalled();
  });

  it('应该支持 disabledTip 和 tipProps', () => {
    const { wrapper } = mountInTable({
      selectable: () => false,
      disabledTip: () => '不可选择',
      tipProps: {
        placement: 'bottom'
      }
    });
    const vm = wrapper.findComponent(YColumnSelect).vm as any;
    const tooltip = wrapper.find('.el-tooltip');

    expect(tooltip.attributes('data-content')).toBe('不可选择');
    expect(tooltip.attributes('data-disabled')).toBe('false');
    expect(vm.managedTipProps).toMatchObject({
      placement: 'bottom',
      enterable: false
    });
  });

  it('应该支持通过插槽 scope.store 切换选择', () => {
    const toggleRowSelection = vi.fn();
    const updateAllSelected = vi.fn();
    const commit = vi.fn();
    const wrapper = mount(YColumnSelect, {
      global: {
        stubs: {
          'el-table-column': createTableColumnStub(),
          'el-tooltip': ElTooltipStub,
          'el-checkbox': ElCheckboxStub
        }
      }
    });
    const vm = wrapper.vm as any;

    vm.handleSelect({
      row,
      column: {},
      $index: 0,
      store: {
        states: {
          selection: []
        },
        toggleRowSelection,
        updateAllSelected,
        commit
      }
    }, true);

    expect(toggleRowSelection).toHaveBeenCalledWith(row, true, false, true);
    expect(updateAllSelected).toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
  });
});
