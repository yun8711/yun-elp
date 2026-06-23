import Echarts from './src/echarts.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YEcharts: SFCWithInstall<typeof Echarts> = withInstall(Echarts);

export default YEcharts;

export * from './src/echarts';
