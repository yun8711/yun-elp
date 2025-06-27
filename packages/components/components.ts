import type { Plugin } from '@vue/runtime-core';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';
import { YBorderLabel } from './src/border-label';
import { YPartTitle } from './src/part-title';

export default [
  YAppWrap,
  YLabel,
  YBorderLabel,
  YPartTitle,
] as Plugin[];
