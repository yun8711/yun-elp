import PageHeader from './src/page-header.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YPageHeader: SFCWithInstall<typeof PageHeader> = withInstall(PageHeader);
export default YPageHeader;

export * from './src/page-header';
