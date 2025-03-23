# 组件库单元测试指南

本文档提供了如何为组件库编写和运行单元测试的指南。

## 测试技术栈

我们使用以下工具进行组件测试：

- **Vitest**: 测试运行器
- **@testing-library/vue**: Vue 组件测试库
- **@testing-library/user-event**: 模拟用户交互
- **@vue/test-utils**: Vue官方测试工具
- **happy-dom**: 用于提供DOM环境

## 测试文件结构

测试文件应该放在与组件相同的目录中，命名为 `[component-name].test.ts`。例如：

```
src/components/k-button/
├── k-button.vue    # 组件
├── index.ts        # 导出
└── k-button.test.ts # 测试文件
```

## 编写测试

### 基本测试模板

```typescript
import { describe, it, expect } from 'vitest'
import { renderComponent } from '../../test-utils'
import YourComponent from './your-component.vue'

describe('YourComponent 组件', () => {
  it('应该正确渲染', () => {
    const { getByText } = renderComponent(YourComponent, {
      props: {
        // 组件props
      },
      slots: {
        default: '内容'
      }
    })

    expect(getByText('内容')).toBeTruthy()
  })
})
```

### 测试用户交互

```typescript
it('应该响应用户交互', async () => {
  const onClick = vi.fn()
  const { getByRole, user } = renderComponent(YourComponent, {
    props: {
      onClick
    }
  })

  const button = getByRole('button')
  await user.click(button)

  expect(onClick).toHaveBeenCalled()
})
```

## 运行测试

使用以下命令运行测试：

```bash
# 运行所有测试
pnpm test

# 监视模式
pnpm test:watch

# 带覆盖率报告
pnpm test:coverage
```

## 测试覆盖率

我们的目标是达到以下测试覆盖率：

- 语句覆盖率: 80%+
- 分支覆盖率: 80%+
- 函数覆盖率: 90%+

## 最佳实践

1. **测试行为，而非实现**: 关注组件的功能和行为，而不是实现细节。

2. **尽可能使用用户可见的断言**: 使用 `getByText`, `getByRole` 等方法，而非 `querySelector`。

3. **为每个组件编写多个测试用例**: 测试不同的props组合、用户交互和边界情况。

4. **使用模拟替代复杂依赖**: 对于API调用、复杂组件等，使用vi.mock()。

5. **保持测试简单和独立**: 每个测试应该独立运行，不依赖其他测试的状态。

## 测试辅助工具

我们提供了一个 `test-utils` 模块，它包含了常用的测试工具函数：

- `renderComponent`: 渲染组件并提供用户交互功能
- `waitForDomUpdate`: 等待DOM更新

## 示例

参考 `k-button.test.ts` 作为编写测试的示例。
