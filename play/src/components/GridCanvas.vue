<template>
  <div class="grid-container">
    <div class="grid-labels-x">
      <span v-for="x in xLabels" :key="x" :style="{ left: `${x}px` }">{{ x }}</span>
    </div>
    <div class="grid-labels-y">
      <span v-for="y in yLabels" :key="y" :style="{ top: `${y}px` }">{{ y }}</span>
    </div>
    <canvas ref="canvas" class="grid-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';

const props = defineProps({
  showGrid: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  }
});

const canvas = ref(null);
let ctx = null;

// 计算X轴和Y轴的刻度标签
const xLabels = computed(() => {
  if (!canvas.value) return [];
  const width = canvas.value.width;
  const labels = [];
  for (let x = 100; x < width; x += 100) {
    labels.push(x);
  }
  return labels;
});

const yLabels = computed(() => {
  if (!canvas.value) return [];
  const height = canvas.value.height;
  const labels = [];
  for (let y = 100; y < height; y += 100) {
    labels.push(y);
  }
  return labels;
});

// 绘制网格
const drawGrid = () => {
  if (!ctx || !props.showGrid) return;

  const canvasElement = canvas.value;
  const width = canvasElement.width;
  const height = canvasElement.height;

  // 清除画布
  ctx.clearRect(0, 0, width, height);

  // 设置网格样式
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;

  // 绘制20px网格
  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 设置100px网格样式
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;

  // 绘制100px网格
  for (let x = 0; x <= width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 100) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

// 初始化画布
const initCanvas = () => {
  const canvasElement = canvas.value;
  const container = canvasElement.parentElement;

  // 设置画布尺寸
  canvasElement.width = container.clientWidth;
  canvasElement.height = container.clientHeight;

  // 获取上下文
  ctx = canvasElement.getContext('2d');

  // 绘制网格
  drawGrid();
};

// 监听窗口大小变化
const handleResize = () => {
  initCanvas();
};

onMounted(() => {
  initCanvas();
  window.addEventListener('resize', handleResize);
});

// 监听属性变化
watch(() => props.showGrid, () => {
  if (props.showGrid) {
    drawGrid();
  } else {
    ctx?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  }
});

watch(() => props.backgroundColor, () => {
  drawGrid();
});
</script>

<style lang="scss" scoped>
.grid-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.grid-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grid-labels-x {
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  height: 20px;
  pointer-events: none;
  z-index: -1;

  span {
    position: absolute;
    transform: translateX(-50%);
    font-size: 10px;
    color: #999;
    background-color: #fff;
    padding: 0 4px;
  }
}

.grid-labels-y {
  position: absolute;
  top: 0;
  left: -30px;
  width: 30px;
  height: 100%;
  pointer-events: none;
  z-index: -1;

  span {
    position: absolute;
    transform: translateY(-50%);
    font-size: 10px;
    color: #999;
    background-color: #fff;
    padding: 0 4px;
  }
}
</style>
