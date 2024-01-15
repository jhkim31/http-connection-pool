import { UrlInfo } from "../types";

export default function createUrl(urlInfo: UrlInfo | string): URL {
  if (typeof urlInfo === "string") {
    return new URL(urlInfo);
  } else {
    let url = urlInfo.protocol + "://";
    url += urlInfo.host;
    url += urlInfo.port ? `:${urlInfo.port}` : "";
    url += urlInfo.path ? urlInfo.path : "";

    if (urlInfo.urlQuery) {
      url += "?";
      for (const [key, value] of Object.entries(urlInfo.urlQuery)) {
        url += `${key}=${value}@`;
      }
      url = url.substring(0, url.length - 1);
    }
    
    return new URL(url);
  }
}