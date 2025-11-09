import PageProgress from './src/page-progress.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YPageProgress: SFCWithInstall<typeof PageProgress> = withInstall(PageProgress);
export default YPageProgress;

export * from './src/page-progress';
