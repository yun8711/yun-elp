<template>
  <!-- 如果没有子菜单，则渲染普通的菜单项 -->
  <el-menu-item v-if="!item.children.length" :index="item.index" :disabled="item.disabled">
    {{ item.label }}
  </el-menu-item>

  <!-- 如果有子菜单，则渲染子菜单 -->
  <el-sub-menu v-else :index="item.index" aria-hidden="false">
    <template #title>{{ item.label }}</template>
    <!-- 递归渲染子菜单项 -->
    <template v-for="child in item.children" :key="child.index">
      <MenuItem :item="child" />
    </template>
  </el-sub-menu>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: {}
  }
});
</script>
