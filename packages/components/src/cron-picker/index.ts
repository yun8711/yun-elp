import CronPicker from './src/cron-picker.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YCronPicker: SFCWithInstall<typeof CronPicker> = withInstall(CronPicker);
export default YCronPicker;

export * from './src/cron-picker';
