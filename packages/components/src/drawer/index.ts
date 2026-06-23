import Drawer from './src/drawer.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YDrawer: SFCWithInstall<typeof Drawer> = withInstall(Drawer);
export default YDrawer;

export * from './src/drawer';
