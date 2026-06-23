import Step from './src/step.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YStep: SFCWithInstall<typeof Step> = withInstall(Step);
export default YStep;

export * from './src/step';
