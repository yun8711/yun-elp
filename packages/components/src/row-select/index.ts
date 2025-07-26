import { withInstall } from '../../utils/install';
import RowSelect from './src/row-select.vue';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YRowSelect: SFCWithInstall<typeof RowSelect> = withInstall(RowSelect);
export default YRowSelect;

export * from './src/row-select';
