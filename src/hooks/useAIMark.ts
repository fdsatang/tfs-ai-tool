import TFSTagClient from "../utils/tfsClient/TFSTagClient";
import useMessage from "../hooks/useMessage";
const useAIMark = () => {
  const { error, success } = useMessage();
  const client = new TFSTagClient();

  const tag = {
    bug: "AI-BUG-FIX",
    coding: "AI-CODING",
    check: "AI-PR-CHECK"
  };

  // ! 获取页面工作项id
  const getPageWorkItemID = async () => {
    // 从url参数中获取工作项id
    const urlParams = new URLSearchParams(window.location.search);
    const workItemID = urlParams.get("id");
    if (!workItemID) {
      const el = Array.from(document.querySelectorAll(".work-item-view .work-item-form-id > span")).find(
        (span) => window.getComputedStyle(span.closest(".work-item-view")).display !== "none"
      );
      return el ? el.textContent.trim() : "";
    }
    return workItemID;
  };

  // ! 标记任务或需求
  const mark = async (type: string) => {
    const menu = document.querySelector(".right-menu-bar .profile.menu-item");
    const taskOwner = document.querySelector(".identity-picker-resolved-name.text-cursor")?.textContent.trim() || "";
    if (menu && taskOwner) {
      const workItemName = menu?.getAttribute("aria-label")?.match(/\((.*?)\)/)?.[1] || "";
      if (!taskOwner.includes(workItemName)) {
        return error("暂不允许操作非本人的任务!");
      }
    }
    const workItemID = await getPageWorkItemID();
    if (!workItemID) {
      return error("任务号或需求号获取失败!");
    }
    try {
      const res = await client.updateTags(workItemID, tag[type], error);
      if (res.success) {
        success("标记成功!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      confirm("TFS 令牌识别失败!请刷新页面,并更新令牌重试");
    }
  };

  return {
    mark
  };
};

export default useAIMark;
