// 拖拽的指令
const icon = {
  beforeMount(el: any, binding:any) {
    if( typeof binding.value === "string"){
      el.innerHTML = binding.value
    }else{
      const code = binding.value[0]
      const color = binding.value[1]
      el.innerHTML = color ? code.replace(/fill=".*"/,`fill="${color}"`) : code
    }
  }
}
// 挂载，注册
const directives = {
  install: function (app: any) {
    app.directive('icon', icon)
  }
};
export default directives;
