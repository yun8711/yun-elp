<template>
  <div class="demo-wrapper">
    <h3>自定义滚动容器示例</h3>
    <p>当组件在嵌套的滚动容器中使用时，可以通过 scrollContainer 属性指定滚动容器。</p>

    <div class="custom-scroll-container" ref="scrollContainerRef">
      <y-sticky-layout :scroll-container="scrollContainerRef">
        <template #left="{ height }">
          <div class="sidebar">
            <h4>导航菜单</h4>
            <p>当前高度: {{ height }}px</p>
            <nav>
              <a href="#section1">章节1</a>
              <a href="#section2">章节2</a>
              <a href="#section3">章节3</a>
            </nav>
          </div>
        </template>

        <template #default>
          <div class="content">
            <section id="section1">
              <h4>章节1：组件介绍</h4>
              <p>StickyLayout 组件提供了灵活的侧边栏布局解决方案。</p>
              <div class="content-block">内容块 1</div>
            </section>

            <section id="section2">
              <h4>章节2：使用方法</h4>
              <p>通过插槽系统可以轻松定制左侧、右侧边栏和主要内容区域。</p>
              <div class="content-block">内容块 2</div>
            </section>

            <section id="section3">
              <h4>章节3：高级用法</h4>
              <p>支持自定义滚动容器，适应复杂的页面结构。</p>
              <div class="content-block">内容块 3</div>
            </section>

            <section id="section4">
              <h4>章节4：最佳实践</h4>
              <p>合理使用可以提升用户体验和页面性能。</p>
              <div class="content-block">内容块 4</div>
            </section>
          </div>
        </template>

        <template #right="{ height }">
          <div class="sidebar right-sidebar">
            <h4>目录</h4>
            <p>高度: {{ height }}px</p>
            <ul>
              <li><a href="#section1">组件介绍</a></li>
              <li><a href="#section2">使用方法</a></li>
              <li><a href="#section3">高级用法</a></li>
              <li><a href="#section4">最佳实践</a></li>
            </ul>
          </div>
        </template>
      </y-sticky-layout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const scrollContainerRef = ref<HTMLElement>();
</script>

<style scoped>
.demo-wrapper {
  margin: 20px 0;
}

.demo-wrapper h3 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 18px;
}

.demo-wrapper > p {
  color: #606266;
  margin-bottom: 16px;
  line-height: 1.6;
}

.custom-scroll-container {
  height: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
}

.sidebar {
  width: 180px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.right-sidebar {
  width: 140px;
}

.sidebar h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #303133;
}

.sidebar p {
  margin: 4px 0 12px 0;
  font-size: 11px;
  color: #909399;
}

.sidebar nav,
.sidebar ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar a,
.sidebar li a {
  display: block;
  padding: 6px 0;
  color: #606266;
  text-decoration: none;
  font-size: 13px;
  border-bottom: 1px solid #f0f0f0;
  transition: color 0.2s;
}

.sidebar a:hover,
.sidebar li a:hover {
  color: #409eff;
}

.sidebar a:last-child,
.sidebar li a:last-child {
  border-bottom: none;
}

.content {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 20px;
  min-height: 600px;
}

.content section {
  margin-bottom: 32px;
}

.content section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.content section p {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}

.content-block {
  height: 80px;
  background: linear-gradient(45deg, #f0f9ff, #e0f2fe);
  border: 1px solid #b3e5fc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0277bd;
  font-size: 14px;
  font-weight: 500;
}
</style>
