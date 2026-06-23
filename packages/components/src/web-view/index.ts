import WebView from './src/web-view.vue';
import { withInstall, type SFCWithInstall } from '../../utils/install';

export const YWebView: SFCWithInstall<typeof WebView> = withInstall(WebView);
export default YWebView;

export * from './src/web-view';
