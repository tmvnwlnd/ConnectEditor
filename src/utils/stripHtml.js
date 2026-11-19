// HTML → plain text (the introduction is rich text since it's a paragraph-style field).
export const stripHtml = (html = '') => String(html || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()
