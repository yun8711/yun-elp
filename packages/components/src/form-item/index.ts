import FormItem from './src/form-item.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YFormItem: SFCWithInstall<typeof FormItem> = withInstall(FormItem);
export default YFormItem;

export * from './src/form-item';
