import Table from './src/table.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YTable: SFCWithInstall<typeof Table> = withInstall(Table);
export default YTable;

export * from './src/table';
