import ScrollBox from './src/scroll-box.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YScrollBox: SFCWithInstall<typeof ScrollBox> = withInstall(ScrollBox);
export default YScrollBox;

export * from './src/scroll-box';
