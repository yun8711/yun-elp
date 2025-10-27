import StickyPage from './src/sticky-page.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YStickyPage: SFCWithInstall<typeof StickyPage> = withInstall(StickyPage);
export default YStickyPage;

export * from './src/sticky-page';
