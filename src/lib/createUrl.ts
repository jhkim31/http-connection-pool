import { UrlInfo } from "../types";

/**
 * Return URL object.
 * 
 * Receive url string or {@link UrlInfo Url Info Object}
 * @param urlInfo {@link UrlInfo}
 * @returns 
 */
export function createUrl(urlInfo: UrlInfo | string): URL {  
  if (typeof urlInfo === "string") {    
    return new URL(urlInfo);
  } else {
    let url = urlInfo.protocol + "://";
    url += urlInfo.host;
    url += urlInfo.port ? `:${urlInfo.port}` : "";
    url += urlInfo.path ? (urlInfo.path[0] === "/" ? urlInfo.path : `/${urlInfo.path}`) : "";

    if (urlInfo.urlQuery) {
      url += "?";
      for (const [key, value] of Object.entries(urlInfo.urlQuery)) {
        url += `${key}=${value}&`;
      }
      url = url.substring(0, url.length - 1);
    }    
    return new URL(url);
  }
}