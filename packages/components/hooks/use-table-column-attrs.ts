import { computed, useAttrs, type ComputedRef } from 'vue';
import { ElTableColumn } from 'element-plus';

/**
 * 获取 el-table-column 的 props 类型
 */
type ElTableColumnProps = InstanceType<typeof ElTableColumn>['$props'];

/** 透传给 el-table-column 的 attrs（兼容模板 kebab-case） */
export type TableColumnBindAttrs = Partial<ElTableColumnProps> & {
  'min-width'?: string | number;
  'class-name'?: string;
  'column-key'?: string;
  'show-overflow-tooltip'?: boolean | object;
};

export type TableColumnAttrsDefaults = {
  minWidth?: string | number;
  width?: string | number;
  className?: string;
  fixed?: boolean | string;
  showOverflowTooltip?: boolean | object;
  /** 为 true 时回退到 attrs.prop */
  columnKey?: string | boolean;
  resizable?: boolean;
};

export type TableColumnMergedAttrs = Partial<ElTableColumnProps>;

function pickAttr<T extends string | number | boolean | object>(
  attrs: TableColumnBindAttrs,
  kebabKey: keyof TableColumnBindAttrs,
  camelKey: keyof TableColumnBindAttrs,
  fallback: T
): T {
  const kebabVal = attrs[kebabKey];
  const camelVal = attrs[camelKey];
  return (kebabVal || camelVal || fallback) as T;
}

/**
 * 读取并合并 el-table-column 透传 attrs
 */
export function useTableColumnAttrs(defaults: TableColumnAttrsDefaults = {}): {
  attrs: TableColumnBindAttrs;
  mergedColumnAttrs: ComputedRef<TableColumnMergedAttrs>;
} {
  const attrs = useAttrs() as TableColumnBindAttrs;

  const mergedColumnAttrs = computed<TableColumnMergedAttrs>(() => {
    const result: Record<string, unknown> = {
      ...attrs,
      'min-width': pickAttr(attrs, 'min-width', 'minWidth', defaults.minWidth ?? 100),
      width: pickAttr(attrs, 'width', 'width', defaults.width ?? 'auto'),
      'class-name': pickAttr(attrs, 'class-name', 'className', defaults.className ?? ''),
    };

    if (defaults.fixed !== undefined) {
      result.fixed = attrs.fixed ?? defaults.fixed;
    }

    if (defaults.showOverflowTooltip !== undefined) {
      result['show-overflow-tooltip'] = defaults.showOverflowTooltip;
    }

    result.resizable = attrs.resizable ?? defaults.resizable ?? true;

    if (defaults.columnKey === true) {
      result['column-key'] = attrs['column-key'] ?? attrs.columnKey ?? attrs.prop;
    } else if (typeof defaults.columnKey === 'string') {
      result['column-key'] = attrs['column-key'] ?? attrs.columnKey ?? defaults.columnKey;
    }

    return result as TableColumnMergedAttrs;
  });

  return { attrs, mergedColumnAttrs };
}
