import Pop from './src/pop.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YPop: SFCWithInstall<typeof Pop> = withInstall(Pop);
export default YPop;

export * from './src/pop';
