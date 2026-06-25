/**
 * y 组件内部使用的 Element Plus 组件样式依赖（kebab-case）。
 * 用于 YunElpResolver 在消费方注入 EP sideEffects，弥补预编译包无法被 ElementPlusResolver 扫描的问题。
 */
export const YUN_ELP_ELEMENT_PLUS_DEPS: Record<string, readonly string[]> = {
  YAppWrap: ['config-provider'],
  YButton: ['button'],
  YColumnFilter: ['table-column'],
  YColumnForm: ['form-item', 'table-column', 'tooltip'],
  YColumnForms: ['form-item', 'table-column', 'tooltip'],
  YColumnOp: ['icon', 'popover', 'table-column'],
  YColumnSelect: ['checkbox', 'table-column', 'tooltip'],
  YColumnText: ['table-column'],
  YCronPicker: [
    'button',
    'icon',
    'input',
    'message',
    'option',
    'popover',
    'radio',
    'select',
    'time-picker'
  ],
  YDesc: ['tooltip'],
  YDialog: ['dialog'],
  YDrawer: ['drawer'],
  YEmpty: ['empty'],
  YForm: ['form', 'row'],
  YFormItem: ['col', 'form-item'],
  YGroupSelect: ['button', 'button-group'],
  YPageProgress: ['progress'],
  YPop: ['popover', 'tooltip'],
  YRowSelect: ['icon'],
  YScrollBox: ['button', 'icon', 'scrollbar'],
  YTable: ['loading', 'pagination', 'table'],
  YTableSearch: [
    'autocomplete',
    'button',
    'cascader',
    'checkbox-group',
    'collapse-transition',
    'date-picker',
    'icon',
    'input',
    'input-number',
    'option',
    'radio-group',
    'select',
    'time-picker',
    'tree-select'
  ],
  YTextTooltip: ['tooltip']
};

export type ElementPlusStyleFormat = 'css' | 'sass';

export function getElementPlusDepsForComponent(componentName: string): readonly string[] {
  return YUN_ELP_ELEMENT_PLUS_DEPS[componentName] ?? [];
}

export function getElementPlusStylePaths(
  deps: readonly string[],
  importElementStyle: ElementPlusStyleFormat
): string[] {
  if (deps.length === 0) {
    return [];
  }

  const stylePath = importElementStyle === 'sass' ? 'style/index' : 'style/css';
  const paths = new Set<string>([`element-plus/es/components/base/${stylePath}`]);

  for (const dep of deps) {
    paths.add(`element-plus/es/components/${dep}/${stylePath}`);
  }

  return [...paths].sort();
}
