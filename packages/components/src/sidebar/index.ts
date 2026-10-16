import Sidebar from './src/sidebar.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YSidebar: SFCWithInstall<typeof Sidebar> = withInstall(Sidebar);
export default YSidebar;

export * from './src/sidebar';
