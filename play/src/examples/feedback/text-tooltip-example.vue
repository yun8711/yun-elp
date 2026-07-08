<template>
  <div class="text-tooltip-example">
    <h2>Text Tooltip 文本溢出提示</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <p class="section-desc">
        拖动宽度与 line-clamp，切换 model 观察溢出检测；auto 模式仅在内容超出时显示 tooltip。
      </p>
      <div class="demo-box" :style="{ width: `${containerWidth}px` }">
        <y-text-tooltip :line-clamp="lineClamp" :model="model">
          Self element set width 100px,Self element set width 100px,Self element set width 100px
        </y-text-tooltip>

        <el-divider />

        <y-text-tooltip :line-clamp="lineClamp" :model="model">
          DeepSeek R1 模型已完成小版本升级，当前版本为 DeepSeek-R1-0528。用户通过官方网站、APP
          或小程序进入对话界面后，开启"深度思考"功能即可体验最新版本。API
          也已同步更新，调用方式不变。
        </y-text-tooltip>
      </div>

      <div class="controls">
        <span>宽度：</span>
        <el-slider v-model="containerWidth" style="width: 200px" :max="600" :min="80" />
        <span>line-clamp：</span>
        <el-input-number v-model="lineClamp" :min="1" :max="5" :step="1" />
        <span>model：</span>
        <el-select v-model="model" style="width: 120px">
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="example-section">
      <h3>多行省略</h3>
      <p class="section-desc">line-clamp 大于 1 时按高度判断溢出，悬停查看完整内容。</p>
      <div class="demo-box narrow">
        <y-text-tooltip :line-clamp="3" model="auto">
          这是一段较长的描述文本，用于演示多行省略与 tooltip 联动。当文本超过三行时，应自动出现
          tooltip； 若文本较短则不显示。优化后通过 ResizeObserver 与 IntersectionObserver
          在布局变化时重新计算。
        </y-text-tooltip>
      </div>
    </div>

    <div class="example-section">
      <h3>浮层内展示（teleported）</h3>
      <p class="section-desc">
        默认 teleported 为 true，tooltip 挂载到 body，避免在 Popover / Dropdown 内被裁剪。
        打开浮层后悬停长文本验证。
      </p>
      <div class="controls">
        <el-popover placement="bottom" :width="280" trigger="click">
          <template #reference>
            <el-button type="primary">Popover 内长文本</el-button>
          </template>
          <y-text-tooltip :line-clamp="2" model="auto">
            {{ longText }}
          </y-text-tooltip>
        </el-popover>

        <el-dropdown trigger="click">
          <el-button>Dropdown 内长文本</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <div style="width: 200px">
                  <y-text-tooltip :line-clamp="1" model="auto">
                    {{ longText }}
                  </y-text-tooltip>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="example-section">
      <h3>延迟布局（v-if 切换）</h3>
      <p class="section-desc">
        容器初始宽高为 0 时不应误判为不溢出；显示后应正确检测并展示 tooltip。
      </p>
      <el-button @click="delayedVisible = !delayedVisible">
        {{ delayedVisible ? '隐藏' : '显示' }}文本区域
      </el-button>
      <div v-if="delayedVisible" class="demo-box narrow" style="margin-top: 12px">
        <y-text-tooltip model="auto">
          {{ longText }}
        </y-text-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const containerWidth = ref(320);
const lineClamp = ref(1);
const model = ref<'auto' | 'always' | 'none'>('auto');
const delayedVisible = ref(false);

const modelOptions = [
  { label: 'auto', value: 'auto' },
  { label: 'always', value: 'always' },
  { label: 'none', value: 'none' }
];

const longText =
  '北京市海淀区中关村大街1号院科技大厦A座18层，这是一段用于测试浮层与延迟布局场景的超长地址描述文本，悬停应能完整展示。';
</script>

<style scoped>
.text-tooltip-example {
  max-width: 900px;
}

.example-section {
  padding: 20px;
  margin-bottom: 24px;
  background: var(--ep-bg-color);
  border: 1px solid var(--ep-border-color-light);
  border-radius: 8px;
}

.example-section h3 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.section-desc {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ep-text-color-secondary);
}

.demo-box {
  padding: 16px;
  border: 1px dashed var(--ep-border-color);
  border-radius: 6px;
}

.demo-box.narrow {
  width: 240px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
}
</style>
