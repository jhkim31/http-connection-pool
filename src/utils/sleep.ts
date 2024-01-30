import { ms } from "../types";

export function sleep(ms: ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}