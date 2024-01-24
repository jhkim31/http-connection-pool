import { ms } from "../types";

/**
 * 
 * @param ms 
 * @returns 
 */
export default function sleep(ms: ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}