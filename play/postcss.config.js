import { Mode } from 'postcss-rtlcss/options';

/**
 * combined 模式（官方推荐）：LTR / RTL 各生成带 dir 前缀的规则，通过祖先 dir 切换方向。
 *
 * play 约定：
 * - html 固定 dir="ltr"，调试壳层与 teleport 到 body 的 popper 走 LTR 规则
 * - demo 容器内 y-app-wrap 按 locale 设置 dir，RTL 规则因特异性顺序优先生效
 * - 控制面板 popper 使用 teleported=false，避免脱离 dir 上下文
 *
 * @see https://www.npmjs.com/package/postcss-rtlcss
 */
export default {
  plugins: {
    'postcss-rtlcss': {
      mode: Mode.combined,
      safeBothPrefix: true
    }
  }
};
