import Button from './src/button.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YButton: SFCWithInstall<typeof Button> = withInstall(Button);
export default YButton;

export * from './src/button';
