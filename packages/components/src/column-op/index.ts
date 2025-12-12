import ColumnOp from './src/column-op.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnOp: SFCWithInstall<typeof ColumnOp> = withInstall(ColumnOp);
export default YColumnOp;

export * from './src/column-op';
