import type { Plugin } from 'vue';
import { YAppWrap } from './src/app-wrap';
import { YLabel } from './src/label';
import { YBorderLabel } from './src/border-label';
import { YPartTitle } from './src/part-title';
import { YPageHeader } from './src/page-header';
import { YTableSearch } from './src/table-search';
import { YRowSelect } from './src/row-select';
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
import { YColumnForms } from './src/column-forms';
import { YColumnForm } from './src/column-form';
import { YColumnOp } from './src/column-op';
import { YStep } from './src/step';
import { YEcharts } from './src/echarts';
import { YStickyLayout } from './src/sticky-layout';
import { YPageProgress } from './src/page-progress';

export default [
  YAppWrap,
  YLabel,
  YBorderLabel,
  YPartTitle,
  YPageHeader,
  YTableSearch,
  YRowSelect,
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
  YColumnForms,
  YColumnForm,
  YColumnOp,
  YStep,
  YEcharts,
  YStickyLayout,
  YPageProgress
] as Plugin[];
