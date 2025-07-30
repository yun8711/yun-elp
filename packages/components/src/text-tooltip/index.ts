import TextTooltip from './src/text-tooltip.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YTextTooltip: SFCWithInstall<typeof TextTooltip> = withInstall(TextTooltip);
export default YTextTooltip;

export * from './src/text-tooltip';
