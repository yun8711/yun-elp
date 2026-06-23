import ColumnFilter from './src/column-filter.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YColumnFilter: SFCWithInstall<typeof ColumnFilter> = withInstall(ColumnFilter);
export default YColumnFilter;

export * from './src/column-filter';
