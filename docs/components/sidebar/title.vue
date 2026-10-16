<template>
  <div class="sidebar-demo">
    <y-sidebar
      v-model:collapsed="collapsed"
      :menu-list="menuList"
      :active-menu="activeMenu"
      :title-prop="titleProp"
      show-footer
      :menu-props="{ defaultOpeneds: ['/docs'] }"
      @select="onSelect"
    />
    <div class="sidebar-demo__content">
      <pre class="sidebar-demo__code">{{ configText }}</pre>
      <p class="sidebar-demo__hint">悬停被截断的标题查看提示；折叠时内置将 model 置为 none</p>
      <el-form-item label="标题省略" class="sidebar-demo__item">
        <el-switch v-model="enabled" />
      </el-form-item>
      <el-form-item label="提示方式" class="sidebar-demo__item">
        <el-radio-group v-model="model" size="small">
          <el-radio-button value="auto">溢出才显示</el-radio-button>
          <el-radio-button value="always">始终</el-radio-button>
          <el-radio-button value="none">关闭</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出现位置" class="sidebar-demo__item">
        <el-select v-model="placement" size="small" style="width: 140px">
          <el-option v-for="item in placements" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Document, House, InfoFilled } from '@element-plus/icons-vue'

const collapsed = ref(false)
const enabled = ref(true)
const model = ref('auto')
const placement = ref('right')
const placements = ['right', 'left', 'top', 'bottom']
const activeMenu = ref('/docs/guide')
const menuList = [
  {
    path: '/home',
    title: '首页',
    icon: House,
    children: [{ path: '/home/overview', title: '概览' }]
  },
  {
    path: '/docs',
    title: 'Documentation & Release Notes',
    icon: Document,
    children: [
      { path: '/docs/guide', title: 'Getting Started with the Component Library' },
      { path: '/docs/changelog', title: '更新日志与版本说明' }
    ]
  },
  { path: '/about', title: '关于我们和产品介绍', icon: InfoFilled }
]

const titleProp = computed(() => ({
  enabled: enabled.value,
  model: model.value,
  placement: placement.value
}))

const configText = computed(
  () =>
    `title-prop: ${JSON.stringify(titleProp.value, null, 2)}`
)

function onSelect(index) {
  activeMenu.value = index
}
</script>

<style scoped>
.sidebar-demo {
  display: flex;
  height: 400px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
}

.sidebar-demo__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  padding: 16px;
  overflow: auto;
}

.sidebar-demo__code {
  margin: 0 0 8px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.sidebar-demo__hint {
  margin: 0 0 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.sidebar-demo__item {
  margin-bottom: 12px;
}
</style>
