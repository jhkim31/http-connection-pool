/**
 * Checks if the `number` is positive integer.
 * @param number number
 * @returns 
 */
export function isPositiveInteger(number: number): boolean {
  return Number.isInteger(number) && number > 0;
}