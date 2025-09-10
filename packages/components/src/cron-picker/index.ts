import CronPicker from './src/cron-picker.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YCronPicker: SFCWithInstall<typeof CronPicker> = withInstall(CronPicker);
export default YCronPicker;

export * from './src/cron-picker';
