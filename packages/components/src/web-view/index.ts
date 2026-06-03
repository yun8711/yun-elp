import WebView from './src/web-view.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const YWebView: SFCWithInstall<typeof WebView> = withInstall(WebView);
export default YWebView;

export * from './src/web-view';
