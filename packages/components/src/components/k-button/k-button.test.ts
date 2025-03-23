import { describe, it, expect, vi } from 'vitest'
import { renderComponent } from '../../test-utils'
import KButton from './k-button.vue'

describe('KButton 组件', () => {
  // 测试渲染基础按钮
  it('应该正确渲染默认按钮', () => {
    const { getByRole } = renderComponent(KButton, {
      props: {
        type: 'primary'
      },
      slots: {
        default: '测试按钮'
      }
    })

    const button = getByRole('button')
    expect(button).toBeTruthy()
    expect(button.textContent).toBe('测试按钮')
    expect(button.classList.contains('el-button--primary')).toBe(true)
  })

  // 测试按钮禁用状态
  it('当禁用时应该渲染禁用状态', () => {
    const { getByRole } = renderComponent(KButton, {
      props: {
        disabled: true
      },
      slots: {
        default: '禁用按钮'
      }
    })

    const button = getByRole('button')
    expect(button).toBeTruthy()
    expect(button.getAttribute('disabled')).not.toBeNull()
  })

  // 测试按钮尺寸
  it('应该正确渲染不同尺寸', () => {
    const { getByRole } = renderComponent(KButton, {
      props: {
        size: 'small'
      }
    })

    const button = getByRole('button')
    expect(button.classList.contains('el-button--small')).toBe(true)
  })

  // 测试按钮加载状态
  it('应该正确渲染加载状态', () => {
    const { getByRole } = renderComponent(KButton, {
      props: {
        loading: true
      }
    })

    const button = getByRole('button')
    expect(button.classList.contains('is-loading')).toBe(true)
  })

  // 测试按钮点击事件
  it('应该正确触发点击事件', async () => {
    const onClick = vi.fn()
    const { getByRole, user } = renderComponent(KButton, {
      props: {
        onClick
      },
      slots: {
        default: '点击按钮'
      }
    })

    const button = getByRole('button')
    await user.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  // 测试禁用状态下的点击事件
  it('禁用状态下不应该触发点击事件', async () => {
    const onClick = vi.fn()
    const { getByRole, user } = renderComponent(KButton, {
      props: {
        disabled: true,
        onClick
      },
      slots: {
        default: '禁用按钮'
      }
    })

    const button = getByRole('button')
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })
})
