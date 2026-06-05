// 拖拽的指令
const color = {
  beforeMount(el: any, binding:any) {
    const wrapDom = el
    const path = el.querySelector("path")
    wrapDom.onmouseenter = function(){
      path.style.fill = binding.value ? "#c00" : "rgb(0, 101, 179)"
    }
    wrapDom.onmouseleave = function(){
      path.style.fill = binding.value ? "#ffe6e6" :"#C7CBCF"
    }
  }
}
// 挂载，注册
const directives = {
  install: function (app: any) {
    app.directive('color', color)
  }
};
export default directives;
