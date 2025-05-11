import mdContainer from 'markdown-it-container';
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons';
import createDemoContainer from '../plugins/demo';
import tableWrapper from '../plugins/table-wrapper';
import ApiTableContainer from '../plugins/api-table';
import type { MarkdownRenderer } from 'vitepress';

const mdPlugin = (md: MarkdownRenderer) => {
  md.use(tableWrapper);
  md.use(mdContainer, 'demo', createDemoContainer(md));
  md.use(ApiTableContainer);
  md.use(groupIconMdPlugin as unknown as (md: MarkdownRenderer) => void);
};

export default mdPlugin;
