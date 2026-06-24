import { computed } from 'vue';
import { useAppConfig } from '../src/app-wrap/src/use-app-config';

function buildNamespace(namespace: string, name: string) {
  return `${namespace}-${name}`;
}

export function useNamespace(block?: string) {
  const appConfig = useAppConfig();
  const yNamespace = computed(() => appConfig?.yNamespace || 'y');
  const elNamespace = computed(() => appConfig?.elpConfig?.namespace || 'el');

  const y = (name: string) => buildNamespace(yNamespace.value, name);
  const el = (name: string) => buildNamespace(elNamespace.value, name);
  const b = () => (block ? y(block) : '');
  const e = (element: string) => (block ? `${b()}__${element}` : '');
  const m = (modifier: string) => (block ? `${b()}--${modifier}` : '');
  const em = (element: string, modifier: string) => (block ? `${e(element)}--${modifier}` : '');
  const is = (name: string, state = true) => (state ? `is-${name}` : '');
  const cssVarName = (name: string) => `--${yNamespace.value}-${name}`;
  const cssVar = (name: string, fallback?: string) =>
    fallback ? `var(${cssVarName(name)}, ${fallback})` : `var(${cssVarName(name)})`;
  const elCssVarName = (name: string) => `--${elNamespace.value}-${name}`;
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
