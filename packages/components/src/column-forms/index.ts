import ColumnForms from './src/column-forms.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YColumnForms: SFCWithInstall<typeof ColumnForms> = withInstall(ColumnForms);
export default YColumnForms;

export * from './src/column-forms';
