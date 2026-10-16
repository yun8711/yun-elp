<template>
  <div class="sidebar-play">
    <y-sidebar
      :key="`open-${defaultOpened}`"
      ref="sidebarRef"
      v-model:collapsed="collapsed"
      v-model:visible="visible"
      class="sidebar-play__sidebar"
      :style="sidebarColorStyle"
      :menu-list="menuList"
      :active-menu="activeMenu"
      :width-map="widthMap"
      :indent="indent"
      :icon-max-width="iconMaxWidth"
      :icon-gap="iconGap"
      :item-height="itemHeight"
      :unique-opened="uniqueOpened"
      :collapse-transition="collapseTransition"
      :show-footer="showFooter"
      :title-prop="titleConfig"
      :extra-style="extraStyle"
      :menu-props="menuProps"
      @select="onSelect"
    >
      <template v-if="showHeader" #header>
        <div class="sidebar-play__logo">{{ collapsed ? 'Y' : 'YUN' }}</div>
      </template>
      <template #extra="{ item }">
        <span v-if="item.extra">{{ item.extra }}</span>
      </template>
      <template v-if="footerMode === 'custom'" #footer="{ collapsed: fold }">
        <div class="sidebar-play__footer-slot">
          <span v-show="!fold" class="sidebar-play__footer-slot-text">
            {{ fold ? '' : '自定义底部（点击仍 toggle）' }}
          </span>
        </div>
      </template>
    </y-sidebar>

    <div class="sidebar-play__main">
      <div class="sidebar-play__controls">
        <section class="sidebar-play__section">
          <h4 class="sidebar-play__section-title">状态</h4>
          <div class="sidebar-play__grid sidebar-play__grid--4">
            <label class="sidebar-play__inline">
              <span>显示侧栏</span>
              <el-switch v-model="visible" />
            </label>
            <label class="sidebar-play__inline">
              <span>Logo</span>
              <el-switch v-model="showHeader" />
            </label>
            <label class="sidebar-play__inline">
              <span>手风琴</span>
              <el-switch v-model="uniqueOpened" />
            </label>
            <label class="sidebar-play__inline">
              <span>折叠动画</span>
              <el-switch v-model="collapseTransition" />
            </label>
            <label class="sidebar-play__inline">
              <span>预展开</span>
              <el-switch v-model="defaultOpened" />
            </label>
            <label class="sidebar-play__inline">
              <span>标题省略</span>
              <el-switch v-model="titleEnabled" />
            </label>
            <label class="sidebar-play__inline">
              <span>溢出提示</span>
              <el-switch v-model="titleTooltipAuto" />
            </label>
          </div>
        </section>

        <section class="sidebar-play__section">
          <h4 class="sidebar-play__section-title">底部</h4>
          <div class="sidebar-play__footer-panel">
            <el-radio-group v-model="footerMode" size="small">
              <el-radio-button value="hidden">不显示</el-radio-button>
              <el-radio-button value="default">内置折叠条</el-radio-button>
              <el-radio-button value="custom">自定义 #footer</el-radio-button>
            </el-radio-group>
            <p class="sidebar-play__hint">
              <template v-if="footerMode === 'hidden'"
                >未开启 `show-footer` 且无插槽时无底部区域。</template
              >
              <template v-else-if="footerMode === 'default'"
                >`show-footer`，样式与菜单行一致，支持键盘操作。</template
              >
              <template v-else>仅 `#footer` 插槽；外层仍绑定点击以演示 toggle。</template>
            </p>
            <div class="sidebar-play__footer-row">
              <span class="sidebar-play__footer-label">折叠状态</span>
              <el-switch v-model="collapsed" active-text="已折叠" inactive-text="展开" />
            </div>
            <div class="sidebar-play__actions">
              <el-button size="small" type="primary" @click="sidebarRef?.toggle()"
                >toggle</el-button
              >
              <el-button size="small" @click="sidebarRef?.collapse()">collapse</el-button>
              <el-button size="small" @click="sidebarRef?.expand()">expand</el-button>
            </div>
          </div>
        </section>

        <section class="sidebar-play__section">
          <h4 class="sidebar-play__section-title">尺寸</h4>
          <div class="sidebar-play__grid sidebar-play__grid--2">
            <div class="sidebar-play__slider">
              <span>展开宽度</span>
              <el-slider
                v-model="defaultWidth"
                :min="160"
                :max="280"
                :step="4"
                show-input
                input-size="small"
              />
            </div>
            <div class="sidebar-play__slider">
              <span>折叠宽度</span>
              <el-slider
                v-model="foldWidth"
                :min="48"
                :max="80"
                :step="2"
                show-input
                input-size="small"
              />
            </div>
            <div class="sidebar-play__slider">
              <span>一级缩进</span>
              <el-slider
                v-model="indent"
                :min="8"
                :max="32"
                :step="2"
                show-input
                input-size="small"
              />
            </div>
            <div class="sidebar-play__slider">
              <span>项高度</span>
              <el-slider
                v-model="itemHeight"
                :min="36"
                :max="64"
                :step="2"
                show-input
                input-size="small"
              />
            </div>
            <div class="sidebar-play__slider">
              <span>图标宽</span>
              <el-slider
                v-model="iconMaxWidth"
                :min="12"
                :max="32"
                :step="2"
                show-input
                input-size="small"
              />
            </div>
            <div class="sidebar-play__slider">
              <span>图标间距</span>
              <el-slider
                v-model="iconGap"
                :min="4"
                :max="16"
                :step="2"
                show-input
                input-size="small"
              />
            </div>
          </div>
        </section>

        <section class="sidebar-play__section">
          <h4 class="sidebar-play__section-title">菜单颜色</h4>
          <div class="sidebar-play__grid sidebar-play__grid--3">
            <label class="sidebar-play__color">
              <span>背景</span>
              <el-color-picker v-model="menuBgColor" show-alpha size="small" />
            </label>
            <label class="sidebar-play__color">
              <span>文字</span>
              <el-color-picker v-model="menuTextColor" size="small" />
            </label>
            <label class="sidebar-play__color">
              <span>激活字</span>
              <el-color-picker v-model="menuActiveColor" size="small" />
            </label>
            <label class="sidebar-play__color">
              <span>激活底</span>
              <el-color-picker v-model="menuActiveBgColor" show-alpha size="small" />
            </label>
            <label class="sidebar-play__color">
              <span>悬停底</span>
              <el-color-picker v-model="menuHoverBgColor" show-alpha size="small" />
            </label>
            <label class="sidebar-play__color">
              <span>边框</span>
              <el-color-picker v-model="sidebarBorderColor" size="small" />
            </label>
          </div>
        </section>

        <section class="sidebar-play__section">
          <h4 class="sidebar-play__section-title">显隐 expose</h4>
          <div class="sidebar-play__actions">
            <el-button size="small" @click="sidebarRef?.hide()">hide</el-button>
            <el-button size="small" @click="sidebarRef?.show()">show</el-button>
          </div>
        </section>
      </div>
      <p class="sidebar-play__log">
        当前：{{ activeMenu }}　折叠：{{ collapsed ? '是' : '否' }}　底部：{{ footerModeLabel




        }}　select：{{
          lastSelect
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Document, Expand, Fold, House, InfoFilled, Link, Setting, User } from '@element-plus/icons-vue'
import { demoNamespaces } from '../../demo-namespaces'

const sidebarRef = ref()
const collapsed = ref(false)
const visible = ref(true)
const footerMode = ref('default')
const showHeader = ref(true)
const uniqueOpened = ref(false)
const collapseTransition = ref(false)
const defaultOpened = ref(true)
const titleEnabled = ref(true)
const titleTooltipAuto = ref(true)

const showFooter = computed(() => footerMode.value === 'default')

const footerModeLabel = computed(() => {
  const map = { hidden: '无', default: '内置', custom: '自定义' }
  return map[footerMode.value] ?? footerMode.value
})

const titleConfig = computed(() => ({
  enabled: titleEnabled.value,
  model: titleTooltipAuto.value ? 'auto' : 'none',
  lineClamp: 1,
  placement: 'right',
  showAfter: 300
}))
const extraStyle = {
  fontSize: '12px',
  color: 'var(--el-color-info)',
  lineHeight: 1
}
const defaultWidth = ref(184)
const foldWidth = ref(54)
const indent = ref(16)
const iconMaxWidth = ref(16)
const iconGap = ref(8)
const itemHeight = ref(50)
const menuBgColor = ref('#ffffff')
const menuTextColor = ref('#303133')
const menuActiveColor = ref('#409eff')
const menuActiveBgColor = ref('rgba(64, 158, 255, 0.1)')
const menuHoverBgColor = ref('rgba(0, 0, 0, 0.06)')
const sidebarBorderColor = ref('#e4e7ed')
const activeMenu = ref('/home/overview')
const lastSelect = ref('—')

const widthMap = computed(() => ({
  default: defaultWidth.value,
  fold: foldWidth.value,
  hidden: 0
}))

const sidebarColorStyle = computed(() => {
  const y = demoNamespaces.y
  const el = demoNamespaces.el

  return {
    [`--${y}-sidebar-hover`]: menuHoverBgColor.value,
    [`--${y}-sidebar-border`]: sidebarBorderColor.value,
    [`--${el}-menu-bg-color`]: menuBgColor.value,
    [`--${el}-menu-text-color`]: menuTextColor.value,
    [`--${el}-menu-hover-text-color`]: menuTextColor.value,
    [`--${el}-menu-active-color`]: menuActiveColor.value,
    [`--${el}-menu-hover-bg-color`]: menuHoverBgColor.value,
    [`--${el}-menu-border-color`]: sidebarBorderColor.value,
    '--sidebar-play-active-bg': menuActiveBgColor.value
  }
})

const menuProps = computed(() =>
  defaultOpened.value ? { defaultOpeneds: ['/home', '/system', '/system/user'] } : {}
)

const menuList = [
  {
    path: '/home',
    title: '首页',
    icon: House,
    badge: { value: 12, type: 'primary' },
    children: [
      { path: '/home/overview', title: '概览' },
      { path: '/home/detail', title: '详情', extra: 'Hot' }
    ]
  },
  {
    path: '/system',
    title: '系统',
    icon: Setting,
    children: [
      {
        path: '/system/user',
        title: '用户',
        // icon: User,
        children: [
          { path: '/system/user/list', title: '列表' },
          { path: '/system/user/role', title: '角色' }
        ]
      },
      { path: '/system/dict', title: '字典', indent: 64 },
      { path: '/system/log', title: '日志', disabled: true }
    ]
  },
  {
    path: '/docs',
    title: 'Documentation & Release Notes',
    icon: Document
  },
  { path: 'https://element-plus.org', title: '外链', icon: Link, badge: true },
  {
    path: '/about',
    title: '关于',
    icon: InfoFilled,
    extra: 'Beta',
    extraStyle: { color: 'var(--el-color-warning)' },
    badge: { isDot: true, placement: 'left', type: 'warning' }
  }
]

function onSelect(index, item) {
  activeMenu.value = index
  lastSelect.value = `${index}${item?.title ? `（${item.title}）` : ''}`
}
</script>

<style scoped>
.sidebar-play {
  display: flex;
  flex: 1;
  min-height: 560px;
  overflow: hidden;
  border: 1px solid var(--el-border-color-light);
}

.sidebar-play__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-weight: 600;
  border-bottom: 1px solid var(--el-border-color-light);
}

.sidebar-play__footer-slot {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.sidebar-play__footer-slot-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  margin-inline-end: 8px;
}

.sidebar-play__footer-slot-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-play__main {
  flex: 1;
  min-width: 0;
  padding: 16px;
  overflow: auto;
}

.sidebar-play__controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-play__section-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}

.sidebar-play__footer-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--el-fill-color-lighter);
  border-radius: var(--el-border-radius-base);
}

.sidebar-play__footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sidebar-play__footer-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.sidebar-play__hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}

.sidebar-play__grid {
  display: grid;
  gap: 8px 12px;
}

.sidebar-play__grid--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sidebar-play__grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.sidebar-play__grid--4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.sidebar-play__inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
}

.sidebar-play__slider {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.sidebar-play__slider :deep(.el-slider) {
  width: 100%;
}

.sidebar-play__color {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
}

.sidebar-play__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sidebar-play__log {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.sidebar-play__sidebar {
  flex-shrink: 0;
  align-self: stretch;
  min-height: 0;
}

.sidebar-play__sidebar :deep(.ep-menu-item.is-active) {
  background-color: var(--sidebar-play-active-bg) !important;
}
</style>
