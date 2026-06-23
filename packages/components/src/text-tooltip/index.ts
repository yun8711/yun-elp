import TextTooltip from './src/text-tooltip.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YTextTooltip: SFCWithInstall<typeof TextTooltip> = withInstall(TextTooltip);
export default YTextTooltip;

export * from './src/text-tooltip';
