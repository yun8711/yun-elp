import ColumnSelect from './src/column-select.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnSelect: SFCWithInstall<typeof ColumnSelect> = withInstall(ColumnSelect);
export default YColumnSelect;

export * from './src/column-select';
