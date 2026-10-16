import { withInstall, type SFCWithInstall } from '../../utils/install';
import OrderButton from './src/order-button.vue';

export const YOrderButton: SFCWithInstall<typeof OrderButton> = withInstall(OrderButton);
export default YOrderButton;

export * from './src/order-button';
