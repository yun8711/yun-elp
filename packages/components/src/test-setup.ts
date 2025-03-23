import { config } from '@vue/test-utils'
import { beforeAll, vi } from 'vitest'
import { h, defineComponent } from 'vue'

// 模拟Element Plus组件
vi.mock('element-plus', async () => {
  const ElButton = defineComponent({
    name: 'ElButton',
    props: {
      type: String,
      size: String,
      disabled: Boolean,
      loading: Boolean,
      onClick: Function
    },
    setup(props, { slots }) {
      return () =>
        h(
          'button',
          {
            class: [
              'el-button',
              props.type ? `el-button--${props.type}` : '',
              props.size ? `el-button--${props.size}` : '',
              {
                'is-disabled': props.disabled,
                'is-loading': props.loading
              }
            ],
            disabled: props.disabled,
            onClick: props.onClick
          },
          slots.default?.()
        )
    }
  })

  const mockElementPlus = {
    ElButton
  }

  // 为ElementPlus添加默认导出
  return {
    default: mockElementPlus,
    ...mockElementPlus
  }
})

// 全局组件配置
beforeAll(() => {
  // 配置Vue Test Utils
  config.global.plugins = []
})
