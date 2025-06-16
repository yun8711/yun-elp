import { withInstall } from '../../utils/install';
import BorderLabel from './src/border-label.vue';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YBorderLabel: SFCWithInstall<typeof BorderLabel> = withInstall(BorderLabel);
export default YBorderLabel;

export * from './src/border-label';
