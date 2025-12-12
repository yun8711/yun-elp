import type { MarkdownRenderer } from 'vitepress'

type RenderRule = Exclude<
  MarkdownRenderer['renderer']['rules']['container'],
  undefined
>
export default (md: MarkdownRenderer): void => {
  const renderToken: RenderRule = (tokens, idx, options, env, self) =>
    self.renderToken(tokens, idx, options)
  const defaultLinkOpenRenderer = md.renderer.rules.link_open || renderToken
  const defaultLinkCloseRenderer = md.renderer.rules.link_close || renderToken
  let isExternalLink = false

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const href = token.attrGet('href')

    if (href) {
      token.attrJoin('class', 'vp-link')
      if (/^((ht|f)tps?):\/\/?/.test(href)) {
        isExternalLink = true
      }
    }

    return defaultLinkOpenRenderer(tokens, idx, options, env, self)
  }

  md.renderer.rules.link_close = (tokens, idx, options, env, self) => {
    if (isExternalLink) {
      isExternalLink = false
      // 使用 SVG 图标而不是组件，避免组件未注册的问题
      return `<svg class="link-icon" style="display: inline-block; width: 1em; height: 1em; vertical-align: middle; margin-left: 4px;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6V8H5V19H16V14H18V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H10ZM21 3V11H19V6.413L9.207 16.207L7.793 14.793L17.585 5H13V3H21Z" fill="currentColor"/></svg>${self.renderToken(
        tokens,
        idx,
        options
      )}`
    }

    return defaultLinkCloseRenderer(tokens, idx, options, env, self)
  }
}
