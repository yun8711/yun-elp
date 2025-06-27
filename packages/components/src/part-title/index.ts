import PartTitle from './src/part-title.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YPartTitle: SFCWithInstall<typeof PartTitle> = withInstall(PartTitle);
export default YPartTitle;

export * from './src/part-title';
