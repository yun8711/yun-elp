---
layout: home
hero:
  name: KD-ELP
  text: 基于 Element Plus 的业务组件库
  tagline: 高效、易用、美观的 Vue 3 组件库
  actions:
    - theme: brand
      text: 开始使用
      link: /guide/
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/your-org/kd-elp
features:
  - icon: 🛠️
    title: Vue 3 组件
    details: 基于 Vue 3 和 TypeScript 构建，提供完整的类型定义
  - icon: ⚡️
    title: 快速集成
    details: 与 Element Plus 无缝集成，保持一致的设计和交互体验
  - icon: 🎨
    title: 业务定制
    details: 针对特定业务场景定制，提供更高效的开发体验
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #409eff 10%, #95de64 100%);
  --vp-home-hero-text-color: #2c3e50;
  --vp-home-hero-image-background-image: linear-gradient(135deg, #409eff 10%, #95de64 100%);
  --vp-home-hero-image-filter: blur(40px);
}

.VPHome {
  padding: 0;
  margin: 0;
  width: 100%;
}

.VPHome .main {
  padding: 120px 24px;
}

.VPHome .container {
  margin: 0 auto;
  max-width: 1152px;
}

.VPHome .hero {
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
}

.VPHome .features {
  margin-top: 64px;
  padding: 0 24px;
}

.VPHome .feature {
  padding: 24px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  transition: background-color 0.25s;
}

.VPHome .feature:hover {
  background-color: var(--vp-c-bg-mute);
}

.VPHome .feature .icon {
  font-size: 24px;
  margin-bottom: 16px;
}

.VPHome .feature .title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.VPHome .feature .details {
  font-size: 14px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}
</style>
