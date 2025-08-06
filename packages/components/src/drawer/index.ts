import Drawer from './src/drawer.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YDrawer: SFCWithInstall<typeof Drawer> = withInstall(Drawer);
export default YDrawer;

export * from './src/drawer';
