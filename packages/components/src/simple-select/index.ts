import SimpleSelect from './src/simple-select.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YSimpleSelect: SFCWithInstall<typeof SimpleSelect> = withInstall(SimpleSelect);
export default YSimpleSelect;

export * from './src/simple-select';
