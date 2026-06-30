import { computed } from 'vue';
import { useAppConfig } from '../src/app-wrap/src/use-app-config';

function buildNamespace(namespace: string, name: string) {
  return `${namespace}-${name}`;
}

export function useNamespace(block?: string) {
  const appConfig = useAppConfig();
  const yNamespace = computed(() => appConfig?.yNamespace || 'y');
  const elNamespace = computed(() => appConfig?.elpConfig?.namespace || 'el');

  // 得到：<空间名>-<组件名>，如：y-column-filter
  const y = (name: string) => buildNamespace(yNamespace.value, name);
  // 得到el的类名：<空间名>-<组件名>，如：el-table
  const el = (name: string) => buildNamespace(elNamespace.value, name);
  // 当前 block 的 BEM block 类名，如：y-column-filter
  const b = () => (block ? y(block) : '');
  // 得到：<空间名>-<组件名>__<元素名>，如：y-column-filter__filter
  const e = (element: string) => (block ? `${b()}__${element}` : '');
  // 得到：<空间名>-<组件名>--<修饰符名>，如：y-column-filter--active
  const m = (modifier: string) => (block ? `${b()}--${modifier}` : '');
  // 得到：<空间名>-<组件名>__<元素名>--<修饰符名>，如：y-column-filter__filter--active
  const em = (element: string, modifier: string) => (block ? `${e(element)}--${modifier}` : '');
  // 得到：is-<状态名>，如：is-active
  const is = (name: string, state = true) => (state ? `is-${name}` : '');
  // 得到：--<空间名>-<变量名>，如：--y-color
  const cssVarName = (name: string) => `--${yNamespace.value}-${name}`;
  // 得到：var(--<空间名>-<变量名>)，如：var(--y-color)
  const cssVar = (name: string, fallback?: string) =>
    fallback ? `var(${cssVarName(name)}, ${fallback})` : `var(${cssVarName(name)})`;
  // 得到：--<el空间名>-<变量名>，如：--el-color
  const elCssVarName = (name: string) => `--${elNamespace.value}-${name}`;
  // 得到：var(--<el空间名>-<变量名>)，如：var(--el-color)
  const elCssVar = (name: string, fallback?: string) =>
    fallback ? `var(${elCssVarName(name)}, ${fallback})` : `var(${elCssVarName(name)})`;

  return {
    yNamespace,
    elNamespace,
    y,
    el,
    b,
    e,
    m,
    em,
    is,
    cssVarName,
    cssVar,
    elCssVarName,
    elCssVar
  };
}
