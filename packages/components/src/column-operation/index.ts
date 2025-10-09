import ColumnOperation from './src/column-operation.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnOperation: SFCWithInstall<typeof ColumnOperation> = withInstall(ColumnOperation);
export default YColumnOperation;

export * from './src/column-operation';
