import Form from './src/form.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YForm: SFCWithInstall<typeof Form> = withInstall(Form);
export default YForm;

export * from './src/form';
