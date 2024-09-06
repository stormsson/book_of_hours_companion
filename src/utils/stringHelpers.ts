
/**
 * Checks if a string includes another string (case insensitive).
 * @param str - The main string.
 * @param search - The string to search for.
 * @returns True if the main string includes the search string, false otherwise.
 */
export const includesIgnoreCase = (str: string, search: string): boolean => {
  return str.toLowerCase().includes(search.toLowerCase());
};


/**
 * Generates a Wiki URL from a given string.
 * @param str - The string to convert into a Wiki URL.
 * @returns The full Wiki URL.
 */
export const WikiUrl = (str: string): string => {
  const baseUrl = "https://book-of-hours.fandom.com/wiki/";
  const formattedStr = removeBracesContent(str).replace(/\s+/g, '_'); // Replace spaces with underscores
  return baseUrl + formattedStr;
};


/**
 * Removes everything inside parentheses (including the parentheses themselves) from a string.
 * @param str - The string to process.
 * @returns The string with content inside parentheses removed.
 */
export const removeBracesContent = (str: string): string => {
    console.log(str.replace(/\s*\(.*?\)\s*/g, ' ').trim())
    return str.replace(/\s*\(.*?\)\s*/g, ' ').trim(); // Remove content inside parentheses and trim whitespace
};