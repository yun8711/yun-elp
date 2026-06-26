export interface MarkdownTableRow {
  [key: string]: string;
}

const TABLE_ROW = /^\s*\|.+\|\s*$/;
const TABLE_SEPARATOR = /^\s*\|[\s\-:|]+\|\s*$/;
const TABLE_HEADER_NAMES = new Set([
  '属性名',
  '参数',
  '名称',
  '插槽名',
  '事件名',
  'name',
  '属性',
  '说明'
]);

const SKIP_API_SECTIONS = new Set([
  'Attributes',
  'Events',
  'Slots',
  'Exposes',
  'CSS Variables',
  '类型定义'
]);

const NESTED_PROPERTIES_HEADING = /^####\s+(.+?)\s+Properties\s*$/i;
/** @deprecated 兼容旧文档，新文档请使用 Properties */
const NESTED_ATTRIBUTE_HEADING = /^####\s+(.+?)\s+Attribute\s*$/i;
const NESTED_CONFIG_HEADING = /^####\s+(.+?)\s+配置项\s*$/;
const NESTED_H4_HEADING = /^####\s+(.+?)\s*$/;
const NESTED_H3_HEADING = /^###\s+(.+?)\s*$/;

function isNestedSchemaH4Line(line: string): boolean {
  const trimmed = line.trim();
  return (
    NESTED_PROPERTIES_HEADING.test(trimmed) ||
    NESTED_ATTRIBUTE_HEADING.test(trimmed) ||
    NESTED_CONFIG_HEADING.test(trimmed)
  );
}

function isPropertyGroupH4Title(title: string): boolean {
  return !/\s+(Properties|Attribute|配置项)\s*$/i.test(title.trim());
}

function readNestedSchemaHeading(line: string): string | undefined {
  if (!isNestedSchemaH4Line(line)) {
    return undefined;
  }

  return line.trim().replace(/^####\s+/, '');
}

/** 辅助类型章节：写入 prop.schemas，而非 properties */
const AUXILIARY_SCHEMAS = new Set([
  'dynamicpropsparams',
  'tablesearchitem',
  'formconfigfn',
  'formchangecontext'
]);

export interface ParsedNestedSchema {
  schemaName: string;
  matchKeys: string[];
  extendsDescription?: string;
  properties?: MarkdownTableRow[];
  groups?: Array<{ name: string; description?: string; rows: MarkdownTableRow[] }>;
}

export interface NestedAttributeSection {
  slug: string;
  extendsDescription?: string;
  rows: MarkdownTableRow[];
}

export function toKebabCase(str: string): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

/** 从文档表格「属性名/参数」单元格提取 prop 名，处理 `model-value / v-model`、`context.field` 等写法。 */
export function normalizeApiPropName(raw?: string): string {
  if (!raw) return '';
  const primary = raw.split('/')[0]?.trim() || raw.trim();
  if (primary.includes('.')) {
    return primary
      .split('.')
      .map(part => toKebabCase(part))
      .join('.');
  }
  return toKebabCase(primary);
}

export function stripMarkdownInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`/g, '')
    .trim();
}

export function stripTypeMarkdown(type?: string): string {
  if (!type) return 'any';

  return (
    stripMarkdownInline(type)
      .replace(/\^\[([^\]]+)\]/g, '$1')
      .replace(/\s+/g, ' ')
      .trim() || 'any'
  );
}

export function rowToPropFields(row: MarkdownTableRow) {
  const name = normalizeApiPropName(row['参数'] || row['属性名'] || row['属性'] || row['name']);
  const description = stripMarkdownInline(row['说明'] || row['描述'] || row['description'] || '');
  const type = stripTypeMarkdown(row['类型'] || row['type']);
  const defaultValue = row['默认值'] || row['default'];
  const defaultVal =
    !defaultValue || defaultValue === '—' ? undefined : stripMarkdownInline(defaultValue);

  return { name, description, type, default: defaultVal };
}

function headingTitleToSlug(title: string): string {
  return title
    .trim()
    .split(/\s+/)
    .map(word => word.toLowerCase())
    .join('-');
}

function normalizeMatchToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function titleToMatchKeys(title: string): string[] {
  const keys = new Set<string>();
  let cleaned = title
    .replace(/\s+Attribute\s*$/i, '')
    .replace(/\s+Properties\s*$/i, '')
    .replace(/\s+配置项\s*$/g, '')
    .trim();

  const periodMatch = cleaned.match(/^([A-Za-z0-9_]+)(?:（([^）]+)）)?$/);
  if (periodMatch) {
    cleaned = periodMatch[1];
    keys.add(normalizeMatchToken(periodMatch[1]));
  }

  keys.add(headingTitleToSlug(cleaned));
  keys.add(toKebabCase(cleaned));
  keys.add(normalizeMatchToken(cleaned));
  keys.add(
    cleaned
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
  );

  return [...keys].filter(Boolean);
}

function parsePeriodGroupHeading(title: string): { name: string; description?: string } {
  const match = title.trim().match(/^([A-Za-z0-9_]+)(?:（([^）]+)）)?$/);
  if (!match) {
    return { name: title.trim() };
  }

  return {
    name: match[1],
    description: match[2]?.trim()
  };
}

function parseBlockContent(blockLines: string[]) {
  const blockContent = blockLines.join('\n');
  const noteLines = blockLines.filter(
    line => line.trim() && !isTableRow(line) && !isTableSeparator(line)
  );
  const extendsDescription = noteLines.length
    ? noteLines.map(line => stripMarkdownInline(line.trim())).join(' ')
    : undefined;
  const rows = parseMarkdownTable(blockContent).filter(isValidTableRow);

  return { extendsDescription, rows };
}

function parseGroupedSubsections(blockLines: string[]): ParsedNestedSchema['groups'] {
  const groups: NonNullable<ParsedNestedSchema['groups']> = [];
  let i = 0;

  while (i < blockLines.length) {
    const headingMatch = blockLines[i].trim().match(NESTED_H4_HEADING);
    if (!headingMatch) {
      i++;
      continue;
    }

    const { name, description } = parsePeriodGroupHeading(headingMatch[1]);
    i++;

    const childLines: string[] = [];
    while (i < blockLines.length && !NESTED_H4_HEADING.test(blockLines[i].trim())) {
      childLines.push(blockLines[i]);
      i++;
    }

    const child = parseBlockContent(childLines);
    if (child.rows.length > 0) {
      groups.push({
        name,
        description,
        rows: child.rows
      });
    }
  }

  return groups.length > 0 ? groups : undefined;
}

function createSchema(
  schemaName: string,
  blockLines: string[],
  options?: { allowGroups?: boolean }
): ParsedNestedSchema | null {
  const matchKeys = titleToMatchKeys(schemaName);
  const groups = options?.allowGroups ? parseGroupedSubsections(blockLines) : undefined;

  if (groups?.length) {
    return {
      schemaName,
      matchKeys,
      groups
    };
  }

  const { extendsDescription, rows } = parseBlockContent(blockLines);
  if (rows.length === 0) {
    return null;
  }

  return {
    schemaName,
    matchKeys,
    extendsDescription,
    properties: rows
  };
}

/** 解析 ### Attributes 下 `#### xxx Properties` 子章节。 */
export function parseNestedAttributeSections(sectionContent: string): NestedAttributeSection[] {
  if (!sectionContent.trim()) {
    return [];
  }

  const sections: NestedAttributeSection[] = [];
  const lines = sectionContent.split('\n');
  let i = 0;

  while (i < lines.length) {
    const propertiesMatch = lines[i].trim().match(NESTED_PROPERTIES_HEADING);
    const attributeMatch = !propertiesMatch
      ? lines[i].trim().match(NESTED_ATTRIBUTE_HEADING)
      : null;
    const genericMatch =
      !propertiesMatch && !attributeMatch ? lines[i].trim().match(NESTED_H4_HEADING) : null;

    if (!propertiesMatch && !attributeMatch && !genericMatch) {
      i++;
      continue;
    }

    const title = propertiesMatch?.[1] || attributeMatch?.[1] || genericMatch![1];
    const slug =
      propertiesMatch || attributeMatch ? headingTitleToSlug(title) : titleToMatchKeys(title)[0];
    i++;

    const blockLines: string[] = [];
    while (
      i < lines.length &&
      !NESTED_PROPERTIES_HEADING.test(lines[i].trim()) &&
      !NESTED_ATTRIBUTE_HEADING.test(lines[i].trim()) &&
      !NESTED_H4_HEADING.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('### ')
    ) {
      blockLines.push(lines[i]);
      i++;
    }

    const { extendsDescription, rows } = parseBlockContent(blockLines);
    sections.push({ slug, extendsDescription, rows });
  }

  return sections;
}

/** 解析 ## API 下所有 `#### xxx Properties` 嵌套类型章节。 */
export function parseApiNestedSchemas(markdown: string): ParsedNestedSchema[] {
  const apiMatch = markdown.match(/## API\s*\n([\s\S]*?)(?=\n## |$)/);
  if (!apiMatch) {
    return [];
  }

  const lines = apiMatch[1].split('\n');
  const schemas: ParsedNestedSchema[] = [];
  let i = 0;

  while (i < lines.length) {
    const h3 = lines[i].trim().match(NESTED_H3_HEADING);
    if (h3) {
      i++;
      if (SKIP_API_SECTIONS.has(h3[1].trim())) {
        while (
          i < lines.length &&
          !NESTED_H3_HEADING.test(lines[i].trim()) &&
          !isNestedSchemaH4Line(lines[i])
        ) {
          i++;
        }
      }
      continue;
    }

    const fullTitle = readNestedSchemaHeading(lines[i]);
    if (!fullTitle) {
      i++;
      continue;
    }

    i++;

    const blockLines: string[] = [];
    while (i < lines.length) {
      const trimmed = lines[i].trim();
      if (NESTED_H3_HEADING.test(trimmed) || isNestedSchemaH4Line(lines[i])) {
        break;
      }
      blockLines.push(lines[i]);
      i++;
    }

    const hasGroupedChildren = blockLines.some(line => {
      const match = line.trim().match(NESTED_H4_HEADING);
      return match ? isPropertyGroupH4Title(match[1]) : false;
    });

    const schema = createSchema(fullTitle, blockLines, {
      allowGroups: hasGroupedChildren
    });

    if (schema) {
      schemas.push(schema);
    }
  }

  return schemas;
}

const PROP_ALIASES: Record<string, string[]> = {
  tablesearchoption: ['options'],
  tablesearchitem: ['options'],
  dynamicpropsparams: ['options'],
  columnformsitem: ['options'],
  groupselectoption: ['options'],
  rowselectoption: ['options'],
  columnfilterconfig: ['config'],
  columnopitemtype: ['options'],
  descitem: ['config'],
  echartsconfig: ['config'],
  editdefaultvalue: ['edit-default-value'],
  formconfigfn: ['config']
};

export function matchSchemaToPropName(
  schema: ParsedNestedSchema,
  propNames: string[],
  propTypes: Map<string, string>
): string | undefined {
  for (const propName of propNames) {
    const propTokens = new Set([
      propName.toLowerCase(),
      normalizeMatchToken(propName),
      propName.replace(/-/g, '').toLowerCase()
    ]);
    const typeRaw = propTypes.get(propName) || '';

    for (const key of schema.matchKeys) {
      if (!key) continue;

      if (propTokens.has(key) || propTokens.has(key.replace(/-/g, ''))) {
        return propName;
      }

      if (typeContainsKey(typeRaw, key)) {
        return propName;
      }

      const aliasKey = normalizeMatchToken(key);
      const aliases = PROP_ALIASES[aliasKey];
      if (aliases?.includes(propName)) {
        return propName;
      }
    }

    for (const key of schema.matchKeys) {
      const aliases = PROP_ALIASES[normalizeMatchToken(key)];
      if (aliases?.includes(propName)) {
        return propName;
      }
    }
  }

  return undefined;
}

function normalizeSchemaToken(schemaName: string): string {
  return normalizeMatchToken(
    schemaName
      .replace(/\s+Attribute\s*$/i, '')
      .replace(/\s+Properties\s*$/i, '')
      .replace(/\s+配置项\s*$/g, '')
      .trim()
  );
}

export function isAuxiliarySchema(schemaName: string): boolean {
  return AUXILIARY_SCHEMAS.has(normalizeSchemaToken(schemaName));
}

function typeContainsKey(typeRaw: string, key: string): boolean {
  const normalizedType = normalizeMatchToken(typeRaw);
  const normalizedKey = normalizeMatchToken(key);
  return normalizedKey.length > 2 && normalizedType.includes(normalizedKey);
}

export function matchNestedSectionToProp(slug: string, propNames: string[]): string | undefined {
  const normalized = slug.toLowerCase();
  return propNames.find(name => name.toLowerCase() === normalized);
}

export function splitTableLine(line: string) {
  return line
    .replace(/\\\|/g, '___PIPE___')
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim().replace(/___PIPE___/g, '\\|'));
}

function isTableRow(line: string) {
  return TABLE_ROW.test(line);
}

function isTableSeparator(line: string) {
  return TABLE_SEPARATOR.test(line);
}

/** 只解析章节下第一张 Markdown 表格，遇到 #### / ### 子章节或非表格行则停止。 */
export function parseMarkdownTable(content: string): MarkdownTableRow[] {
  if (!content.trim()) {
    return [];
  }

  const lines = content.split('\n').filter(line => line.trim());
  const tableStartIndex = lines.findIndex(line => isTableRow(line) && !isTableSeparator(line));

  if (tableStartIndex === -1 || lines.length < tableStartIndex + 3) {
    return [];
  }

  const headers = splitTableLine(lines[tableStartIndex]);
  const rows: MarkdownTableRow[] = [];

  for (let i = tableStartIndex + 2; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('####') || trimmed.startsWith('###')) {
      break;
    }
    if (!isTableRow(line) || isTableSeparator(line)) {
      continue;
    }

    const cells = splitTableLine(line);
    rows.push(
      headers.reduce((row, header, index) => {
        row[header] = cells[index] || '';
        return row;
      }, {} as MarkdownTableRow)
    );
  }

  return rows;
}

export function extractApiSection(content: string, section: string): string {
  const apiMatch = content.match(/## API\s*\n([\s\S]*?)(?=\n## |$)/);

  if (!apiMatch) {
    return '';
  }

  const sectionRegex = new RegExp(`### ${section}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`);
  return apiMatch[1].match(sectionRegex)?.[1]?.trim() || '';
}

export function isValidTableRow(row: MarkdownTableRow): boolean {
  const name =
    row['参数'] ||
    row['属性名'] ||
    row['属性'] ||
    row['名称'] ||
    row['插槽名'] ||
    row['事件名'] ||
    row['name'] ||
    '';

  if (!name.trim() || TABLE_HEADER_NAMES.has(name.trim())) {
    return false;
  }

  const values = Object.values(row);
  return values.some(value => value && !value.includes('---') && !value.includes('###'));
}
