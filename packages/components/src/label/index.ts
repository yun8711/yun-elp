import { withInstall, type SFCWithInstall } from '../../utils/install';
import Label from './src/label.vue';

export const YLabel: SFCWithInstall<typeof Label> = withInstall(Label);
export default YLabel;

export * from './src/label';
