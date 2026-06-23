import Button from './src/button.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YButton: SFCWithInstall<typeof Button> = withInstall(Button);
export default YButton;

// 导出组件的props类型和emits类型
export type { ButtonProps, ButtonEmits } from './src/button';
