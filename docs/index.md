---
layout: home
hero:
  name: YUN-ELP
  text: 基于 Element Plus 的业务组件库
  tagline: 高效、易用、AI 友好，专注于业务场景的组件封装
  image:
    src: /home_index.png
    alt: YUN-ELP
  actions:
    - theme: brand
      text: 开始
      link: /guide/overview
    - theme: alt
      text: AI 指南
      link: /guide/ai-usage
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/yun8711/yun-elp
features:
  - icon: 🤖
    title: AI 友好
    details: 提供 AI 使用指南、LLMs 文档索引、组件元数据和 MCP 支持，让 AI 助手能更准确地理解组件 API、示例和接入方式
  - icon: 🧩
    title: 业务组件封装
    details: 32 个组件，不止基础 UI，内置表格搜索、操作列、页面结构、定时选择器、图表容器等高频业务组件，减少重复封装
  - icon: 🌐
    title: 全局配置收口
    details: 通过 YAppWrap 统一管理语言、按钮、弹窗、空状态、表格、页面头尾和图表等默认配置，降低页面样板代码
  - icon: ⚡️
    title: 低接入成本
    details: 自带 YunElpResolver，支持自动导入和样式副作用注入，可与 Element Plus 一起快速接入现有项目
  - icon: 🧠
    title: IDE 与类型友好
    details: 提供 TypeScript 类型、global.d.ts、web-types.json 和 tags.json，兼顾模板补全、属性提示与类型检查体验
  - icon: 📊
    title: 质量保障
    details: 组件、文档、元数据和测试链路同步维护，结合单元测试与类型检查，提升组件库的稳定性和可维护性
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(120deg, #4f8a10 0%, #7fb318 38%, #c7d53c 100%);
  --vp-home-hero-text-color: #1b2512;
  --vp-home-hero-tagline-color: #5b6651;
  --vp-home-hero-image-background-image:
    radial-gradient(circle at 18% 18%, rgba(220, 234, 96, 0.42), transparent 38%),
    radial-gradient(circle at 82% 22%, rgba(129, 190, 64, 0.26), transparent 34%),
    radial-gradient(circle at 52% 78%, rgba(255, 233, 157, 0.32), transparent 38%);
  --vp-home-hero-image-filter: blur(62px);
}

.VPHome {
  padding: 0;
  margin: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 18%, rgba(110, 231, 183, 0.16), transparent 24%),
    radial-gradient(circle at 88% 16%, rgba(167, 243, 208, 0.24), transparent 22%),
    radial-gradient(circle at 50% 0%, rgba(220, 252, 231, 0.78), transparent 42%),
    linear-gradient(180deg, #f7fcf8 0%, #f4fbf6 36%, #ffffff 100%);
}

.VPHome::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.48), transparent 76%);
  pointer-events: none;
}

.VPHome::after {
  content: '';
  position: absolute;
  inset: auto;
  top: 64px;
  left: 50%;
  width: 620px;
  height: 620px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(134, 239, 172, 0.18) 0%, rgba(134, 239, 172, 0) 72%);
  filter: blur(10px);
  pointer-events: none;
}

.VPHome .VPHero .main {
  position: relative;
  z-index: 1;
  padding: 84px 24px 0;
}

.VPHome .VPHero .container,
.VPHome .VPHomeFeatures .container {
  margin: 0 auto;
  max-width: 1152px;
}

.VPHome .VPHero {
  text-align: center;
}

.VPHome .text {
  font-size: 48px;
  line-height: 56px;
  font-weight: 600;
}

.VPHome .tagline {
  font-size: 18px;
  line-height: 28px;
  color: var(--vp-c-text-2);
  margin: 16px auto 48px;
  max-width: 592px;
}

.VPHome .actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.VPHome .VPHomeFeatures {
  position: relative;
  z-index: 1;
  margin: 0 auto 96px;
}

.VPHome .VPHomeFeatures .items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.VPHome .VPHomeFeatures .item {
  width: auto;
}

.VPHome .VPHomeFeatures .VPFeature {
  display: block;
  height: 100%;
}

.VPHome .VPHomeFeatures .VPFeature .box {
  height: 100%;
  padding: 32px;
  border-radius: 18px;
  border: 1px solid rgba(16, 185, 129, 0.08);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(244, 251, 246, 0.88) 100%);
  box-shadow: 0 16px 36px rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(8px);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  text-align: center;
}

.VPHome .VPHomeFeatures .VPFeature:hover .box {
  transform: translateY(-4px);
  border-color: rgba(16, 185, 129, 0.18);
  box-shadow: 0 22px 44px rgba(16, 24, 40, 0.1);
}

.VPHome .VPHomeFeatures .VPFeature .icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.VPHome .VPHomeFeatures .VPFeature .title {
  font-size: 20px;
  font-weight: 600;
  /* margin-bottom: 12px; */
  color: var(--vp-c-text-1);
}

.VPHome .VPHomeFeatures .VPFeature .details {
  font-size: 14px;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.VPHome h2 {
  font-size: 32px;
  text-align: center;
  color: var(--vp-c-text-1);
}

.VPHome pre {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .VPHome .text {
    font-size: 36px;
    line-height: 44px;
  }
  
  .VPHome .VPHomeFeatures .items {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .VPHome .VPHomeFeatures .VPFeature .box {
    padding: 24px;
  }
}
</style>
