export default function isJson(jsonStr: string) {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch (error: unknown) {
    return false;
  }
}