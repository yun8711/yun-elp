import Echarts from './src/echarts.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YEcharts: SFCWithInstall<typeof Echarts> = withInstall(Echarts);

export default YEcharts;

export * from './src/echarts';
