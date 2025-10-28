import type { ExtractPublicPropTypes, PropType, VNode, Component } from '@vue/runtime-core';
import type { MenuProps as ElMenuProps } from 'element-plus';

// 菜单项数据结构
export interface MenuItem {
  index: string; // 菜单唯一标识
  label: string; // 菜单显示文本
  children?: MenuItem[]; // 子菜单
  disabled?: boolean; // 是否禁用
  icon?: Component | RenderIconFunction; // 图标配置（组件或render函数）
  [key: string]: any; // 其他扩展属性
}

// 图标渲染函数参数
export interface RenderIconParams {
  item: MenuItem; // 当前菜单项
  level: number; // 当前层级
  isExpanded: boolean; // 是否展开（用于子菜单）
}

// 图标渲染函数类型
export type RenderIconFunction = (params: RenderIconParams) => VNode | Component | string | null;

// 组件 Props
export interface MenuProps extends Partial<ElMenuProps> {
  data: MenuItem[]; // 菜单数据（必需，用于数据驱动）
  renderIcon?: RenderIconFunction; // 图标渲染函数
  indent?: number; // 层级缩进距离(px)
}

export const menuProps = {
  data: {
    type: Array as PropType<MenuItem[]>,
    required: true
  },
  renderIcon: {
    type: Function as PropType<RenderIconFunction>,
    default: null
  },
  indent: {
    type: Number,
    default: 20
  }
} as const;

export type menuInstance = ExtractPublicPropTypes<typeof menuProps>;
