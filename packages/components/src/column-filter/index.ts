import ColumnFilter from './src/column-filter.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnFilter: SFCWithInstall<typeof ColumnFilter> = withInstall(ColumnFilter);
export default YColumnFilter;

export * from './src/column-filter';
