import TableSearch from './src/table-search.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YTableSearch: SFCWithInstall<typeof TableSearch> = withInstall(TableSearch);
export default YTableSearch;

export * from './src/table-search';
