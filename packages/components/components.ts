import type { Plugin } from '@vue/runtime-core';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';
import { YBorderLabel } from './src/border-label';
import { YPartTitle } from './src/part-title';
import { YPageHeader } from './src/page-header';
import { YTableSearch } from './src/table-search';
import { YSimpleSelect } from './src/simple-select';
import { YRowSelect } from './src/row-select';
import { YSimpleRadio } from './src/simple-radio';
import { YTextTooltip } from './src/text-tooltip';
import { YButton } from './src/button';
import { YPageFooter } from './src/page-footer';
import { YDrawer } from './src/drawer';
import { YDialog } from './src/dialog';
import { YScrollBox } from './src/scroll-box';
import { YGroupSelect } from './src/group-select';
import { YEmpty } from './src/empty';
import { YDesc } from './src/desc';
import { YPop } from './src/pop';

export default [
  YAppWrap,
  YLabel,
  YBorderLabel,
  YPartTitle,
  YPageHeader,
  YTableSearch,
  YSimpleSelect,
  YRowSelect,
  YSimpleRadio,
  YTextTooltip,
  YButton,
  YPageFooter,
  YDrawer,
  YDialog,
  YScrollBox,
  YGroupSelect,
  YEmpty,
  YDesc,
  YPop,
] as Plugin[];
