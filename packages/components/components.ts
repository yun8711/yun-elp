import type { Plugin } from '@vue/runtime-core';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';

export default [YAppWrap, YLabel] as Plugin[];
