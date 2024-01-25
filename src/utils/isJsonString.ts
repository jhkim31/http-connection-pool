/**
 * Validate input string is json or not.
 * @param jsonStr json string
 * @returns boolean
 */
export default function isJsonString(jsonStr: string) {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch (error: unknown) {
    return false;
  }
}