<template>
  <div class="desc-example">
    <h2>Desc 描述列表</h2>

    <div class="example-section">
      <h3>基础用法与长文本 tooltip</h3>
      <p class="section-desc">
        默认集成 y-text-tooltip，内容超出时自动省略并显示 tooltip。地址类长文本可悬停验证。
      </p>
      <y-desc :data="data" :config="basicConfig" />
    </div>

    <div class="example-section">
      <h3>带边框</h3>
      <p class="section-desc">设置 border 属性展示边框样式。</p>
      <y-desc :data="data" :config="basicConfig" border />
    </div>

    <div class="example-section">
      <h3>tooltip 控制</h3>
      <p class="section-desc">
        全局 noTooltip 关闭所有 tooltip；单项 noTooltip 可单独关闭；textTooltip 可透传行数、model
        等配置。
      </p>
      <div class="controls">
        <el-switch v-model="globalNoTooltip" active-text="全局禁用 tooltip" />
      </div>
      <y-desc
        :data="data"
        :config="tooltipConfig"
        :no-tooltip="globalNoTooltip"
        border
        style="margin-top: 12px"
      />
    </div>

    <div class="example-section">
      <h3>响应式列数</h3>
      <p class="section-desc">
        column 支持函数，根据组件宽度动态调整列数。拖动滑块观察布局与 tooltip 行为。
      </p>
      <div :style="{ width: `${containerWidth}%` }">
        <y-desc :data="data" :config="columnConfig" :column="responsiveColumn" border />
        <p class="hint">当前容器宽度约 {{ innerWidth }}px，列数 {{ currentColumn }}</p>
      </div>
      <el-slider
        v-model="containerWidth"
        :min="30"
        :max="100"
        style="max-width: 400px; margin-top: 12px"
      />
    </div>

    <div class="example-section">
      <h3>插槽用法</h3>
      <p class="section-desc">具名插槽与默认插槽混用；有 prop 时优先使用具名插槽。</p>
      <y-desc :data="data" :config="slotConfig" border>
        <template #age-content="{ content }">
          <el-tag type="success">{{ content }} 岁</el-tag>
        </template>
        <template #label="{ item }">
          <span class="slot-label">{{ item.label }}</span>
        </template>
        <template #content="{ item, content }">
          <span class="slot-content">{{ content }}</span>
        </template>
      </y-desc>
    </div>

    <div class="example-section">
      <h3>浮层内展示</h3>
      <p class="section-desc">
        在 Popover 内使用 desc，验证 text-tooltip 在浮层场景下 tooltip
        不被裁剪、布局就绪后正确溢出检测。
      </p>
      <el-popover placement="bottom" :width="480" trigger="click">
        <template #reference>
          <el-button type="primary">Popover 内 Desc</el-button>
        </template>
        <y-desc :data="data" :config="popoverConfig" :column="1" border />
      </el-popover>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const longAddress =
  '北京市海淀区中关村大街1号院科技大厦A座18层，靠近地铁4号线中关村站，周边配套齐全，适合办公与研发。';

const data = ref({
  name: '张三',
  age: 28,
  email: 'zhangsan@example.com',
  phone: '13800138000',
  department: '技术研发部',
  position: '前端工程师',
  remark: longAddress,
  addresses: [
    { address: longAddress, phone: '13800138000' },
    { address: '上海市浦东新区张江高科技园区', phone: '13800138001' }
  ]
});

const basicConfig = [
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '电话', path: 'phone' },
  { label: '部门', path: 'department' },
  { label: '职位', path: 'position' },
  { label: '备注', path: 'remark' },
  { label: '地址1', path: 'addresses[0].address' },
  { label: '地址2', path: 'addresses[1].address' }
];

const globalNoTooltip = ref(false);

const tooltipConfig = [
  { label: '姓名', path: 'name' },
  {
    label: '备注（多行省略）',
    path: 'remark',
    textTooltip: { lineClamp: 2, model: 'auto' }
  },
  {
    label: '地址（禁用 tooltip）',
    path: 'addresses[0].address',
    noTooltip: true
  },
  {
    label: '地址2（默认 tooltip）',
    path: 'addresses[1].address'
  }
];

const containerWidth = ref(70);
const innerWidth = ref(0);

const responsiveColumn = (width: number) => {
  innerWidth.value = width;
  if (width < 500) return 1;
  if (width < 800) return 2;
  return 3;
};

const currentColumn = computed(() => responsiveColumn(innerWidth.value));

const columnConfig = [
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '部门', path: 'department', span: 'column' as const },
  { label: '职位', path: 'position' },
  { label: '地址', path: 'addresses[0].address' }
];

const slotConfig = [
  { label: '姓名', path: 'name' },
  { label: '年龄', path: 'age', prop: 'age' },
  { label: '邮箱', path: 'email' },
  { label: '备注', path: 'remark' }
];

const popoverConfig = [
  { label: '姓名', path: 'name' },
  { label: '部门', path: 'department' },
  { label: '备注', path: 'remark' },
  { label: '地址', path: 'addresses[0].address' }
];
</script>

<style scoped>
.desc-example {
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
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.section-desc {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--ep-text-color-secondary);
}

.controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--ep-text-color-secondary);
}

.slot-label {
  font-weight: 500;
  color: var(--ep-color-primary);
}

.slot-content {
  color: var(--ep-text-color-regular);
}
</style>
