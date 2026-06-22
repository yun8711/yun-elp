import Form from './src/form.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YForm: SFCWithInstall<typeof Form> = withInstall(Form);
export default YForm;

export * from './src/form';
