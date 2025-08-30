import Desc from './src/desc.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YDesc: SFCWithInstall<typeof Desc> = withInstall(Desc);
export default YDesc;

export * from './src/desc';
