import ColumnSelect from './src/column-select.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YColumnSelect: SFCWithInstall<typeof ColumnSelect> = withInstall(ColumnSelect);
export default YColumnSelect;

export * from './src/column-select';
