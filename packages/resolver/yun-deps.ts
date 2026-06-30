/**
 * y 组件内部引用的其他 y 组件（PascalCase）。
 * 用于 YunElpResolver 注入内部依赖的 yun-elp / Element Plus 样式。
 *
 * 维护说明（已审计 packages/components/src 下全部 .vue 源码）：
 * - 需额外加载 yun 样式：YTableSearch→YBorderLabel/YButton、YTable→YEmpty、YDesc→YTextTooltip、YColumnOp→YPop/YButton、YDialog/YDrawer/YPop→YButton
 * - 无独立 y 样式：YAppWrap、YGroupSelect
 */
export const YUN_ELP_INTERNAL_DEPS: Record<string, readonly string[]> = {
  YColumnOp: ['YPop', 'YButton'],
  YDesc: ['YTextTooltip'],
  YDialog: ['YButton'],
  YDrawer: ['YButton'],
  YPop: ['YButton'],
  YTable: ['YEmpty'],
  YTableSearch: ['YBorderLabel', 'YButton']
};

export function getYunInternalDepsForComponent(componentName: string): readonly string[] {
  return YUN_ELP_INTERNAL_DEPS[componentName] ?? [];
}

function traverseYunInternalComponents(
  componentName: string,
  onVisit: (componentName: string) => void
): void {
  const queue = [componentName];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    for (const dep of getYunInternalDepsForComponent(current)) {
      onVisit(dep);
      queue.push(dep);
    }
  }
}

/** 收集内部 y 依赖链上需要加载 yun 样式的组件（不含 noStylesComponents）。 */
export function collectYunInternalStyleComponents(
  componentName: string,
  noStylesComponents: readonly string[] = []
): string[] {
  const result = new Set<string>();

  traverseYunInternalComponents(componentName, dep => {
    if (!noStylesComponents.includes(dep)) {
      result.add(dep);
    }
  });

  return [...result].sort();
}

/** 收集内部 y 依赖链上的全部组件（含 YButton 等无 y 样式组件，用于合并 EP 依赖）。 */
export function collectAllYunInternalComponents(componentName: string): string[] {
  const result = new Set<string>();

  traverseYunInternalComponents(componentName, dep => {
    result.add(dep);
  });

  return [...result].sort();
}
