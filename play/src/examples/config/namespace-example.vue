<template>
  <div class="namespace-demo">
    <div class="namespace-demo__hero">
      <div>
        <p class="namespace-demo__eyebrow">SCSS Namespace Demo</p>
        <h2>play 当前以自定义前缀运行</h2>
        <p class="namespace-demo__desc">
          这个演示项目把 Element Plus 编译为 <code>{{ elementNamespace }}</code
          >，把 yun-elp 编译为 <code>{{ yunNamespace }}</code
          >。组件运行时和样式编译期都使用同一套前缀。
        </p>
      </div>
      <div class="namespace-demo__pills">
        <span
          >Element Plus: <strong>{{ elementNamespace }}</strong></span
        >
        <span
          >yun-elp: <strong>{{ yunNamespace }}</strong></span
        >
      </div>
    </div>

    <div class="namespace-demo__grid">
      <section class="namespace-demo__card">
        <h3>运行时类名</h3>
        <p>组件通过 <code>YAppWrap</code> 下发 namespace，运行时根类名会直接改变。</p>
        <div class="namespace-demo__code-list">
          <code>{{ buttonClass }}</code>
          <code>{{ popClass }}</code>
          <code>{{ tooltipClass }}</code>
        </div>
        <div class="namespace-demo__actions">
          <y-button type="primary">主按钮</y-button>
          <y-pop tip-content="已启用自定义前缀" pop-content="Popover 也使用自定义类名">
            <template #default>
              <y-button>查看 Pop</y-button>
            </template>
          </y-pop>
        </div>
      </section>

      <section class="namespace-demo__card">
        <h3>Element Plus 变量</h3>
        <p>运行时代码里默认引用的 CSS 变量也会跟随 Element Plus namespace。</p>
        <div class="namespace-demo__code-list">
          <code>{{ progressColorVar }}</code>
          <code>{{ textColorVar }}</code>
        </div>
        <div class="namespace-demo__progress-actions">
          <el-button type="primary" @click="loading = true">开始</el-button>
          <el-button @click="loading = false">结束</el-button>
        </div>
        <y-page-progress v-model="loading" />
        <div class="namespace-demo__status">当前默认颜色变量：{{ progressColorVar }}</div>
      </section>
    </div>

    <section class="namespace-demo__card namespace-demo__card--full">
      <h3>play 中的配置</h3>
      <pre class="namespace-demo__snippet"><code>{{ snippet }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useNamespace } from '@yun-elp/components/hooks';

const elementNamespace = 'ep';
const yunNamespace = 'yp';
const loading = ref(false);
const ns = useNamespace('button');
const popNs = useNamespace('pop');
const tooltipNs = useNamespace('text-tooltip');

const buttonClass = computed(() => ns.b());
const popClass = computed(() => popNs.b());
const tooltipClass = computed(() => tooltipNs.e('popper'));
const progressColorVar = computed(() => ns.elCssVar('color-primary'));
const textColorVar = computed(() => ns.elCssVar('text-color-primary'));

const snippet = `<y-app-wrap :elp-config="{ namespace: '${elementNamespace}' }" y-namespace="${yunNamespace}">\n  <your-page />\n</y-app-wrap>\n\n// vite.config.ts\nadditionalData: \`\n@use "element-plus/theme-chalk/src/mixins/config.scss" as element-config with ($namespace: "${elementNamespace}");\n@use "yun-elp/theme-chalk/src/mixins/config.scss" as yun-config with ($namespace: "${yunNamespace}");\n\``;
</script>

<style scoped lang="scss">
.namespace-demo {
  display: grid;
  gap: 18px;
}

.namespace-demo__hero,
.namespace-demo__card {
  padding: 20px;
  background: var(--ep-bg-color);
  border: 1px solid var(--ep-border-color-light);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgb(15 23 42 / 6%);
}

.namespace-demo__hero {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
}

.namespace-demo__eyebrow {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ep-color-primary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.namespace-demo__hero h2,
.namespace-demo__card h3 {
  margin: 0 0 10px;
  color: var(--ep-text-color-primary);
}

.namespace-demo__desc,
.namespace-demo__card p,
.namespace-demo__status {
  color: var(--ep-text-color-regular);
  line-height: 1.6;
}

.namespace-demo__pills {
  display: grid;
  gap: 10px;
  min-width: 220px;
}

.namespace-demo__pills span {
  padding: 10px 12px;
  color: var(--ep-text-color-primary);
  background: linear-gradient(135deg, var(--ep-color-primary-light-9), #fff);
  border: 1px solid var(--ep-color-primary-light-7);
  border-radius: 999px;
}

.namespace-demo__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.namespace-demo__card--full {
  grid-column: 1 / -1;
}

.namespace-demo__code-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 14px 0 18px;
}

.namespace-demo__code-list code,
.namespace-demo__snippet {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.namespace-demo__code-list code {
  padding: 6px 10px;
  color: var(--ep-color-primary-dark-2);
  background: var(--ep-color-primary-light-9);
  border-radius: 8px;
}

.namespace-demo__actions,
.namespace-demo__progress-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.namespace-demo__progress-actions {
  margin-bottom: 14px;
}

.namespace-demo__snippet {
  padding: 16px;
  overflow: auto;
  color: var(--ep-text-color-primary);
  background: #0f172a;
  border-radius: 12px;
}

.namespace-demo__snippet code {
  color: #e2e8f0;
}

@media (max-width: 900px) {
  .namespace-demo__hero,
  .namespace-demo__grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .namespace-demo__pills {
    min-width: 0;
    width: 100%;
  }
}
</style>
