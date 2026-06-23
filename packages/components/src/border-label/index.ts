import { withInstall, type SFCWithInstall } from '../../utils/install';
import BorderLabel from './src/border-label.vue';

export const YBorderLabel: SFCWithInstall<typeof BorderLabel> = withInstall(BorderLabel);
export default YBorderLabel;

export * from './src/border-label';
