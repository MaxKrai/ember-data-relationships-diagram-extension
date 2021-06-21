function toPascalCase (val: string): string {
  return val.replace(
    /(.)(.*)/g,
    (_, leading, rest) => `${leading.toUpperCase()}${rest.toLowerCase()}`);
}

// some-module/item -> SomeModule_Item
export function transformModelName (modelName: string): string {
  return modelName.split('/').map(chunk => {
    return chunk.split('-').map(chunkItem => toPascalCase(chunkItem)).join('');
  }).join('_');
}

function sleep (timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout)
  });
}

export async function waitFor<T> (obj: Record<string, any>, key: string, timeout = 5000): Promise<T> {
  let timer = 0;
  const tick = 200;
  while (!obj[key] && timer <= timeout) {
    await sleep(tick);
    timer += tick;
  }

  return obj[key];
}
