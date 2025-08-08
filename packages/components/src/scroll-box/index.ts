import ScrollBox from './src/scroll-box.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YScrollBox: SFCWithInstall<typeof ScrollBox> = withInstall(ScrollBox);
export default YScrollBox;

export * from './src/scroll-box';
