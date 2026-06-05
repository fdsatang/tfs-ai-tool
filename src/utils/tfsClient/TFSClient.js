import config from "./config.js";

// TFS API 客户端
class TFSClient {
  constructor() {
    this.serverUrl = config.serverUrl.replace(/\/$/, "");
    this.apiVersion = config.apiVersion;
    this.pat = config.pat;
  }

  /**
   * 获取 Basic Auth 认证头
   * TFS 使用 Basic Auth，username 为空，password 为 PAT
   */
  getAuthHeader() {
    const credentials = ":" + this.pat;
    return "Basic " + btoa(credentials);
  }

  /**
   * 发送 HTTP 请求
   * @param {string} url - 请求 URL
   * @param {string} method - HTTP 方法
   * @param {object|null} data - 请求体数据
   * @param {object} headers - 额外的请求头
   */
  async request(url, method, data = null, headers = {}) {
    const defaultHeaders = {
      Authorization: this.getAuthHeader(),
      Accept: "application/json"
    };

    const options = {
      method,
      headers: { ...defaultHeaders, ...headers }
    };

    if (data !== null) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    let responseBody;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = responseBody;
      throw error;
    }

    return responseBody;
  }

  // ! 获取工作项
  // @param {number|string} workItemId - 工作项 ID
  async getWorkItem(workItemId) {
    const url = `${this.serverUrl}/_apis/wit/workitems/${workItemId}?api-version=${this.apiVersion}`;
    return this.request(url, "GET");
  }

  /**
   * 更新工作项（通用方法）
   * @param {number|string} workItemId - 工作项 ID
   * @param {object[]} document - JSON Patch 文档
   */
  async updateWorkItem(workItemId, document) {
    const url = `${this.serverUrl}/_apis/wit/workitems/${workItemId}?api-version=${this.apiVersion}`;
    return this.request(url, "PATCH", document, {
      "Content-Type": "application/json-patch+json"
    });
  }
}

export default TFSClient;
