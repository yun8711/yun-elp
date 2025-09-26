import Select from './src/select.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YSelect: SFCWithInstall<typeof Select> = withInstall(Select);
export default YSelect;

export * from './src/select';
