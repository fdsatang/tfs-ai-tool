import TFSClient from "./TFSClient.js";

class TagsUtils {
  // !解析标签字符串为数组 => tagsStr - 标签字符串，格式：'标签1;标签2;标签3'
  static parse(tagsStr) {
    if (!tagsStr || typeof tagsStr !== "string") {
      return [];
    }
    return tagsStr
      .split(";")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  // 合并标签数组，去除重复（忽略大小写）=> existingTags:现有标签数组 ; newTags:新标签数组
  static merge(existingTags, newTags) {
    // 转换为小写集合，用于快速查找
    const existingSet = new Set(existingTags.map((tag) => tag.toLowerCase()));
    // 过滤掉已存在的标签（忽略大小写）
    const uniqueNewTags = newTags.filter((tag) => !existingSet.has(tag.toLowerCase()));
    // 合并并返回字符串
    return [...existingTags, ...uniqueNewTags].join(";");
  }
}

// TFS Tag 管理类
class TFSTagClient extends TFSClient {
  // !更新工作项的标签 => workItemId - 工作项 ID ; newTags - 新标签，多个标签用分号分隔，如 '标签1;标签2' ; comment - 可选的变更注释
  async updateTags(workItemId, newTags, errorMessage) {
    //  查询工作项内容
    const workItem = await this.getWorkItem(workItemId);
    // 获取任务类型
    const workType = workItem?.fields?.["System.WorkItemType"];
    // 获取现有标签字符串
    const existingTagsStr = workItem.fields?.["System.Tags"] || "";
    // 解析现有标签
    const existingTags = TagsUtils.parse(existingTagsStr);
    // 解析新标签
    const newTagsArray = TagsUtils.parse(newTags);
    // 合并标签
    const mergedTagsStr = TagsUtils.merge(existingTags, newTagsArray);
    if (newTags === "AI-BUG-FIX" && workType !== "Bug") {
      errorMessage(`只有bug任务可以进行此标记哦~`);
      return {
        success: false,
        workItemId,
        existingTags,
        newTags: newTagsArray,
        mergedTags: mergedTagsStr
      };
    }
    if (existingTags.includes(newTags)) {
      errorMessage(`此标签已存在!请删除后再添加`);
      return {
        success: false,
        workItemId,
        existingTags,
        newTags: newTagsArray,
        mergedTags: mergedTagsStr
      };
    }

    // ====== 构造 JSON Patch 文档 ======
    const document = [
      {
        op: "add",
        path: "/fields/System.Tags",
        value: mergedTagsStr
      }
    ];
    // ====== 发送更新请求 ======
    // 接口：PATCH /_apis/wit/workitems/{workItemId}?api-version=4.1
    const result = await this.updateWorkItem(workItemId, document);

    return {
      success: true,
      workItemId,
      existingTags,
      newTags: newTagsArray,
      mergedTags: mergedTagsStr,
      revision: result.rev
    };
  }

  // !替换工作项的全部标签（不保留现有标签） => workItemId - 工作项 ID ; tags - 标签字符串 ; comment - 可选的变更注释
  async replaceTags(workItemId, tags) {
    const document = [
      {
        op: "add",
        path: "/fields/System.Tags",
        value: tags
      }
    ];
    // if (comment) {
    //   document.push({
    //     op: "add",
    //     path: "/fields/System.History",
    //     value: comment
    //   });
    // }
    return await this.updateWorkItem(workItemId, document);
  }

  // !移除工作项的全部标签 => workItemId - 工作项 ID ; comment - 可选的变更注释
  async removeTags(workItemId, comment = null) {
    return this.replaceTags(workItemId, "", comment);
  }
}

export default TFSTagClient;
