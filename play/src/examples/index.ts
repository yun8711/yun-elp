import { defineAsyncComponent } from 'vue';

type DemoExample = {
  label: string;
  value: string;
  default?: boolean;
  component: ReturnType<typeof defineAsyncComponent>;
};

export const exampleGroups: Array<{ category: string; items: DemoExample[] }> = [
  {
    category: 'config',
    items: [
      {
        label: 'Namespace',
        value: 'namespace',
        default: true,
        component: defineAsyncComponent(() => import('./config/namespace-example.vue'))
      }
    ]
  },
  {
    category: 'layout',
    items: [
      {
        label: 'Sticky Page',
        value: 'sticky-page',
        component: defineAsyncComponent(() => import('./layout/sticky-page/index.vue'))
      }
    ]
  },
  {
    category: 'feedback',
    items: [
      {
        label: 'Page Progress',
        value: 'page-progress',
        component: defineAsyncComponent(() => import('./feedback/page-progress-example.vue'))
      },
      {
        label: 'Empty',
        value: 'empty',
        component: defineAsyncComponent(() => import('./feedback/empty-example.vue'))
      },
      {
        label: 'Pop',
        value: 'pop',
        component: defineAsyncComponent(() => import('./feedback/pop-example.vue'))
      },
      {
        label: 'Text Tooltip',
        value: 'text-tooltip',
        component: defineAsyncComponent(() => import('./feedback/text-tooltip-example.vue'))
      },
      {
        label: 'Drawer',
        value: 'drawer',
        component: defineAsyncComponent(() => import('./feedback/drawer-example.vue'))
      },
      {
        label: 'Dialog',
        value: 'dialog',
        component: defineAsyncComponent(() => import('./feedback/dialog-example.vue'))
      }
    ]
  },
  {
    category: 'basic',
    items: [
      {
        label: 'Button',
        value: 'button',
        component: defineAsyncComponent(() => import('./basic/button-example.vue'))
      }
    ]
  },
  {
    category: 'display',
    items: [
      {
        label: 'Desc',
        value: 'desc',
        component: defineAsyncComponent(() => import('./display/desc-example.vue'))
      }
    ]
  },
  {
    category: 'form',
    items: [
      {
        label: 'Form',
        value: 'form',
        component: defineAsyncComponent(() => import('./form/form-example.vue'))
      }
    ]
  },
  {
    category: 'table',
    items: [
      {
        label: 'Table',
        value: 'table',
        component: defineAsyncComponent(() => import('./table/table-example.vue'))
      },
      {
        label: 'Table Filter',
        value: 'table-filter',
        component: defineAsyncComponent(() => import('./table/table-filter.vue'))
      },
      {
        label: 'Table Search',
        value: 'table-search',
        component: defineAsyncComponent(() => import('./table/table-search.vue'))
      },
      {
        label: 'Table Select',
        value: 'table-select',
        component: defineAsyncComponent(() => import('./table/table-select-example.vue'))
      },
      {
        label: 'Table V2',
        value: 'table-v2',
        component: defineAsyncComponent(() => import('./table/table-v2/index.vue'))
      }
    ]
  },
  {
    category: 'chart',
    items: [
      {
        label: 'ECharts',
        value: 'echarts',
        component: defineAsyncComponent(() => import('./chart/echarts/echarts-example.vue'))
      }
    ]
  },
  {
    category: 'embed',
    items: [
      {
        label: '网页容器',
        value: 'web-view',
        component: defineAsyncComponent(() => import('./embed/web-view/index.vue'))
      }
    ]
  },
  {
    category: 'navigation',
    items: [
      {
        label: 'Step',
        value: 'step',
        component: defineAsyncComponent(() => import('./navigation/step-example.vue'))
      }
    ]
  }
];

export const examples = exampleGroups.flatMap(group => group.items);
