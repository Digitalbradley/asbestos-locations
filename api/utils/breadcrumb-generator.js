export function generateBreadcrumbHTML(items) {
  if (!items || items.length === 0) {
    return '';
  }

  const breadcrumbItems = items.map((item, index) => {
    const separator = index > 0 ? '<span style="margin: 0 0.5rem; color: #9ca3af;">›</span>' : '';
    const content = item.href 
      ? `<a href="${item.href}" style="color: #6b7280; text-decoration: none;">${item.label}</a>`
      : `<span style="color: #9ca3af;">${item.label}</span>`;
    return `${separator}${content}`;
  }).join('');

  return `
    <nav style="margin-bottom: 2rem;">
      <ol style="display: flex; align-items: center; font-size: 0.875rem; list-style: none; margin: 0; padding: 0;">
        ${breadcrumbItems}
      </ol>
    </nav>
    <!-- CSS for breadcrumb hover effect -->
    <style>
      nav a:hover { text-decoration: underline; }
    </style>
  `;
}
