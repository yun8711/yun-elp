<template>
  <div class="part-title-example">
    <h2>Part Title 分区标题</h2>

    <div class="example-section">
      <h3>基础用法</h3>
      <y-part-title title="基础用法" />
    </div>

    <div class="example-section">
      <h3>插槽</h3>
      <y-part-title title="插槽">
        <template #extra>
          <el-tag size="small">额外</el-tag>
        </template>
        <template #right>
          <el-button size="small" type="primary">操作</el-button>
        </template>
      </y-part-title>
    </div>

    <div class="example-section">
      <h3>样式配置</h3>
      <y-part-title
        title="样式配置"
        :text-style="{ color: '#365edf', fontSize: '16px', fontWeight: 600 }"
        :bar-style="{ backgroundColor: '#365edf', width: '3px', height: '14px' }"
        :gap="12"
        :extra-gap="8"
      >
        <template #extra>额外</template>
      </y-part-title>
    </div>
  </div>
</template>

<style scoped>
.part-title-example {
  max-width: 960px;
}

.example-section {
  padding: 20px;
  margin-bottom: 24px;
  background: var(--ep-bg-color);
  border: 1px solid var(--ep-border-color-light);
  border-radius: 8px;
}

.example-section h3 {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
}
</style>
