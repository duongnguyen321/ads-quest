import { CLIENT_URL } from '@/configs/site.configs';
import { formatDate } from '@/helpers/date.helpers';

/**
 * Function to remove Vietnamese accents from a string
 * @function
 * @param {string} str - The string from which to remove accents
 * @returns {string} - The string after removing accents
 */
export function removeAccents(str: string): string {
  if (!str) {
    return '';
  }
  return str
    .normalize('NFD') // Normalize the string to Unicode Normalization Form D (NFD)
    .replace(/[\u0300-\u036f]/g, '') // Remove all combining diacritical marks
    .replace('đ', 'd') // Replace specific Vietnamese characters with their non-accented counterparts
    .replace('Đ', 'D'); // Replace specific Vietnamese characters with their non-accented counterparts
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

/**
 * Formats a phone number by removing all non-numeric characters except the plus sign, and replaces the country code +84 with 0.
 * This function is specifically designed for Vietnamese phone numbers but can be adapted for other formats.
 *
 * @param {string} phone - The phone number to be formatted.
 * @returns {string} - The formatted phone number with non-numeric characters removed and the country code +84 replaced with 0.
 */
export function formatPhone(phone: string): string {
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  cleanPhone = cleanPhone.replace(/^\+84/, '0');
  return cleanPhone;
}

/**
 * Truncates a string to a specified length and appends an ellipsis ('...') at the start, middle, or end if the original string exceeds that length.
 * This function is useful for shortening strings to fit within UI elements or for previewing longer text.
 *
 * @param {string} str - The string to be truncated.
 * @param {number} limit - The maximum length of the string before truncation.
 * @param {'start' | 'center' | 'end'} position - The position where the truncation should occur. Defaults to 'end'.
 * @param hiddenStr
 * @param lengthHidden
 * @returns {string} - The truncated string with an ellipsis appended at the specified position if the original string exceeded the limit, or the original string if it did not.
 */
export const truncate = (
  str: string,
  {
    limit = 3,
    position = 'center',
    hiddenStr = '.',
    lengthHidden = 3,
  }: {
    limit?: number,
    position?: 'start' | 'center' | 'end',
    hiddenStr?: '.' | '*' | '#',
    lengthHidden?: number
  } = {},
): string => {
  if (!str?.length) {
    return '';
  }
  if (position === 'center' && str?.length <= limit * 2) {
    return str;
  } else if (position !== 'center' && str?.length <= limit) {
    return str;
  }

  const ellipsis = Array.from({ length: lengthHidden }, () => hiddenStr).join(
    '',
  );
  switch (position) {
    case 'start':
      return ellipsis + str.slice(-limit);
    case 'center':
      const start = str.substring(0, limit);
      const end = str.substring(str.length - limit, str.length);
      return `${start}${ellipsis}${end}`;
    case 'end':
      return str.slice(0, limit) + ellipsis;
    default:
      return str.slice(0, limit) + ellipsis;
  }
};

/**
 * Converts the first character of a string to uppercase and returns the modified string.
 * If the input string is empty or undefined, an empty string is returned.
 *
 * @param {string} str - The string whose first character is to be converted to uppercase.
 * @returns {string} - The string with its first character converted to uppercase, or an empty string if the input is undefined or empty.
 */
export function upperFirstLetter(str?: string): string {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random string of 8 characters including numbers, with an optional prefix.
 * If a prefix is provided, the total length remains 8, but the number of random characters
 * is reduced accordingly.
 *
 * @param {string} startWith - Optional prefix for the generated string.
 * @param length
 * @returns {string} - Randomly generated string of 8 characters including the prefix.
 */
export function randomCode(startWith: string = '', length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const maxRandomLength = length - startWith.length;
  let randomString = startWith;

  for (let i = 0; i < maxRandomLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

export function makeTitle(nav: string) {
  return `${nav} | ${CLIENT_URL}`;
}

export function makeDescription(content: string, maxLength = 150) {
  if (content.length > maxLength) {
    return content.substring(0, maxLength) + '...';
  }
  return `${formatDate(
    new Date().toISOString(),
    'DD/MM/YYYY',
  )} - ${content.substring(0, maxLength)}`;
}


export function isMongoId(id?: string | number): boolean {
  if (!id) return false;
  const uid = id?.toString();
  return /^[a-fA-F0-9]{24}$/.test(uid);
}
