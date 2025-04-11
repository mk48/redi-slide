export function getLastPartFromPath(path: string): string {
  return path.substring(path.lastIndexOf("/") + 1);
}
