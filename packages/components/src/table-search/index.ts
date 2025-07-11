import TableSearch from './src/table-search.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YTableSearch: SFCWithInstall<typeof TableSearch> = withInstall(TableSearch);
export default YTableSearch;

export * from './src/table-search';
