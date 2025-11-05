<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef } from 'vue'
import { isClient, useClipboard, useToggle } from '@vueuse/core'
import { EVENT_CODE } from 'element-plus'
import { CaretTop } from '@element-plus/icons-vue'
// import { useLang } from '../composables/lang'
// import { useSourceCode } from '../composables/source-code'
// import { usePlayground } from '../composables/use-playground'
// import demoBlockLocale from '../../i18n/component/demo-block.json'
import SourceCode from './vp-source-code.vue'

const props = defineProps<{
  source: string
  path: string
  rawSource: string
  description: string
}>()

// console.log('props', props);
// props = {
//   "source": "%3Cdiv%20class%3D%22language-vue%22%3E%3Cbutton%20title%3D%22Copy%20Code%22%20class%3D%22copy%22%3E%3C%2Fbutton%3E%3Cspan%20class%3D%22lang%22%3Evue%3C%2Fspan%3E%3Cpre%3E%3C!--%3A%3Amarkdown-it-async%3A%3Avsxzi9332zd1e11xoxjy3c%3A%3A--%3E%3Ccode%3E%26lt%3Btemplate%26gt%3B%0A%20%20%26lt%3Bdiv%20class%3D%26quot%3Bmb-4%26quot%3B%26gt%3B%0A%20%20%20%20%26lt%3Bel-button%26gt%3BDefault%26lt%3B%2Fel-button%26gt%3B%0A%20%20%26lt%3B%2Fdiv%26gt%3B%0A%26lt%3B%2Ftemplate%26gt%3B%3C%2Fcode%3E%3C%2Fpre%3E%0A%3C%2Fdiv%3E",
//   "path": "label/test",
//   "rawSource": "%3Ctemplate%3E%0A%20%20%3Cdiv%20class%3D%22mb-4%22%3E%0A%20%20%20%20%3Cel-button%3EDefault%3C%2Fel-button%3E%0A%20%20%3C%2Fdiv%3E%0A%3C%2Ftemplate%3E%0A",
//   "description": "%3Cp%3E%E6%B5%8B%E8%AF%95%3C%2Fp%3E%0A"
// }



const vm = getCurrentInstance()!

const { copy, isSupported } = useClipboard({
  source: decodeURIComponent(props.rawSource),
  read: false,
})

const [sourceVisible, toggleSourceVisible] = useToggle()
// const lang = useLang()
// const demoSourceUrl = useSourceCode(toRef(props, 'path'))

const sourceCodeRef = ref<HTMLButtonElement>()

// const locale = computed(() => demoBlockLocale[lang.value])
const decodedDescription = computed(() => decodeURIComponent(props.description))

// const onPlaygroundClick = () => {
//   const { link } = usePlayground(props.rawSource)
//   if (!isClient) return
//   window.open(link)
// }

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (
    [EVENT_CODE.enter, EVENT_CODE.numpadEnter, EVENT_CODE.space].includes(
      e.code
    )
  ) {
    e.preventDefault()
    toggleSourceVisible(false)
    sourceCodeRef.value?.focus()
  }
}

const copyCode = async () => {
  const { $message } = vm.appContext.config.globalProperties
  if (!isSupported) {
    // $message.error(locale.value['copy-error'])
    $message.error('复制失败')
  }
  try {
    await copy()
    // $message.success(locale.value['copy-success'])
    $message.success('复制成功')
  } catch (e: any) {
    $message.error(e.message)
  }
}
</script>

<template>
  <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
  <div text="sm" m="y-4" v-html="decodedDescription" />

  <div class="example">
    <!-- 组件示例 -->
    <ClientOnly>
      <div class="example-showcase">
        <slot name="source" />
      </div>
    </ClientOnly>


    <ElDivider class="m-0" />

    <div class="op-btns">
      <!-- <ElTooltip
        :content="locale['edit-in-editor']"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <ElIcon
          :size="16"
          :aria-label="locale['edit-in-editor']"
          tabindex="0"
          role="link"
          class="op-btn"
          @click="onPlaygroundClick"
          @keydown.prevent.enter="onPlaygroundClick"
          @keydown.prevent.space="onPlaygroundClick"
        >
          <i-ri-flask-line />
        </ElIcon>
      </ElTooltip>
      <ElTooltip
        :content="locale['edit-on-github']"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <ElIcon
          :size="16"
          class="op-btn github"
          style="color: var(--text-color-light)"
        >
          <a
            :href="demoSourceUrl"
            :aria-label="locale['edit-on-github']"
            rel="noreferrer noopener"
            target="_blank"
          >
            <i-ri-github-line />
          </a>
        </ElIcon>
      </ElTooltip> -->
      <!-- 复制代码 -->
      <!-- :content="locale['copy-code']" -->
      <ElTooltip content="复制代码" :show-arrow="false" :trigger="['hover', 'focus']" :trigger-keys="[]">
        <!-- :aria-label="locale['copy-code']" -->
        <ElIcon :size="16" aria-label="复制代码" class="op-btn" tabindex="0" role="button" @click="copyCode"
          @keydown.prevent.enter="copyCode" @keydown.prevent.space="copyCode">
          <i-ri-file-copy-line />
        </ElIcon>
      </ElTooltip>
      <!-- 查看源码 -->
      <ElTooltip content="查看源码" :show-arrow="false" :trigger="['hover', 'focus']" :trigger-keys="[]">
        <button ref="sourceCodeRef" :aria-label="sourceVisible ? '隐藏源码' : '查看源码'
          " class="reset-btn el-icon op-btn" @click="toggleSourceVisible()">
          <ElIcon :size="16">
            <i-ri-code-line />
          </ElIcon>
        </button>
      </ElTooltip>
    </div>
    <!-- 源码文本展示 -->
    <ElCollapseTransition>
      <SourceCode :visible="sourceVisible" :source="source" />
    </ElCollapseTransition>

    <!-- 收起源码 -->
    <Transition name="el-fade-in-linear">
      <div v-show="sourceVisible" class="example-float-control" tabindex="0" role="button"
        @click="toggleSourceVisible(false)" @keydown="onSourceVisibleKeydown">
        <ElIcon :size="16">
          <CaretTop />
        </ElIcon>
        <span>隐藏源码</span>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.example {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);

  .example-showcase {
    padding: 1.5rem;
    margin: 0.5px;
    background-color: var(--bg-color);
    border-radius: var(--el-border-radius-base);
    overflow: auto;
  }

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;

    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
