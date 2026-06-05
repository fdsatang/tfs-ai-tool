import * as GM from "$";
import qs from "qs";

const { GM_setValue, GM_getValue, GM_xmlhttpRequest } = GM;

// 封装设置数据api
const setValue = function <T>(name: string, value: T) {
  GM_setValue(name, JSON.stringify(value));
};

// 封装获取数据api
const getValue = function <T>(name: string, defaultValue: T) {
  let value = GM_getValue(name, "") || "";
  try {
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
};

const xmlhttpRequestPOST = (url: string, data: any, contentType?: "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data") => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url,
      timeout: 5000,
      data: contentType === "application/x-www-form-urlencoded" ? qs.stringify({ jsonString: JSON.stringify(data) }) : JSON.stringify(data),
      headers: {
        "Content-Type": contentType || "application/json"
      },
      onload: function (response) {
        if (response.status == 200) {
          resolve(JSON.parse(response.response));
        } else {
          reject(response);
        }
      }
    });
  });
};

const xmlhttpRequestGet = (url: string, data?: any, contentType?: "application/json" | "application/x-www-form-urlencoded") => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url,
      timeout: 5000,
      data: contentType === "application/x-www-form-urlencoded" ? qs.stringify({ jsonString: JSON.stringify(data) }) : JSON.stringify(data),
      headers: {
        "Content-Type": "application/javascript"
      },
      onload: function (response) {
        resolve(response);
      },
      onerror: function (response) {
        reject(response);
      }
    });
  });
};

const GM_API = {
  ...GM,
  GM_setValue: setValue,
  GM_getValue: getValue,
  GM_xmlhttpRequestPOST: xmlhttpRequestPOST,
  GM_xmlhttpRequestGet: xmlhttpRequestGet
};

export default GM_API;
