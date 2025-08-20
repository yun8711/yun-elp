import Empty from './src/empty.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YEmpty: SFCWithInstall<typeof Empty> = withInstall(Empty);
export default YEmpty;

export * from './src/empty';
