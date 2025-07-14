<template>
  <div>
    <h3>基础用法（options 属性）</h3>
    <y-simple-select v-model="value1" :options="options" placeholder="请选择" />
    <p>选中值: {{ value1 }}</p>

    <h3>选项分组（optionGroups 属性）</h3>
    <y-simple-select v-model="value2" :option-groups="optionGroups" placeholder="请选择城市" />
    <p>选中值: {{ value2 }}</p>

    <h3>插槽用法（完全兼容 el-select）</h3>
    <y-simple-select v-model="value3" placeholder="请选择">
      <el-option label="插槽选项1" value="slot1" />
      <el-option label="插槽选项2" value="slot2" />
      <el-option label="插槽选项3" value="slot3" />
    </y-simple-select>
    <p>选中值: {{ value3 }}</p>

    <h3>插槽分组（完全兼容 el-option-group）</h3>
    <y-simple-select v-model="value4" placeholder="请选择城市">
      <el-option-group label="热门城市">
        <el-option label="北京" value="beijing" />
        <el-option label="上海" value="shanghai" />
        <el-option label="广州" value="guangzhou" />
      </el-option-group>
      <el-option-group label="其他城市">
        <el-option label="深圳" value="shenzhen" />
        <el-option label="杭州" value="hangzhou" />
        <el-option label="南京" value="nanjing" />
      </el-option-group>
    </y-simple-select>
    <p>选中值: {{ value4 }}</p>

    <h3>混合使用（插槽优先）</h3>
    <y-simple-select v-model="value5" :options="options" placeholder="请选择">
      <el-option label="自定义选项" value="custom" />
    </y-simple-select>
    <p>选中值: {{ value5 }}</p>

    <h3>方法调用</h3>
    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
      <y-simple-select ref="selectRef" v-model="value6" :options="options" placeholder="请选择" />
      <el-button @click="handleFocus" size="small">聚焦</el-button>
      <el-button @click="handleBlur" size="small">失焦</el-button>
    </div>
    <p>选中值: {{ value6 }}</p>
    <p>选中标签: {{ selectedLabel }}</p>

    <h3>多选</h3>
    <y-simple-select v-model="value7" :options="options" multiple placeholder="请选择多个" />
    <p>选中值: {{ value7 }}</p>

    <h3>可清空</h3>
    <y-simple-select v-model="value8" :options="options" clearable placeholder="请选择" />
    <p>选中值: {{ value8 }}</p>

    <h3>禁用选项</h3>
    <y-simple-select v-model="value9" :options="optionsWithDisabled" placeholder="请选择" />
    <p>选中值: {{ value9 }}</p>

    <h3>不同尺寸</h3>
    <div style="display: flex; gap: 10px; align-items: center;">
      <y-simple-select v-model="value10" :options="options" size="large" placeholder="大尺寸" />
      <y-simple-select v-model="value11" :options="options" placeholder="默认尺寸" />
      <y-simple-select v-model="value12" :options="options" size="small" placeholder="小尺寸" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const value1 = ref('');
const value2 = ref('');
const value3 = ref('');
const value4 = ref('');
const value5 = ref('');
const value6 = ref('');
const value7 = ref([]);
const value8 = ref('');
const value9 = ref('');
const value10 = ref('');
const value11 = ref('');
const value12 = ref('');

const selectRef = ref();

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' },
  { label: '选项5', value: '5' }
];

const optionGroups = [
  {
    label: '热门城市',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '广州', value: 'guangzhou' }
    ]
  },
  {
    label: '其他城市',
    options: [
      { label: '深圳', value: 'shenzhen' },
      { label: '杭州', value: 'hangzhou' },
      { label: '南京', value: 'nanjing' }
    ]
  }
];

const optionsWithDisabled = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2', disabled: true },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4', disabled: true },
  { label: '选项5', value: '5' }
];

const selectedLabel = computed(() => {
  return selectRef.value?.getSelectedLabel?.() || '';
});

const handleFocus = () => {
  selectRef.value?.focus();
};

const handleBlur = () => {
  selectRef.value?.blur();
};
</script>
