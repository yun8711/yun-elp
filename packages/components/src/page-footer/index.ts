import PageFooter from './src/page-footer.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YPageFooter: SFCWithInstall<typeof PageFooter> = withInstall(PageFooter);
export default YPageFooter;

export * from './src/page-footer';
