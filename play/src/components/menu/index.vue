<template>
  <div>
    <h4>各种形式的图标</h4>
    <!-- <div class="i-icon:card size-16"></div> -->
    <!-- <i class="i-icon:android size-16"></i> -->
    <el-switch v-model="isCollapse" />
    <div style="width: 300px; border: 1px solid #ccc">
      <y-menu :collapse="isCollapse" :data="menuData0" />
    </div>

    <h4>数字缩进（所有层级相同）</h4>
    <y-menu
      :data="menuData"
      :indent="[10, 30, 0, 40]"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    />

    <h4>数组缩进（各层级不同）</h4>
    <y-menu :data="menuData" :indent="[30, 0, 30, 20]" :collapse="isCollapse" />

    <h4>使用插槽自定义菜单项内容</h4>
    <y-menu :data="menuData0" :indent="20" :collapse="isCollapse">
      <!-- 全局图标插槽 -->
      <template #icon="{ item, level }">
        <el-icon v-if="item.icon" class="y-menu-item__icon">
          <component :is="item.icon" />
        </el-icon>
      </template>
      <template #label="{ item }" v-if="!isCollapse">
        <span>{{ item.label }}</span>
      </template>
      <template #label-1="{ item }">
        <span style="color: #409eff; font-weight: bold">{{ item.label }}</span>
        <el-tag size="small" style="margin-left: 5px">New</el-tag>
      </template>
      <template #icon-3="{ item }">
        <el-icon class="y-menu-item__icon" style="color: #f56c6c">
          <Setting />
        </el-icon>
      </template>
    </y-menu>
  </div>
</template>
<script setup>
// 导入图标组件
import { Menu as MenuIcon, Setting, User } from '@element-plus/icons-vue';
import { h, ref } from 'vue';
import testImg from '@/assets/test.png';
import folder from '@/assets/folder.svg';
import baobiao from '@/assets/svg/icon/baobiao.svg';

defineOptions({
  name: 'Menu',
  inheritAttrs: true
});

const isCollapse = ref(false);

// 自定义图标组件函数
const createIcon = iconName => {
  return h('i', { class: iconName });
};

// 创建SVG图标函数（作为img使用）
// 创建图片图标函数
const createImageIcon = (src, alt = 'icon') => {
  return h('img', {
    src,
    alt
  });
};

// 创建 UnoCSS 图标的函数
const createUnoIcon = iconName => {
  return h('i', {
    class: `i-icon:${iconName}`
  });
};

const menuData0 = [
  {
    index: '1',
    label: '图片图标图片',
    icon: () => createImageIcon(testImg, '菜单2图标')
  },
  {
    index: '2',
    label: 'element-plus图标',
    icon: MenuIcon // 组件图标
  },
  {
    index: '3',
    label: '无图标',
    icon: () => createImageIcon(folder, '菜单3图标')
  },
  {
    index: '4',
    label: '无图标',
    icon: () => createUnoIcon('android')
  }
];

const menuData = [
  {
    index: '1',
    label: '菜单1',
    // 使用图片作为图标（函数方式）
    icon: () => createImageIcon(testImg, '菜单2图标')
  },
  {
    index: '2',
    label: '菜单2',
    icon: MenuIcon, // 组件图标
    children: [
      {
        index: '2-1',
        label: '子菜单2-1',
        icon: User // 用户图标组件
      },
      {
        index: '2-2',
        label: '子菜单2-2',
        icon: User, // 用户图标组件
        children: [
          {
            index: '2-2-1',
            label: '子菜单2-2-1'
          },
          {
            index: '2-2-2',
            label: '子菜单2-2-2'
          },
          {
            index: '2-2-3',
            label: '子菜单2-2-3',
            children: [
              {
                index: '2-2-3-1',
                label: '子菜单2-2-3-1'
              },
              {
                index: '2-2-3-2',
                label: '子菜单2-2-3-2'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    index: '3',
    label: '菜单3',
    children: [
      {
        index: '3-1',
        label: '用户管理'
      }
    ]
  }
];

const handleOpen = (key, keyPath) => {
  console.log('open', key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log('close', key, keyPath);
};
</script>
<style scoped>
div {
  padding: 20px;
}

h3 {
  margin: 20px 0 10px 0;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}
</style>
