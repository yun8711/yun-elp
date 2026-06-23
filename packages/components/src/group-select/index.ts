import GroupSelect from './src/group-select.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YGroupSelect: SFCWithInstall<typeof GroupSelect> = withInstall(GroupSelect);
export default YGroupSelect;

export * from './src/group-select';
