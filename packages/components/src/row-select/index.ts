import { withInstall, type SFCWithInstall } from '../../utils/install';
import RowSelect from './src/row-select.vue';

export const YRowSelect: SFCWithInstall<typeof RowSelect> = withInstall(RowSelect);
export default YRowSelect;

export * from './src/row-select';
