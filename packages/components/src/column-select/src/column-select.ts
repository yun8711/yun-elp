import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { UseTooltipProps } from 'element-plus';
import type {
  DefaultRow,
  RenderRowData
} from 'element-plus/es/components/table/src/table/defaults';

export type ColumnSelectScope<T extends DefaultRow = DefaultRow> = Pick<
  RenderRowData<T>,
  'row' | 'column' | '$index' | 'store'
>;

export type ColumnSelectSelectable<T extends DefaultRow = DefaultRow> = (
  row: T,
  index: number
) => boolean;

export type ColumnSelectDisabledTip<T extends DefaultRow = DefaultRow> = (
  scope: ColumnSelectScope<T>
) => string | number | undefined | null;

export interface ColumnSelectProps<T extends DefaultRow = DefaultRow> {
  /** 是否单选，默认多选 */
  single?: boolean;
  /** 行是否可选，签名与 Element Plus TableColumn selectable 保持一致 */
  selectable?: ColumnSelectSelectable<T>;
  /** 禁用提示内容，返回空值时不显示 */
  disabledTip?: ColumnSelectDisabledTip<T>;
  /** 列宽度 */
  width?: string | number;
  /** 列最小宽度 */
  minWidth?: string | number;
  /** 禁用提示 tooltip 属性 */
  tipProps?: Partial<UseTooltipProps>;
}

export const columnSelectProps = {
  single: {
    type: Boolean,
    default: false
  },
  selectable: {
    type: Function as PropType<ColumnSelectSelectable>,
    default: () => true
  },
  disabledTip: {
    type: Function as PropType<ColumnSelectDisabledTip>,
    default: undefined
  },
  width: {
    type: [String, Number],
    default: 55
  },
  minWidth: {
    type: [String, Number],
    default: 55
  },
  tipProps: {
    type: Object as PropType<Partial<UseTooltipProps>>,
    default: () => ({})
  }
} as const;

export type ColumnSelectInstance = ExtractPublicPropTypes<typeof columnSelectProps>;
