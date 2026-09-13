// Exportación estática (modo demo): Next escribe los datos de navegación por segmento en carpetas anidadas
// (`__next.admin/!KHBhbmVsKQ/entradas/__PAGE__.txt`), pero el navegador los pide con puntos
// (`__next.admin.!KHBhbmVsKQ.entradas.__PAGE__.txt`). Un hosting estático como GitHub Pages no hace esa
// traducción, así que se crea una copia con el nombre que se solicita.
import { copyFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const outDir = process.argv[2] ?? 'out';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))
  ).flat();
}

async function flatten(dir) {
  let copied = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith('__next.')) {
      for (const file of await walk(full)) {
        const dotted = `${entry.name}.${relative(full, file).split(sep).join('.')}`;
        await copyFile(file, join(dir, dotted));
        copied++;
      }
    } else {
      copied += await flatten(full);
    }
  }
  return copied;
}

const copied = await flatten(outDir);
console.log(`Segmentos RSC aplanados: ${copied}`);
