<template>
  <Layout #default="{ locale }">
    <y-app-wrap :key="locale" :elp-config="{ locale: locale === 'zh-cn' ? zhCn : en }" :locale="locale"
      v-bind="appWrapConfig">

      <div class="demo-container">
        <h2>Scroll Box 组件示例</h2>

        <!-- 基础水平滚动 -->
        <div class="demo-block">
          <h3>1. 基础水平滚动（自动显示箭头）</h3>
          <y-scroll-box width="400px" height="120px" arrow-model="auto" @scroll="handleScroll">
            <div class="scroll-content">
              <div class="item" v-for="i in 20" :key="i">项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <p class="tip">提示：当内容超出容器宽度时，箭头会自动显示；滚动到边界时箭头会变为禁用状态（半透明），避免误操作</p>
          <p class="scroll-info">滚动位置：{{ scrollInfo }}</p>
        </div>

        <!-- 内容较少不显示箭头 -->
        <div class="demo-block">
          <h3>2. 内容较少不显示箭头</h3>
          <y-scroll-box width="400px" height="120px" arrow-model="auto">
            <div class="scroll-content">
              <div class="item" v-for="i in 3" :key="i">项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <p class="tip">提示：当内容没有超出容器宽度时，箭头不会显示</p>
        </div>

        <!-- 始终显示箭头 -->
        <div class="demo-block">
          <h3>3. 始终显示箭头（带禁用状态）</h3>
          <y-scroll-box width="400px" height="120px" arrow-model="always">
            <div class="scroll-content">
              <div class="item" v-for="i in 15" :key="i">项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <p class="tip">提示：箭头始终显示，当无法滚动时箭头会变为禁用状态</p>
        </div>

        <!-- 连续滚动 -->
        <div class="demo-block">
          <h3>4. 连续滚动（按住箭头持续滚动）</h3>
          <y-scroll-box
            width="400px"
            height="120px"
            arrow-model="always"
            :continuous="true"
            :continuous-step="100"
            :step="50"
          >
            <div class="scroll-content">
              <div class="item" v-for="i in 25" :key="i">连续滚动项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <p class="tip">提示：按住箭头按钮可以持续滚动</p>
        </div>

        <!-- 鼠标滚轮水平滚动 -->
        <div class="demo-block">
          <h3>5. 鼠标滚轮水平滚动</h3>
          <y-scroll-box
            width="400px"
            height="120px"
            arrow-model="auto"
            :wheel-scroll="true"
          >
            <div class="scroll-content">
              <div class="item" v-for="i in 20" :key="i">滚轮项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <p class="tip">提示：在此区域使用鼠标滚轮可以水平滚动</p>
        </div>

        <!-- 自定义箭头样式 -->
        <div class="demo-block">
          <h3>6. 自定义箭头样式</h3>
          <y-scroll-box
            width="400px"
            height="120px"
            arrow-model="always"
            :arrow-style="customArrowStyle"
          >
            <div class="scroll-content">
              <div class="item" v-for="i in 18" :key="i">自定义样式项目 {{ i }}</div>
            </div>
          </y-scroll-box>
        </div>

        <!-- 暴露方法演示 -->
        <div class="demo-block">
          <h3>7. 暴露方法演示</h3>
          <y-scroll-box
            ref="scrollBoxRef"
            width="400px"
            height="120px"
            arrow-model="always"
          >
            <div class="scroll-content">
              <div class="item" v-for="i in 20" :key="i">方法演示项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <div class="control-buttons">
            <el-button size="small" @click="scrollToStart">滚动到开始</el-button>
            <el-button size="small" @click="scrollToEnd">滚动到结束</el-button>
            <el-button size="small" @click="scrollToMiddle">滚动到中间</el-button>
          </div>
        </div>

        <!-- 平滑滚动演示（优化版） -->
        <div class="demo-block">
          <h3>8. 原生滚动演示</h3>
          <y-scroll-box
            ref="smoothScrollBoxRef"
            width="400px"
            height="120px"
            arrow-model="always"
            :wheel-scroll="true"
          >
            <div class="scroll-content">
              <div class="item" v-for="i in 20" :key="i">原生滚动项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <div class="control-buttons">
            <el-button size="small" @click="scrollToStart">滚动到开始</el-button>
            <el-button size="small" @click="scrollToEnd">滚动到结束</el-button>
            <el-button size="small" @click="scrollToMiddle">滚动到中间</el-button>
          </div>
          <p class="tip">提示：使用原生滚动方法，响应快速，无顿挫感</p>
        </div>

        <!-- 滚动模式对比 -->
        <div class="demo-block">
          <h3>9. 滚动模式对比</h3>
          <div class="scroll-comparison">
            <div class="scroll-mode">
              <h4>原生滚动</h4>
              <y-scroll-box
                width="300px"
                height="100px"
                arrow-model="always"
                :wheel-scroll="true"
              >
                <div class="scroll-content">
                  <div class="item" v-for="i in 15" :key="i">原生项目 {{ i }}</div>
                </div>
              </y-scroll-box>
            </div>
            <div class="scroll-mode">
              <h4>连续滚动</h4>
              <y-scroll-box
                width="300px"
                height="100px"
                arrow-model="always"
                :continuous="true"
                :wheel-scroll="true"
              >
                <div class="scroll-content">
                  <div class="item" v-for="i in 15" :key="i">连续项目 {{ i }}</div>
                </div>
              </y-scroll-box>
            </div>
          </div>
          <p class="tip">提示：对比两种滚动模式，原生滚动响应最快，连续滚动适合长距离滚动</p>
        </div>

        <!-- 节流配置演示 -->
        <div class="demo-block">
          <h3>10. 节流配置演示</h3>
          <y-scroll-box
            ref="throttleScrollBoxRef"
            width="400px"
            height="120px"
            arrow-model="always"
            :wheel-scroll="true"
            :throttle-delay="50"
            @scroll="handleThrottleScroll"
          >
            <div class="scroll-content">
              <div class="item" v-for="i in 20" :key="i">节流配置项目 {{ i }}</div>
            </div>
          </y-scroll-box>
          <div class="control-buttons">
            <el-button size="small" @click="changeThrottleDelay(16)">快速节流(16ms)</el-button>
            <el-button size="small" @click="changeThrottleDelay(50)">中等节流(50ms)</el-button>
            <el-button size="small" @click="changeThrottleDelay(100)">慢速节流(100ms)</el-button>
          </div>
          <p class="tip">提示：不同的节流延迟会影响滚动的响应速度，数值越小响应越快</p>
          <p class="scroll-info">节流滚动位置：{{ throttleScrollInfo }}</p>
        </div>

        <!-- 图片滚动 -->
        <div class="demo-block">
          <h3>11. 图片滚动展示</h3>
          <y-scroll-box width="500px" height="150px" arrow-model="auto">
            <div class="scroll-content">
              <div class="image-item" v-for="i in 8" :key="i">
                <div class="image-placeholder">图片 {{ i }}</div>
              </div>
            </div>
          </y-scroll-box>
        </div>

        <!-- 卡片滚动 -->
        <div class="demo-block">
          <h3>12. 卡片滚动</h3>
          <y-scroll-box width="600px" height="180px" arrow-model="auto">
            <div class="scroll-content">
              <div class="card" v-for="i in 10" :key="i">
                <h4>卡片 {{ i }}</h4>
                <p>这是卡片 {{ i }} 的内容描述</p>
                <el-button size="small" type="primary">查看详情</el-button>
              </div>
            </div>
          </y-scroll-box>
        </div>

        <!-- 小尺寸示例 -->
        <div class="demo-block">
          <h3>13. 小尺寸示例</h3>
          <y-scroll-box width="300px" height="80px" arrow-model="always">
            <div class="scroll-content">
              <div class="small-item" v-for="i in 12" :key="i">小项目 {{ i }}</div>
            </div>
          </y-scroll-box>
        </div>

      </div>

    </y-app-wrap>
  </Layout>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import Layout from './components/Layout.vue'
import { User, InfoFilled } from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { treeData } from './test-data'

const appWrapConfig = {
  dialog: {
    titleStyle: {
      color: 'red'
    },
    closeOnClickModal: true
  }
}

// 自定义箭头样式
const customArrowStyle = {
  backgroundColor: '#409eff',
  color: 'white',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
}

// 滚动信息
const scrollInfo = ref('0, 0')
const throttleScrollInfo = ref('0, 0')
const scrollBoxRef = ref()
const smoothScrollBoxRef = ref()
const throttleScrollBoxRef = ref()

// 处理滚动事件
const handleScroll = (scrollLeft) => {
  console.log('handleScroll', scrollLeft)
  scrollInfo.value = `${scrollLeft}`
}

// 滚动到开始位置
const scrollToStart = () => {
  if (scrollBoxRef.value) {
    scrollBoxRef.value.scrollToStart()
  }
}

// 滚动到结束位置
const scrollToEnd = () => {
  if (scrollBoxRef.value) {
    scrollBoxRef.value.scrollToEnd()
  }
}

// 滚动到中间位置
const scrollToMiddle = () => {
  if (scrollBoxRef.value && scrollBoxRef.value.scrollbarRef?.wrapRef) {
    const { scrollWidth, clientWidth } = scrollBoxRef.value.scrollbarRef.wrapRef
    const middlePosition = (scrollWidth - clientWidth) / 2
    scrollBoxRef.value.scrollTo(middlePosition)
  }
}

// 处理节流滚动事件
const handleThrottleScroll = (scrollTop, scrollLeft) => {
  throttleScrollInfo.value = `${scrollTop}, ${scrollLeft}`
}

// 改变节流延迟
const changeThrottleDelay = (delay) => {
  if (throttleScrollBoxRef.value) {
    // 注意：这里需要重新创建组件实例来应用新的节流配置
    // 在实际使用中，可以通过响应式数据来控制
    console.log(`节流延迟已设置为 ${delay}ms`)
  }
}

// 原生滚动方法（示例8专用）
const nativeScrollToStart = () => {
  if (smoothScrollBoxRef.value) {
    smoothScrollBoxRef.value.scrollToStart()
  }
}

const nativeScrollToEnd = () => {
  if (smoothScrollBoxRef.value) {
    smoothScrollBoxRef.value.scrollToEnd()
  }
}

const nativeScrollToMiddle = () => {
  if (smoothScrollBoxRef.value && smoothScrollBoxRef.value.scrollbarRef?.wrapRef) {
    const { scrollWidth, clientWidth } = smoothScrollBoxRef.value.scrollbarRef.wrapRef
    const middlePosition = (scrollWidth - clientWidth) / 2
    smoothScrollBoxRef.value.scrollTo(middlePosition)
  }
}

</script>

<style lang="scss" scoped>
.demo-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    margin-bottom: 32px;
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    text-align: center;
  }
}

.demo-block {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background: var(--el-bg-color);

  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .tip {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  .scroll-info {
    margin-top: 8px;
    font-size: 12px;
    color: var(--el-color-primary);
    font-weight: 500;
  }

  .control-buttons {
    margin-top: 12px;
    display: flex;
    gap: 8px;
  }

  .scroll-comparison {
    display: flex;
    gap: 20px;
    margin-top: 16px;

    .scroll-mode {
      flex: 1;

      h4 {
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        text-align: center;
      }
    }
  }
}

.scroll-content {
  display: flex;
  gap: 12px;
  padding: 8px;
}

.item {
  flex-shrink: 0;
  padding: 12px 20px;
  background: var(--el-color-primary-light-9);
  border: 1px solid var(--el-color-primary-light-7);
  border-radius: 6px;
  color: var(--el-color-primary);
  font-weight: 500;
  white-space: nowrap;
}

.small-item {
  flex-shrink: 0;
  padding: 8px 16px;
  background: var(--el-color-success-light-9);
  border: 1px solid var(--el-color-success-light-7);
  border-radius: 4px;
  color: var(--el-color-success);
  font-weight: 500;
  white-space: nowrap;
  font-size: 12px;
}

.image-item {
  flex-shrink: 0;
  width: 120px;
  height: 120px;

  .image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--el-color-primary-light-8), var(--el-color-primary-light-6));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 500;
    font-size: 14px;
  }
}

.card {
  flex-shrink: 0;
  width: 200px;
  padding: 16px;
  background: white;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: var(--el-text-color-regular);
    line-height: 1.4;
  }
}
</style>
