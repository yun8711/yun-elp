import { withInstall, type SFCWithInstall } from '../../utils/install';
import AppWrap from './src/app-wrap.vue';

export const YAppWrap: SFCWithInstall<typeof AppWrap> = withInstall(AppWrap);
export default YAppWrap;

export * from './src/app-wrap';
