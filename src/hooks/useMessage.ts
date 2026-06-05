import MessageComponent from "../components/Message.vue";
import { createVNode, render } from "vue";

const useMessage = () => {
  const info = (tip: string, type: string) => {
    const container = document.createElement("div");
    const props = {
      tip,
      type,
      onClose: () => {
        render(null, container);
      }
    };
    const vm = createVNode(MessageComponent, props);
    render(vm, container);
    document.body.appendChild(container.firstElementChild!);
    return container;
  };
  const messageActive = (tip: string, type: "error" | "warning" | "success", time?: number) => {
    const instance = info(tip, type);
    setTimeout(() => {
      render(null, instance);
    }, time || 2000);
  };
  const Message = {
    error: (tip: string, time?: number) => messageActive(tip, "error", time || 2500),
    warning: (tip: string, time?: number) => messageActive(tip, "warning", time || 2500),
    success: (tip: string, time?: number) => messageActive(tip, "success", time || 2500)
  };
  return Message;
};

export default useMessage;
