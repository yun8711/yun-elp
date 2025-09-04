import Pop from './src/pop.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YPop: SFCWithInstall<typeof Pop> = withInstall(Pop);
export default YPop;

export * from './src/pop';
