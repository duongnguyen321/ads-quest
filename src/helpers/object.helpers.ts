export function isEqual<T = null | object | never[]>(obj1: T | null, obj2: T | null): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Parse JSON value to object.
 * @param {string} obj - the value to parse
 * @returns {object | null}  Object parsed or null
 */
export function parseObj<T = object>(obj?: string | null): T | null {
  if (!obj) return null;
  let result: T | null;
  try {
    result = JSON.parse(obj);
  } catch {
    result = null;
  }
  return result;
}

export function cloneObj<T = object>(obj: T): T | null {
  if (!obj) return null;
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error(e);
    return null;
  }
}
