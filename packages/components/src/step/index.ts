import Step from './src/step.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YStep: SFCWithInstall<typeof Step> = withInstall(Step);
export default YStep;

export * from './src/step';
