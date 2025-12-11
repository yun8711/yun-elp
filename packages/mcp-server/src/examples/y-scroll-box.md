### 基础用法

默认情况下，组件会根据内容是否超出容器宽度，自动显示左右箭头按钮。通过 arrowModel=always 可以强制箭头按钮总是显示

```vue
<template>
  <!-- 容器宽度控制 -->
  <el-form-item label="容器宽度">
    <el-slider v-model="containerWidth" :min="200" :max="800" :step="50" show-input input-size="small"
      style="width: 300px" />
  </el-form-item>

  <!-- 滚动容器 -->
  <YScrollBox :height="120" class="scroll-box" :width="containerWidth">
    <div class="content-wrapper">
      <div v-for="i in 4" :key="i" class="content-item">
        <div class="item-number">{{ i }}</div>
      </div>
    </div>
  </YScrollBox>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const containerWidth = ref(400);
</script>

<style scoped>
.scroll-box {
  border: 1px solid var(--el-border-color);
  padding: 0 20px;
}

.content-wrapper {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.content-item {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, var(--el-color-primary-light-7), var(--el-color-primary-light-5));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.item-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>

```

### 滚轮功能和连续滚动

`wheelScroll` 属性控制是否开启鼠标滚轮触发水平滚动的功能；`continuous` 属性控制是否启用连续滚动功能，长按箭头按钮可以连续滚动内容；出于性能考虑，这两个功能默认都是关闭的

```vue
<template>
  <div>
    <el-form-item label="连续滚动">
      <el-switch v-model="enableContinuous" />
    </el-form-item>

    <el-form-item v-if="enableContinuous" label="continuousTime">
      <el-slider v-model="continuousTime" :min="100" :max="1000" :step="50" show-input input-size="small"
        style="width: 300px" />
    </el-form-item>

    <el-form-item v-if="enableContinuous" label="连续滚动步长">
      <el-slider v-model="continuousStep" :min="10" :max="100" :step="5" show-input input-size="small"
        style="width: 300px" />
    </el-form-item>

    <el-form-item label="鼠标滚动">
      <el-switch v-model="enableWheel" />
    </el-form-item>

    <!-- 滚动容器 -->
    <YScrollBox :height="120" class="scroll-box" :width="400" :step="50" :wheel-scroll="enableWheel"
      :continuous="enableContinuous" :continuous-time="continuousTime" :continuous-step="continuousStep">
      <div class="content-wrapper">
        <div v-for="i in 8" :key="i" class="content-item">
          <div class="item-number">{{ i }}</div>
        </div>
      </div>
    </YScrollBox>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const enableContinuous = ref(false);
const continuousTime = ref(200);
const continuousStep = ref(30);
const enableWheel = ref(false);
</script>

<style scoped>
.scroll-box {
  border: 1px solid var(--el-border-color);
  padding: 0 20px;
  margin-top: 16px;
}

.content-wrapper {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.content-item {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  background: linear-gradient(135deg, var(--el-color-primary-light-7), var(--el-color-primary-light-5));
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.item-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>

```

### 自定义箭头样式和内容

组件支持自定义箭头样式，内容部分可自由定义。

```vue
<template>
  <div class="demo-container">
    <!-- 样式选择器 -->
    <div class="style-selector">
      <el-form-item label="箭头样式">
        <el-select v-model="theme" style="width:200px">
          <el-option label="默认主题" value="default" />
          <el-option label="渐变主题" value="gradient" />
          <el-option label="圆角主题" value="rounded" />
          <el-option label="阴影主题" value="shadow" />
        </el-select>
      </el-form-item>
    </div>

    <!-- 滚动容器 -->
    <div class="scroll-container">
      <YScrollBox :height="200" arrow-model="always" :arrow-style="arrowStyle" :step="80" continuous wheel-scroll>
        <div class="cards-wrapper">
          <div v-for="(card, index) in cards" :key="index" class="card" :class="{ 'featured': card.featured }">
            <div class="card-header">
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-badge" v-if="card.badge">{{ card.badge }}</div>
            </div>
            <div class="card-content">
              <h4 class="card-title">{{ card.title }}</h4>
              <p class="card-description">{{ card.description }}</p>
            </div>
            <div class="card-footer">
              <div class="card-stats">
                <span class="stat-item">
                  <i class="el-icon-view"></i>
                  {{ card.views }}
                </span>
                <span class="stat-item">
                  <i class="el-icon-star-on"></i>
                  {{ card.rating }}
                </span>
              </div>
              <el-button type="primary" size="small" :icon="card.buttonIcon" round>
                {{ card.buttonText }}
              </el-button>
            </div>
          </div>
        </div>
      </YScrollBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const theme = ref('default')

// 卡片数据
const cards = ref([
  {
    icon: '🚀',
    title: '性能优化',
    description: '提升应用性能，优化用户体验',
    badge: '热门',
    featured: true,
    views: '2.3k',
    rating: '4.8',
    buttonIcon: 'el-icon-arrow-right',
    buttonText: '了解更多'
  },
  {
    icon: '🎨',
    title: '设计系统',
    description: '统一的设计语言和组件库',
    badge: '推荐',
    featured: false,
    views: '1.8k',
    rating: '4.9',
    buttonIcon: 'el-icon-view',
    buttonText: '查看详情'
  },
  {
    icon: '🔧',
    title: '开发工具',
    description: '强大的开发工具和调试功能',
    badge: '新品',
    featured: false,
    views: '956',
    rating: '4.7',
    buttonIcon: 'el-icon-download',
    buttonText: '立即下载'
  },
  {
    icon: '📱',
    title: '移动适配',
    description: '完美的移动端适配方案',
    featured: false,
    views: '1.2k',
    rating: '4.6',
    buttonIcon: 'el-icon-mobile',
    buttonText: '体验'
  },
  {
    icon: '🌐',
    title: '国际化',
    description: '多语言支持和本地化方案',
    featured: false,
    views: '789',
    rating: '4.5',
    buttonIcon: 'el-icon-globe',
    buttonText: '开始使用'
  },
  {
    icon: '🔒',
    title: '安全防护',
    description: '全面的安全防护和加密方案',
    badge: '重要',
    featured: false,
    views: '1.5k',
    rating: '4.8',
    buttonIcon: 'el-icon-lock',
    buttonText: '安全设置'
  },
  {
    icon: '📊',
    title: '数据分析',
    description: '强大的数据分析和可视化功能',
    featured: false,
    views: '1.1k',
    rating: '4.7',
    buttonIcon: 'el-icon-data-analysis',
    buttonText: '查看报告'
  },
  {
    icon: '⚡',
    title: '快速部署',
    description: '一键部署和自动化运维',
    featured: false,
    views: '892',
    rating: '4.6',
    buttonIcon: 'el-icon-upload',
    buttonText: '部署'
  }
]);

// 根据主题生成箭头样式
const arrowStyle = computed(() => {
  const baseStyle = {
    width: `36px`,
    height: `36px`,
    opacity: 0.8,
    transition: 'all 0.3s ease'
  };

  switch (theme.value) {
    case 'gradient':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '50%',
        color: 'white',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
      };
    case 'rounded':
      return {
        ...baseStyle,
        background: 'var(--el-color-primary)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        boxShadow: '0 2px 8px rgba(64, 158, 255, 0.3)'
      };
    case 'shadow':
      return {
        ...baseStyle,
        background: 'white',
        border: '1px solid var(--el-border-color)',
        borderRadius: '8px',
        color: 'var(--el-text-color-primary)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
      };
    default:
      return {
        ...baseStyle,
        background: 'var(--el-bg-color)',
        border: '1px solid var(--el-border-color)',
        borderRadius: 'var(--el-border-radius-base)',
        color: 'var(--el-text-color-regular)'
      };
  }
});
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-description {
  margin-bottom: 20px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

.style-selector {
  margin-bottom: 20px;
  padding: 16px;
  background-color: var(--el-fill-color-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-lighter);
}

.scroll-container {
  margin-bottom: 20px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.cards-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.card {
  flex-shrink: 0;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card.featured::before {
  opacity: 1;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.card-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.card-content {
  padding: 0 20px 16px;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.card-description {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.card-footer {
  padding: 16px 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--el-border-color-lighter);
}

.card-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-item i {
  font-size: 14px;
}
</style>

```
