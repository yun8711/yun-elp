import ColumnForm from './src/column-form.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YColumnForm: SFCWithInstall<typeof ColumnForm> = withInstall(ColumnForm);
export default YColumnForm;

export * from './src/column-form';
