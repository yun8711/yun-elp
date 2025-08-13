import GroupSelect from './src/group-select.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YGroupSelect: SFCWithInstall<typeof GroupSelect> = withInstall(GroupSelect);
export default YGroupSelect;

export * from './src/group-select';
