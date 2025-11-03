import type { ExtractPublicPropTypes, PropType, VNode, Component } from '@vue/runtime-core';

// 菜单项数据结构
export interface MenuItem {
  index: string; // 菜单唯一标识
  route?: string | object; // 路由地址
  label: string; // 菜单显示文本
  disabled?: boolean; // 是否禁用
  icon?: Component; // 图标配置（组件或render函数）
  children?: MenuItem[]; // 子菜单
  [key: string]: any; // 其他扩展属性
}

// 图标渲染函数参数
export interface RenderIconParams {
  item: MenuItem; // 当前菜单项
  level: number; // 当前层级
}

// 图标渲染函数类型
export type RenderIconFunction = (params: RenderIconParams) => VNode | Component | string | null;

// 组件 Props
export interface MenuProps {
  // 菜单数据
  data: MenuItem[];
  // 层级缩进距离(px)，数字表示所有层级相同，数组表示各层级不同，相对于顶级菜单的缩进距离
  indent?: number | number[];
}

export const menuProps = {
  data: {
    type: Array as PropType<MenuItem[]>,
    required: true
  },
  indent: {
    type: [Number, Array] as PropType<number | number[]>,
    default: 20
  }
} as const;

export type menuInstance = ExtractPublicPropTypes<typeof menuProps>;
