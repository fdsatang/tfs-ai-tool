import { render, createVNode, Component, VNode } from "vue";

const createInstanceWrap = (container: HTMLElement, component: Component, componentProps?: Record<string, any>, prepend = false) => {
  const vm = createVNode(component, componentProps);
  const tempContainer = document.createElement("div");
  render(vm, tempContainer);

  if (prepend && container.firstChild) {
    container.insertBefore(tempContainer.firstElementChild as Node, container.firstChild);
  } else {
    container.appendChild(tempContainer.firstElementChild as Node);
  }

  return { vm };
};

export { createInstanceWrap };
