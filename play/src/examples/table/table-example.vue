<template>
  <div class="table-example">
    <y-table
      :data="tableData"
      :loading="loading"
      :pagination-props="paginationProps"
      @pagination-change="onPaginationChange"
    >
      <!-- 基础文本 -->
      <y-column-text prop="name" label="姓名" />

      <!-- 链接态与点击事件 -->
      <y-column-text prop="name" label="可点击" :link="true" @click="onRowClick" />

      <!-- 自定义格式化显示 -->
      <y-column-text prop="age" label="年龄(格式化)" :formatter="formatAge" />

      <!-- 文本样式 -->
      <y-column-text
        prop="address"
        label="自定义文本样式"
        :text-style="{ color: 'red', fontSize: '16px', fontWeight: '600' }"
      />

      <!-- 溢出 Tooltip 与禁用 -->
      <y-column-text prop="desc" label="tooltip(默认)" />
      <y-column-text prop="desc" label="无tooltip" no-tip />

      <!-- 自定义插槽 -->
      <y-column-text prop="status">
        <template #default="{ value }">
          <el-tag :type="value === 'active' ? 'success' : 'warning'">{{ value }}</el-tag>
        </template>
      </y-column-text>

      <!-- 配合y-text-tooltip自定义tooltip，注意要禁用column本身的tooltip -->
      <y-column-text prop="desc" label="自定义tooltip" no-tip>
        <template #default="{ value }">
          <y-text-tooltip :lineClamp="2" placement="top-end">
            {{ value }}
          </y-text-tooltip>
        </template>
      </y-column-text>
    </y-table>

    <div class="table-example__pagination-info">
      当前第 {{ currentPage }} 页，每页 {{ pageSize }} 条，本页 {{ tableData.length }} 条，共
      {{ total }} 条
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';

type TableRow = {
  name: string;
  age: number;
  address: string;
  desc: string;
  status: 'active' | 'inactive';
};

const cities = ['杭州市拱墅区', '苏州市吴中区', '上海市浦东新区', '北京市朝阳区', '深圳市南山区'];
const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];

const sourceData: TableRow[] = Array.from({ length: 35 }, (_, index) => ({
  name: names[index % names.length] + (index + 1),
  age: 22 + (index % 15),
  address: cities[index % cities.length],
  desc:
    index % 3 === 0
      ? '这是一段较长的描述文本，用于演示溢出提示与分页切换后的数据刷新'
      : '短文案',
  status: index % 2 === 0 ? 'active' : 'inactive'
}));

const total = sourceData.length;
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false);
const tableData = ref<TableRow[]>([]);

const paginationProps = computed(() => ({
  total,
  currentPage: currentPage.value,
  pageSize: pageSize.value
}));

const fetchTableData = () => {
  loading.value = true;
  window.setTimeout(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    tableData.value = sourceData.slice(start, start + pageSize.value);
    loading.value = false;
  }, 300);
};

const onPaginationChange = ({
  currentPage: page,
  pageSize: size
}: {
  currentPage: number;
  pageSize: number;
}) => {
  currentPage.value = page;
  pageSize.value = size;
  fetchTableData();
};

const onRowClick = (row: TableRow) => {
  ElMessage.success(`点击了：${row.name}`);
};

const formatAge = (value: number) => `${value} 岁`;

onMounted(() => {
  fetchTableData();
});
</script>

<style scoped>
.table-example {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.table-example__pagination-info {
  font-size: 13px;
  color: var(--ep-text-color-regular);
}
</style>
