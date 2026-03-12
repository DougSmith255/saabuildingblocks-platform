/**
 * Table Utilities
 *
 * Handles extraction of table data from blog content for:
 * 1. Standard WordPress tables with <thead> + <th> (with/without <strong>)
 * 2. Tables with <tbody> only - first row treated as headers
 * 3. Tables with <th> inside <tbody> (no <thead>)
 * 4. Tables with <p class="pm-align--left"> wrapped cell content
 * 5. has-fixed-layout class tables
 *
 * Also generates JSON-LD schema for Table structured data.
 */

export interface TableData {
  name: string;
  headers: string[];
  rows: string[][];
}

/**
 * Decode HTML entities in a string
 */
function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Strip HTML tags from a string
 */
function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Extract cell text from a table cell, handling nested <p>, <strong>, etc.
 */
function extractCellText(cellHtml: string): string {
  return decodeHTMLEntities(stripHTML(cellHtml)).trim();
}

/**
 * Extract all <tr> rows from HTML, returning cell text and whether the row uses <th>.
 */
function extractRows(html: string): { isHeader: boolean; cells: string[] }[] {
  const rows: { isHeader: boolean; cells: string[] }[] = [];
  const trPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;

  while ((trMatch = trPattern.exec(html)) !== null) {
    const rowHtml = trMatch[1];
    const cells: string[] = [];
    const hasThCells = /<th[\s>]/i.test(rowHtml);

    const cellPattern = /<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
    let cellMatch;
    while ((cellMatch = cellPattern.exec(rowHtml)) !== null) {
      cells.push(extractCellText(cellMatch[1]));
    }

    if (cells.length > 0) {
      rows.push({ isHeader: hasThCells, cells });
    }
  }

  return rows;
}

/**
 * Find the nearest preceding heading (h2 or h3) before a given position in the content.
 */
function findPrecedingHeading(content: string, tableIndex: number): string | null {
  const before = content.substring(0, tableIndex);
  const headingPattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;
  let lastMatch: RegExpExecArray | null = null;

  while ((match = headingPattern.exec(before)) !== null) {
    lastMatch = match;
  }

  if (!lastMatch) return null;
  return decodeHTMLEntities(stripHTML(lastMatch[1])).trim() || null;
}

/**
 * Extract all tables from blog content HTML.
 */
export function extractTables(content: string): TableData[] {
  const tables: TableData[] = [];
  const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;

  while ((tableMatch = tablePattern.exec(content)) !== null) {
    const tableHtml = tableMatch[1];
    const tableIndex = tableMatch.index;

    let headers: string[] = [];
    let dataRows: string[][] = [];

    // Check for <thead>
    const theadMatch = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);

    if (theadMatch) {
      // Pattern 1/4/5: Headers from <thead>
      const headRows = extractRows(theadMatch[1]);
      if (headRows.length > 0) {
        headers = headRows[0].cells;
      }

      // Body rows from <tbody> or remaining content
      const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
      const bodyHtml = tbodyMatch ? tbodyMatch[1] : tableHtml.replace(/<thead[\s\S]*?<\/thead>/i, '');
      dataRows = extractRows(bodyHtml).map(r => r.cells);
    } else {
      // No <thead> - check <tbody> or raw rows
      const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
      const bodyHtml = tbodyMatch ? tbodyMatch[1] : tableHtml;
      const allRows = extractRows(bodyHtml);

      if (allRows.length === 0) continue;

      // Pattern 3: First row uses <th> elements inside <tbody>
      // Pattern 2: First row treated as headers (no <th>, tbody-only)
      headers = allRows[0].cells;
      dataRows = allRows.slice(1).map(r => r.cells);
    }

    if (headers.length === 0 && dataRows.length === 0) continue;

    // Table name: preceding heading, or first header cell, or fallback
    const precedingHeading = findPrecedingHeading(content, tableIndex);
    const name = precedingHeading || headers[0] || 'Data Table';

    tables.push({ name, headers, rows: dataRows });
  }

  return tables;
}

/**
 * Generate Table JSON-LD schemas.
 * Returns one schema object per table, or null if no tables.
 */
export function generateTableSchemas(tables: TableData[], postTitle?: string): object[] | null {
  if (tables.length === 0) return null;

  return tables.map(table => {
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Table',
      name: table.name,
    };

    if (table.headers.length > 0) {
      schema.description = `Columns: ${table.headers.join(', ')}`;
    }

    if (postTitle) {
      schema.about = {
        '@type': 'Thing',
        name: postTitle,
      };
    }

    return schema;
  });
}
