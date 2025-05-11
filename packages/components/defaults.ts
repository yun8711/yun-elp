// 默认导出，用于全局注册组件
import { makeInstaller } from './utils/make-installer';
import Components from './components';
// import Plugins from './plugin';

// export default makeInstaller([...Components, ...Plugins]);
export default makeInstaller(Components);
