import { withInstall } from '../../utils/install';
import AppWrap from './src/app-wrap.vue';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YAppWrap: SFCWithInstall<typeof AppWrap> = withInstall(AppWrap);
export default YAppWrap;

export * from './src/app-wrap';
