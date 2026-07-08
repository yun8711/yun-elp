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
      <YScrollBox
        :height="200"
        arrow-model="always"
        :arrow-style="arrowStyle"
        :step="80"
        continuous
        wheel-scroll
      >
        <div class="cards-wrapper">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="card"
            :class="{ 'featured': card.featured }"
          >
            <div class="card-header">
              <div class="card-icon">{{ card.icon }}</div>
              <div class="card-badge" v-if="card.badge">
                {{ card.badge }}
              </div>
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
  line-height: 1.6;
  color: var(--el-text-color-regular);
}

.style-selector {
  padding: 16px;
  margin-bottom: 20px;
  background-color: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.scroll-container {
  margin-bottom: 20px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
}

.cards-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.card {
  position: relative;
  flex-shrink: 0;
  width: 280px;
  overflow: hidden;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}

.card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  content: '';
  background: linear-gradient(90deg, #667eea, #764ba2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card.featured::before {
  opacity: 1;
}

.card:hover {
  box-shadow: 0 8px 24px rgb(0 0 0 / 15%);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 20px 0;
}

.card-icon {
  margin-bottom: 8px;
  font-size: 32px;
}

.card-badge {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 12px;
}

.card-content {
  padding: 0 20px 16px;
}

.card-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}

.card-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--el-text-color-regular);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.card-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.stat-item i {
  font-size: 14px;
}
</style>
