import Dialog from './src/dialog.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YDialog: SFCWithInstall<typeof Dialog> = withInstall(Dialog);
export default YDialog;

export * from './src/dialog';
