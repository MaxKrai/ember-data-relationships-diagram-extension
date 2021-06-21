import FileSaver from 'file-saver';

export function save (): void {
  const html = `<!DOCTYPE html>\n${document.documentElement.innerHTML}`;
  const file = new File(
    [html], `ember-data-diagram_${new Date().toISOString()}.html`,
    { type: 'text/plain;charset=utf-8' }
  );
  FileSaver.saveAs(file);
}
