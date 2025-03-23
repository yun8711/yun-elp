import { defineComponent } from 'vue';
import './k-table.scss';

export default defineComponent({
  name: 'KTable',
  inheritAttrs: false,
  props: {
    // 在此处定义组件属性
  },
  emits: [
    // 在此处定义组件事件
  ],
  setup(props, { slots, emit, attrs }) {
    // 组件逻辑

    return () => (
      <div class="k-table" {...attrs}>
        {/* 组件内容 */}
        {slots.default?.()}
      </div>
    );
  }
});
