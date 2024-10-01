export function isEqual<T = null | object | never[]>(obj1: T | null, obj2: T | null): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
