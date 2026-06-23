import PartTitle from './src/part-title.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YPartTitle: SFCWithInstall<typeof PartTitle> = withInstall(PartTitle);
export default YPartTitle;

export * from './src/part-title';
