### 单、双击

```vue
<template>
  <y-button @click="onClick" @dblclick="onDblclick" type="primary">
    基础单双击测试：单击计数: {{ clickCount }}，双击计数: {{ dblclickCount }}
  </y-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const clickCount = ref(0);
const dblclickCount = ref(0);

const onClick = () => {
  clickCount.value++;
};

const onDblclick = () => {
  dblclickCount.value++;
};
</script>

```

### 防抖

```vue
<template>
  <y-button type="danger" @click="count++" model="debounce">delay默认300，回调次数：{{ count }}</y-button>

  <y-button type="success" @click="count2++" model="debounce" :delay="1000"
    :max-wait="3000">delay=1000,max-wait=3000，回调次数：{{ count2 }}</y-button>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const count = shallowRef(0)
const count2 = shallowRef(0)
</script>

```

### 节流

```vue
<template>
  <y-button color="gray" @click="count++" model="throttle">delay默认300，回调次数：{{ count }}</y-button>

  <y-button plain @click="count2++" model="throttle" :delay="1000">delay=1000，回调次数：{{ count2 }}</y-button>

</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const count = shallowRef(0)
const count2 = shallowRef(0)
</script>

```
