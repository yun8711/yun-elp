<template>
  <div style="width: 300px; border: 1px solid #ccc">
    <el-switch v-model="isCollapse" active-text="展开" inactive-text="收起" />
    <y-menu :data="menuData" :collapse="isCollapse">
      <!-- 全局图标插槽 -->
      <template #icon="{ item, level }">
        <el-icon v-if="item.icon" class="y-menu-item__icon">
          <component :is="item.icon" />
        </el-icon>
      </template>

      <!-- 特定菜单项的标签插槽 -->
      <template #label-1="{ item }">
        <span style="color: #409eff; font-weight: bold">{{ item.label }}</span>
        <el-tag size="small" style="margin-left: 5px">New</el-tag>
      </template>

      <!-- 特定菜单项的图标插槽 -->
      <template #icon-2="{ item }">
        <el-icon style="color: #f56c6c">
          <component :is="item.icon" />
        </el-icon>
      </template>
    </y-menu>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Menu as MenuIcon, Setting, User } from '@element-plus/icons-vue';

const isCollapse = ref(false);

const menuData = [
  {
    index: '1',
    label: '自定义标签菜单',
    icon: Setting
  },
  {
    index: '2',
    label: '自定义图标菜单',
    icon: MenuIcon,
    children: [
      {
        index: '2-1',
        label: '子菜单2-1',
        icon: User
      }
    ]
  }
];
</script>
