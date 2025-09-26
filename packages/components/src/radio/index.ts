import Radio from './src/radio.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YRadio: SFCWithInstall<typeof Radio> = withInstall(Radio);
export default YRadio;

export * from './src/radio';
