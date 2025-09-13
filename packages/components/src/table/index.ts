import Table from './src/table.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YTable: SFCWithInstall<typeof Table> = withInstall(Table);
export default YTable;

export * from './src/table';
