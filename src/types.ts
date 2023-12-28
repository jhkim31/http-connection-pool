import { Response } from "./interfaces";

type ResolveHandler = (d: Response) => void;
type RejectHandler = (e: unknown) => void;

export type {ResolveHandler, RejectHandler};