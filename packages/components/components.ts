import type { Plugin } from '@vue/runtime-core';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';
import { YBorderLabel } from './src/border-label';
import { YPartTitle } from './src/part-title';
import { YPageHeader } from './src/page-header';
import { YTableSearch } from './src/table-search';
import { YSelect } from './src/select';
import { YRowSelect } from './src/row-select';
import { YRadio } from './src/radio';
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
import { YCronPicker } from './src/cron-picker';
import { YTable } from './src/table';
import { YColumnText } from './src/column-text';
import { YColumnFilter } from './src/column-filter';

export default [
  YAppWrap,
  YLabel,
  YBorderLabel,
  YPartTitle,
  YPageHeader,
  YTableSearch,
  YSelect,
  YRowSelect,
  YRadio,
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
  YCronPicker,
  YTable,
  YColumnText,
  YColumnFilter,
] as Plugin[];
