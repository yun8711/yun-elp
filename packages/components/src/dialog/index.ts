import Dialog from './src/dialog.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YDialog: SFCWithInstall<typeof Dialog> = withInstall(Dialog);
export default YDialog;

export * from './src/dialog';
