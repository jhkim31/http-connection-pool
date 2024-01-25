import { ms } from "../types";

export default function sleep(ms: ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}