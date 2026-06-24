<template>
  <div class="form-example">
    <section class="demo-block">
      <h3>布局用法</h3>
      <p class="tip">y-form 整合 el-form + el-row；y-form-item 整合 el-form-item + el-col</p>
      <y-form :model="layoutForm" :rules="layoutRules" label-width="120px" :span="12" :gutter="24">
        <y-form-item label="姓名" prop="name">
          <el-input v-model="layoutForm.name" placeholder="请输入姓名" />
        </y-form-item>
        <y-form-item label="年龄" prop="age">
          <el-input-number v-model="layoutForm.age" :min="0" placeholder="请输入年龄" />
        </y-form-item>
        <y-form-item label="备注" prop="remark" :span="16">
          <el-input v-model="layoutForm.remark" type="textarea" placeholder="请输入备注" />
        </y-form-item>
      </y-form>
    </section>

    <section class="demo-block">
      <h3>config 联动用法</h3>
      <p class="tip">
        表单字段变化时触发 config 回调，用于编写联动逻辑；remark 在 static-fields 中，不参与联动
      </p>
      <y-form
        ref="linkageFormRef"
        :model="linkageForm"
        :rules="linkageRules"
        :config="handleFormChange"
        :static-fields="['remark']"
        label-width="120px"
        :span="12"
        :gutter="24">
        <y-form-item label="采购类型" prop="type">
          <el-select
            v-model="linkageForm.type"
            placeholder="请选择采购类型"
            clearable
            style="width: 100%">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </y-form-item>
        <y-form-item label="大类" prop="category">
          <el-select
            v-model="linkageForm.category"
            placeholder="请选择大类"
            clearable
            style="width: 100%">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </y-form-item>
        <y-form-item label="小类" prop="subCategory">
          <el-select
            v-model="linkageForm.subCategory"
            placeholder="请选择小类"
            clearable
            style="width: 100%">
            <el-option
              v-for="item in subCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </y-form-item>
        <y-form-item label="规格型号" prop="spec">
          <el-select
            v-model="linkageForm.spec"
            placeholder="请选择规格型号"
            clearable
            style="width: 100%">
            <el-option
              v-for="item in specOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </y-form-item>
        <y-form-item label="备注" prop="remark" :span="24">
          <el-input
            v-model="linkageForm.remark"
            type="textarea"
            placeholder="请输入备注（不参与联动）" />
        </y-form-item>
      </y-form>
      <div class="control-buttons">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </section>

    <section class="demo-block">
      <h3>debounce 演示</h3>
      <p class="tip">快速输入时，有防抖则停止输入后才触发 config；无防抖则每次变化都触发</p>
      <y-form
        :model="debounceForm"
        :config="handleDebounceFormChange"
        :debounce="debounceMs"
        label-width="120px"
        :span="12"
        :gutter="24">
        <y-form-item label="防抖时间">
          <el-radio-group v-model="debounceMs">
            <el-radio :value="0">0ms（无防抖）</el-radio>
            <el-radio :value="300">300ms</el-radio>
          </el-radio-group>
        </y-form-item>
        <y-form-item label="关键词" prop="keyword">
          <el-input v-model="debounceForm.keyword" placeholder="快速输入测试防抖" />
        </y-form-item>
        <y-form-item label="config 调用次数" :span="24">
          <span>{{ configCallCount }}</span>
        </y-form-item>
      </y-form>
      <div class="control-buttons">
        <el-button size="small" @click="configCallCount = 0">重置计数</el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormChangeContext } from '@yun-elp/components';

type OptionItem = { label: string; value: string };

const linkageFormRef = ref();

const layoutForm = ref({
  name: '',
  age: null as number | null,
  remark: ''
});

const layoutRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
};

const linkageForm = ref({
  type: '',
  category: '',
  subCategory: '',
  spec: '',
  remark: ''
});

const linkageRules = {
  type: [{ required: true, message: '请选择采购类型', trigger: 'change' }]
};

const typeOptions: OptionItem[] = [
  { label: '耗材', value: 'consumable' },
  { label: '设备', value: 'equipment' },
  { label: '服务', value: 'service' }
];

const categoryOptions = ref<OptionItem[]>([]);
const subCategoryOptions = ref<OptionItem[]>([]);
const specOptions = ref<OptionItem[]>([]);

const debounceForm = ref({ keyword: '' });
const debounceMs = ref(0);
const configCallCount = ref(0);

const getCategoryOptions = (type: string): OptionItem[] => {
  const map: Record<string, OptionItem[]> = {
    consumable: [
      { label: '办公用品', value: 'office' },
      { label: '清洁用品', value: 'cleaning' }
    ],
    equipment: [
      { label: '电脑', value: 'computer' },
      { label: '手机', value: 'phone' }
    ],
    service: [
      { label: '咨询', value: 'consulting' },
      { label: '培训', value: 'training' }
    ]
  };
  return map[type] || [];
};

const getSubCategoryOptions = (type: string, category: string): OptionItem[] => {
  const map: Record<string, Record<string, OptionItem[]>> = {
    consumable: {
      office: [
        { label: '文具', value: 'stationery' },
        { label: '纸张', value: 'paper' }
      ],
      cleaning: [
        { label: '清洁剂', value: 'detergent' },
        { label: '纸巾', value: 'tissue' }
      ]
    },
    equipment: {
      computer: [
        { label: '台式机', value: 'desktop' },
        { label: '笔记本', value: 'laptop' }
      ],
      phone: [
        { label: '手机', value: 'mobile' },
        { label: '配件', value: 'accessory' }
      ]
    },
    service: {
      consulting: [
        { label: '管理咨询', value: 'mgmt' },
        { label: '技术咨询', value: 'tech' }
      ],
      training: [
        { label: '内训', value: 'internal' },
        { label: '外训', value: 'external' }
      ]
    }
  };
  return map[type]?.[category] || [];
};

const getSpecOptions = (type: string, category: string, subCategory: string): OptionItem[] => {
  const key = `${type}-${category}-${subCategory}`;
  const map: Record<string, OptionItem[]> = {
    'consumable-office-stationery': [
      { label: '签字笔', value: 'pen' },
      { label: '笔记本', value: 'notebook' }
    ],
    'consumable-office-paper': [
      { label: 'A4纸', value: 'a4' },
      { label: '打印纸', value: 'print' }
    ],
    'consumable-cleaning-detergent': [
      { label: '84消毒液', value: 'disinfectant' },
      { label: '洗洁精', value: 'dishwash' }
    ],
    'consumable-cleaning-tissue': [
      { label: '抽纸', value: 'pull' },
      { label: '卷纸', value: 'roll' }
    ],
    'equipment-computer-desktop': [
      { label: '联想 ThinkCentre', value: 'lenovo' },
      { label: '戴尔 OptiPlex', value: 'dell' }
    ],
    'equipment-computer-laptop': [
      { label: 'MacBook Pro', value: 'macbook' },
      { label: 'ThinkPad X1', value: 'thinkpad' }
    ],
    'equipment-phone-mobile': [
      { label: 'iPhone 15', value: 'iphone15' },
      { label: '华为 Mate 60', value: 'mate60' }
    ],
    'equipment-phone-accessory': [
      { label: '充电器', value: 'charger' },
      { label: '耳机', value: 'earphone' }
    ],
    'service-consulting-mgmt': [
      { label: '战略咨询', value: 'strategy' },
      { label: '组织咨询', value: 'org' }
    ],
    'service-consulting-tech': [
      { label: '架构咨询', value: 'arch' },
      { label: '安全咨询', value: 'security' }
    ],
    'service-training-internal': [
      { label: '新人培训', value: 'onboard' },
      { label: '技能培训', value: 'skill' }
    ],
    'service-training-external': [
      { label: '认证培训', value: 'cert' },
      { label: '公开课', value: 'public' }
    ]
  };
  return map[key] || [];
};

const handleFormChange = (
  model: Record<string, string>,
  { field, newValue }: FormChangeContext
) => {
  if (field === 'type') {
    model.category = '';
    model.subCategory = '';
    model.spec = '';
    categoryOptions.value = newValue ? getCategoryOptions(String(newValue)) : [];
    subCategoryOptions.value = [];
    specOptions.value = [];
  }
  if (field === 'category') {
    model.subCategory = '';
    model.spec = '';
    subCategoryOptions.value = newValue
      ? getSubCategoryOptions(model.type, String(newValue))
      : [];
    specOptions.value = [];
  }
  if (field === 'subCategory') {
    model.spec = '';
    specOptions.value = newValue
      ? getSpecOptions(model.type, model.category, String(newValue))
      : [];
  }
};

const handleDebounceFormChange = () => {
  configCallCount.value += 1;
};

const handleSubmit = async () => {
  try {
    const data = await linkageFormRef.value.validateSync();
    ElMessage.success(`校验通过：${JSON.stringify(data)}`);
  } catch {
    ElMessage.error('校验失败，请检查表单');
  }
};

const handleReset = () => {
  linkageFormRef.value.resetFields();
  categoryOptions.value = [];
  subCategoryOptions.value = [];
  specOptions.value = [];
  ElMessage.success('表单已重置');
};
</script>

<style lang="scss" scoped>
.form-example {
  .demo-block {
    padding: 20px;
    margin-bottom: 32px;
    background: var(--ep-bg-color);
    border: 1px solid var(--ep-border-color-light);
    border-radius: 8px;

    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 500;
    }

    .tip {
      margin: 0 0 16px;
      font-size: 12px;
      color: var(--ep-text-color-secondary);
    }

    .control-buttons {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
  }
}
</style>
