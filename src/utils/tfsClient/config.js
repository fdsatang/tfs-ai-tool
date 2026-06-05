import $ from "../../gmTool/index.ts";

const { DB } = $;

const config = {
  // TFS 服务器地址（集合级别）
  serverUrl: "http://tfs2018-web.winning.com.cn:8080/tfs/WINNING-6.0",
  // API 版本
  apiVersion: "4.1",
  // 获取方式：登录 TFS -> 右上角头像 -> 安全 -> 添加个人访问令牌
  pat: DB.tfsClientMeta.get()?.pat || ""
};

export default config;
