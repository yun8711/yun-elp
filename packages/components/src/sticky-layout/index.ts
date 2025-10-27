import StickyLayout from './src/sticky-layout.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YStickyLayout: SFCWithInstall<typeof StickyLayout> = withInstall(StickyLayout);
export default YStickyLayout;

export * from './src/sticky-layout';
