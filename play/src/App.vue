<template>
  <div class="app-container">
    <header>
      <h1>KD-ELP 组件演示</h1>
    </header>

    <main>
      <section class="component-demo">
        <h2>按钮组件</h2>
        <div class="demo-block">
          <div class="demo-content">
            <k-button>默认按钮</k-button>
            <k-button type="primary">主要按钮</k-button>
            <k-button type="success">成功按钮</k-button>
            <k-button type="warning">警告按钮</k-button>
            <k-button type="danger">危险按钮</k-button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// 组件演示代码
</script>

<style lang="scss" scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  header {
    margin-bottom: 40px;

    h1 {
      font-size: 28px;
      color: #303133;
    }
  }

  .component-demo {
    margin-bottom: 40px;

    h2 {
      font-size: 22px;
      margin-bottom: 20px;
      color: #303133;
    }

    .demo-block {
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      .demo-content {
        padding: 24px;

        .k-button {
          margin-right: 12px;
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style> 