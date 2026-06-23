import PageProgress from './src/page-progress.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YPageProgress: SFCWithInstall<typeof PageProgress> = withInstall(PageProgress);
export default YPageProgress;

export * from './src/page-progress';
