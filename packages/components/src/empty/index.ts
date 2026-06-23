import Empty from './src/empty.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YEmpty: SFCWithInstall<typeof Empty> = withInstall(Empty);
export default YEmpty;

export * from './src/empty';
