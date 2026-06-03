<template>
  <div class="y-web-view" :style="containerStyle">
    <iframe
      ref="iframeRef"
      class="y-web-view__iframe"
      :style="{border:border}"
      :src="src"
      v-bind="iframeAttrs"
    />
  </div>
</template>

<script setup lang="ts">
import type { WebViewProps,WebViewEmits } from './web-view';
import { toRefs, computed, useAttrs, useTemplateRef, onMounted, onUnmounted } from 'vue';

defineOptions({
  name: 'YWebView',
  inheritAttrs: false
});

const iframeRef = useTemplateRef<HTMLIFrameElement>('iframeRef');
const props = withDefaults(defineProps<WebViewProps>(), {
  width: '100%',
  height: '100%',
  border: '0'
});
const attrs = useAttrs();
const emits = defineEmits<WebViewEmits>();
const { width, height, border } = toRefs(props);

const containerStyle = computed(() => {
  return {
    width:normalizeSize(width.value),
    height:normalizeSize(height.value),
  }
})

const iframeAttrs = computed(() => {
  return {
    width:'100%',
    height:'100%',
    ...attrs
  }
})

function normalizeSize(val: string | number | null | undefined): string {
  if (val === null || val === undefined) {
    return "100%";
  }
  if (typeof val === "number") {
    return `${val}px`;
  }
  return val;
}

// 向iframe发送消息
function postMessage(message: any, targetOrigin: string) {
  if (iframeRef.value) {
    // 如果targetOrigin未提供，则只发送同源的消息
    const origin=targetOrigin||new URL(iframeRef.value.src).origin;
    iframeRef.value.contentWindow?.postMessage(message, origin);
  }
}

const reload = () => {
  const iframe = iframeRef.value;
  if (!iframe) return;
  try {
    iframe.contentWindow?.location.reload();
  } catch {
    // 跨域 fallback
    iframe.src = iframe.src + '?t=' + Date.now();
  }
}

// 监听iframe发送的消息
function onMessage(event: MessageEvent) {
  // 只接收嵌入源的消息
  if (event.source !== iframeRef.value?.contentWindow) return;
  emits('message', event);
}

onMounted(() => {
  window.addEventListener('message', onMessage);
})

onUnmounted(() => {
  window.removeEventListener('message', onMessage);
})

defineExpose({
  iframeRef,
  postMessage,
  reload
})

</script>
