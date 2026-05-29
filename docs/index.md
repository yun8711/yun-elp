---
layout: home
hero:
  name: YUN-ELP
  text: 基于 Element Plus 的业务组件库
  tagline: 高效、易用、专注于业务场景的组件封装
  image:
    src: /logo.svg
    alt: YUN-ELP
  actions:
    - theme: brand
      text: 开始
      link: /guide/overview
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/yun8711/yun-elp
features:
  - icon: 🛠️
    title: Vue 3 组件
    details: 基于 Vue 3.5+ 和 TypeScript 5+ 构建，提供完整的类型定义和智能代码提示
  - icon: ⚡️
    title: 快速集成
    details: 与 Element Plus 无缝集成，保持一致的设计语言和交互体验，减少开发时间
  - icon: 🎨
    title: 业务定制
    details: 针对常见业务场景进行二次封装，提供灵活的配置选项，满足多样化需求
  - icon: 📊 
    title: 高质量保障
    details: 全面的单元测试覆盖，语句覆盖率达到 94.61%，确保组件稳定可靠
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #409eff 10%, #95de64 100%);
  --vp-home-hero-text-color: #2c3e50;
  --vp-home-hero-tagline-color: #2c3e50;
  --vp-home-hero-image-background-image: linear-gradient(135deg, #409eff 10%, #95de64 100%);
  --vp-home-hero-image-filter: blur(40px);
}

.VPHome {
  padding: 0;
  margin: 0;
  width: 100%;
}

.VPHome .main {
  padding: 120px 24px 0;
}

.VPHome .container {
  margin: 0 auto;
  max-width: 1152px;
}

.VPHome .hero {
  text-align: center;
  margin-bottom: 96px;
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

.VPHome .features {
  margin: 96px auto 96px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1152px;
}

.VPHome .feature {
  padding: 32px;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.25s ease;
  text-align: center;
}

.VPHome .feature:hover {
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.VPHome .feature .icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.VPHome .feature .title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
}

.VPHome .feature .details {
  font-size: 16px;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

/* 自定义 Markdown 样式 */
.VPHome .features + section {
  max-width: 1152px;
  margin: 0 auto 96px;
  padding: 0 24px;
}

.VPHome h2 {
  font-size: 32px;
  text-align: center;
  margin-bottom: 48px;
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
  
  .VPHome .features {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .VPHome .feature {
    padding: 24px;
  }
}
</style>
