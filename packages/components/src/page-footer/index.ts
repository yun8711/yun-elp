import PageFooter from './src/page-footer.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YPageFooter: SFCWithInstall<typeof PageFooter> = withInstall(PageFooter);
export default YPageFooter;

export * from './src/page-footer';
