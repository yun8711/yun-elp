import SimpleRadio from './src/simple-radio.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YSimpleRadio: SFCWithInstall<typeof SimpleRadio> = withInstall(SimpleRadio);
export default YSimpleRadio;

export * from './src/simple-radio';
