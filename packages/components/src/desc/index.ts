import Desc from './src/desc.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YDesc: SFCWithInstall<typeof Desc> = withInstall(Desc);
export default YDesc;

export * from './src/desc';
