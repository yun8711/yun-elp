import StickyLayout from './src/sticky-layout.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YStickyLayout: SFCWithInstall<typeof StickyLayout> = withInstall(StickyLayout);
export default YStickyLayout;

export * from './src/sticky-layout';
