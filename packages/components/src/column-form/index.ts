import ColumnForm from './src/column-form.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YColumnForm: SFCWithInstall<typeof ColumnForm> = withInstall(ColumnForm);
export default YColumnForm;

export * from './src/column-form';
