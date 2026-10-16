<template>
  <div class="sidebar-demo">
    <y-sidebar
      v-model:collapsed="collapsed"
      v-model:visible="visible"
      :menu-list="menuList"
      :active-menu="activeMenu"
      :width-map="{ default: 184, fold: foldWidth, hidden: 0 }"
      :show-footer="showFooter"
      @select="onSelect"
    />
    <div class="sidebar-demo__content">
      <el-button :type="status === 'default' ? 'primary' : undefined" @click="setStatus('default')">
        显示
      </el-button>
      <el-button :type="status === 'fold' ? 'primary' : undefined" @click="setStatus('fold')">
        折叠
      </el-button>
      <el-button :type="status === 'hidden' ? 'primary' : undefined" @click="setStatus('hidden')">
        隐藏
      </el-button>
      <el-form-item label="底部折叠条" class="sidebar-demo__fold">
        <el-switch v-model="showFooter" />
      </el-form-item>
      <el-form-item label="折叠宽度" class="sidebar-demo__fold">
        <el-slider
          v-model="foldWidth"
          :min="48"
          :max="80"
          :step="2"
          show-input
          input-size="small"
          style="max-width: 280px"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { House, InfoFilled, Setting } from '@element-plus/icons-vue'

const collapsed = ref(false)
const visible = ref(true)
const showFooter = ref(true)
const foldWidth = ref(54)
const activeMenu = ref('/home')
const menuList = [
  { path: '/home', title: '首页', icon: House },
  { path: '/system', title: '系统', icon: Setting },
  { path: '/about', title: '关于', icon: InfoFilled }
]

const status = computed(() => {
  if (!visible.value) return 'hidden'
  if (collapsed.value) return 'fold'
  return 'default'
})

function setStatus(next) {
  visible.value = next !== 'hidden'
  collapsed.value = next === 'fold'
}

function onSelect(index) {
  activeMenu.value = index
}
</script>

<style scoped>
.sidebar-demo {
  display: flex;
  height: 320px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
}

.sidebar-demo__content {
  flex: 1;
  min-width: 0;
  padding: 16px;
}

.sidebar-demo__fold {
  margin-top: 16px;
  margin-bottom: 0;
}
</style>
