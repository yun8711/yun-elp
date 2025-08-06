import PageHeader from './src/page-header.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YPageHeader: SFCWithInstall<typeof PageHeader> = withInstall(PageHeader);
export default YPageHeader;

export * from './src/page-header';
