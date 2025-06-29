import PageTitle from './src/page-title.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YPageTitle: SFCWithInstall<typeof PageTitle> = withInstall(PageTitle);
export default YPageTitle;

export * from './src/page-title';
