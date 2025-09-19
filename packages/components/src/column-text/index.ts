import ColumnText from './src/column-text.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnText: SFCWithInstall<typeof ColumnText> = withInstall(ColumnText);
export default YColumnText;

export * from './src/column-text';
