<template>
  <div class="demo-container">
    <div class="scroll-container">
      <y-sticky-layout>
        <template #left="{ height }">
          <div class="sidebar">
            <h3>左侧边栏</h3>
            <p>高度: {{ height }}px</p>
            <div class="sidebar-content">
              <p>这是左侧边栏内容</p>
              <p>会随着页面滚动而吸顶</p>
              <ul>
                <li>菜单项 1</li>
                <li>菜单项 2</li>
                <li>菜单项 3</li>
              </ul>
            </div>
          </div>
        </template>

        <template #default>
          <div class="main-content">
            <h2>主要内容区域</h2>
            <p>这是主要内容区域，会根据左侧边栏的宽度自动调整padding。</p>

            <div class="content-section">
              <h3>内容区块 1</h3>
              <p>这里是一些示例内容。左侧边栏会保持在视窗中，当页面滚动时会自动吸顶。</p>
              <div class="placeholder">内容占位符</div>
            </div>

            <div class="content-section">
              <h3>内容区块 2</h3>
              <p>继续滚动可以看到左侧边栏的吸顶效果。</p>
              <div class="placeholder">内容占位符</div>
            </div>

            <div class="content-section">
              <h3>内容区块 3</h3>
              <p>更多的内容来测试滚动效果。</p>
              <div class="placeholder">内容占位符</div>
            </div>
          </div>
        </template>

        <template #right="{ height }">
          <div class="sidebar right-sidebar">
            <h3>右侧边栏</h3>
            <p>高度: {{ height }}px</p>
            <div class="sidebar-content">
              <p>这是右侧边栏内容</p>
              <p>同样会吸顶显示</p>
              <div class="ad-placeholder">广告位<br />300x250</div>
            </div>
          </div>
        </template>
      </y-sticky-layout>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.demo-container {
  height: 600px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.scroll-container {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.sidebar {
  width: 200px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.right-sidebar {
  width: 150px;
}

.sidebar h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.sidebar p {
  margin: 4px 0;
  font-size: 12px;
  color: #909399;
}

.sidebar-content {
  margin-top: 12px;
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-content li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #606266;
  font-size: 14px;
}

.sidebar-content li:last-child {
  border-bottom: none;
}

.main-content {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 24px;
  min-height: 800px;
}

.main-content h2 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 20px;
}

.main-content p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}

.content-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #fafafa;
  border-radius: 6px;
}

.content-section h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.placeholder {
  height: 100px;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.ad-placeholder {
  height: 120px;
  background: linear-gradient(45deg, #e8f5e8, #c8e6c9);
  border: 2px dashed #4caf50;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2e7d32;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  line-height: 1.4;
}
</style>
