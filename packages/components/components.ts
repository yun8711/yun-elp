import type { Plugin } from '@vue/runtime-core';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';
import { YBorderLabel } from './src/border-label';
import { YPartTitle } from './src/part-title';
import { YPageTitle } from './src/page-title';
import { YTableSearch } from './src/table-search';
import { YSimpleSelect } from './src/simple-select';
import { YRowSelect } from './src/row-select';
import { YSimpleRadio } from './src/simple-radio';

export default [
  YAppWrap,
  YLabel,
  YBorderLabel,
  YPartTitle,
  YPageTitle,
  YTableSearch,
  YSimpleSelect,
  YRowSelect,
  YSimpleRadio,
] as Plugin[];
