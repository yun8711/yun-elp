import FormItem from './src/form-item.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YFormItem: SFCWithInstall<typeof FormItem> = withInstall(FormItem);
export default YFormItem;

export * from './src/form-item';
