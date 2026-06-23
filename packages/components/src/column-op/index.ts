import ColumnOp from './src/column-op.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YColumnOp: SFCWithInstall<typeof ColumnOp> = withInstall(ColumnOp);
export default YColumnOp;

export * from './src/column-op';
