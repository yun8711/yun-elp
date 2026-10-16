<template>
  <div class="sidebar-demo">
    <y-sidebar
      :menu-list="menuList"
      :active-menu="activeMenu"
      :indent="indent"
      :indent-map="indentMap"
      :menu-props="{ defaultOpeneds: openeds }"
      @select="onSelect"
    />
    <div class="sidebar-demo__content">
      <pre class="sidebar-demo__code">{{ configText }}</pre>
      <el-form-item label="一级缩进" class="sidebar-demo__item">
        <el-slider v-model="indent" :min="8" :max="32" :step="2" show-input input-size="small" />
      </el-form-item>
      <el-form-item label="覆盖二级" class="sidebar-demo__item">
        <el-switch v-model="mapLevel2" />
        <el-slider
          v-if="mapLevel2"
          v-model="mapLevel2Value"
          :min="16"
          :max="80"
          :step="4"
          show-input
          input-size="small"
        />
      </el-form-item>
      <el-form-item label="覆盖三级" class="sidebar-demo__item">
        <el-switch v-model="mapLevel3" />
        <el-slider
          v-if="mapLevel3"
          v-model="mapLevel3Value"
          :min="16"
          :max="96"
          :step="4"
          show-input
          input-size="small"
        />
      </el-form-item>
      <el-form-item label="字典 indent" class="sidebar-demo__item">
        <el-switch v-model="dictOverride" />
        <el-slider
          v-if="dictOverride"
          v-model="dictIndent"
          :min="16"
          :max="96"
          :step="4"
          show-input
          input-size="small"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Setting, User } from '@element-plus/icons-vue'

const activeMenu = ref('/system/user/list')
const openeds = ['/system', '/system/user']
const indent = ref(16)
const mapLevel2 = ref(false)
const mapLevel2Value = ref(40)
const mapLevel3 = ref(false)
const mapLevel3Value = ref(56)
const dictOverride = ref(false)
const dictIndent = ref(72)

const indentMap = computed(() => {
  const map = {}
  if (mapLevel2.value) map[2] = mapLevel2Value.value
  if (mapLevel3.value) map[3] = mapLevel3Value.value
  return map
})

const menuList = computed(() => [
  {
    path: '/system',
    title: '系统',
    icon: Setting,
    children: [
      {
        path: '/system/user',
        title: '用户',
        icon: User,
        children: [
          { path: '/system/user/list', title: '列表' },
          { path: '/system/user/role', title: '角色' }
        ]
      },
      {
        path: '/system/dict',
        title: '字典',
        ...(dictOverride.value ? { indent: dictIndent.value } : {})
      }
    ]
  },
  { path: '/about', title: '关于' }
])

const configText = computed(() => {
  const dict = dictOverride.value ? dictIndent.value : '—'
  return `indent: ${indent.value}
indent-map: ${JSON.stringify(indentMap.value)}
字典 indent: ${dict}`
})

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
  margin: 0 0 12px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  background: var(--el-fill-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.sidebar-demo__item {
  margin-bottom: 12px;
}

.sidebar-demo__item :deep(.el-form-item__content) {
  flex-wrap: wrap;
  gap: 8px;
}

.sidebar-demo__item :deep(.el-slider) {
  flex: 1;
  min-width: 160px;
}
</style>
