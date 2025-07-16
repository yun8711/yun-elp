import mdContainer from 'markdown-it-container';
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons';
import createDemoContainer from '../plugins/demo';
import tableWrapper from '../plugins/table-wrapper';
import ApiTableContainer from '../plugins/api-table';
import tooltip from '../plugins/tooltip';
import externalLinkIcon from '../plugins/external-link-icon';
import type { MarkdownRenderer } from 'vitepress';

const mdPlugin = (md: MarkdownRenderer) => {
  md.use(tableWrapper);
  md.use(mdContainer, 'demo', createDemoContainer(md));
  md.use(ApiTableContainer);
  md.use(groupIconMdPlugin as unknown as (md: MarkdownRenderer) => void);
  md.use(tooltip);
  md.use(externalLinkIcon);
};

export default mdPlugin;
