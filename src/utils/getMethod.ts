import { Method } from "../types";

export default function getMethod(m: string): Method {  
  switch (m.toLowerCase()) {
    case "get":
      return Method.GET;    
    case "post":
      return Method.POST;
    case "patch":
      return Method.PATCH;
    case "put":
      return Method.PUT;
    case "delete":
      return Method.DELETE;
    case "head":
      return Method.HEAD;
    default:
      return Method.GET;
  }
}