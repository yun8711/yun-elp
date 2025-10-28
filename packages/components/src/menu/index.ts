import Menu from './src/menu.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YMenu: SFCWithInstall<typeof Menu> = withInstall(Menu);
export default YMenu;

export * from './src/menu';
