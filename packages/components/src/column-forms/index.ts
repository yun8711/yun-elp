import ColumnForms from './src/column-forms.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnForms: SFCWithInstall<typeof ColumnForms> = withInstall(ColumnForms);
export default YColumnForms;

export * from './src/column-forms';
