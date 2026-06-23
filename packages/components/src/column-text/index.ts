import ColumnText from './src/column-text.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YColumnText: SFCWithInstall<typeof ColumnText> = withInstall(ColumnText);
export default YColumnText;

export * from './src/column-text';
