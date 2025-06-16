import type { Plugin } from '@vue/runtime-core';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';
import { YBorderLabel } from './src/border-label';

export default [YAppWrap, YLabel, YBorderLabel] as Plugin[];
