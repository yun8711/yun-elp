import Button from './src/button.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YButton: SFCWithInstall<typeof Button> = withInstall(Button);
export default YButton;

// 导出组件的props类型和emits类型
export type { ButtonProps, ButtonEmits } from './src/button';
