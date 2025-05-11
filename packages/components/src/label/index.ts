import { withInstall } from '../../utils/install';
import Label from './src/label.vue';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YLabel: SFCWithInstall<typeof Label> = withInstall(Label);
export default YLabel;

export * from './src/label';
