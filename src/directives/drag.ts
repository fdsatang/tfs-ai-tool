import $ from "../gmTool/index";

const { DB } = $;

// 拖拽的指令
const directive = {
	beforeMount(el: any) {
		// 获取当前元素
		const dragBox = el;
		// 获取移动区域
		const dragArea = el.getElementsByClassName("v-drag-handle").length > 0 ? el.getElementsByClassName("v-drag-handle")[0] : el;
		// body可见区域宽度
		const bodyWidth = document.body.clientWidth;
		// body可见区域高度
		const bodyHight = document.documentElement.clientHeight;
		dragArea.onmousedown = (e: any) => {
			// const dragBoxWidth = dragBox.clientWidth + "px"
			// 元素距离屏幕左侧的距离
			let domLeft = dragBox.offsetLeft;
			// 元素距离屏幕顶部的距离
			let domTop = dragBox.offsetTop;
			e.preventDefault();
			e.stopPropagation();
			// 算出鼠标相对元素的位置
			let mouseX = e.clientX - domLeft;
			let mouseY = e.clientY - domTop;
			// 元素宽度
			const domWidth = dragBox.offsetWidth;
			// 元素高度
			const domHeight = dragBox.offsetHeight;
			document.onmousemove = (e) => {
				// 防止某些情况拖动时长度失效
				// dragBox.style.width = dragBoxWidth
				//用鼠标的位置减去鼠标相对元素的位置，得到元素的中心位置
				let domCenterLeft = e.clientX - mouseX;
				let domCenterTop = e.clientY - mouseY;
				//移动当前元素
				dragBox.style.left = domCenterLeft + "px";
				dragBox.style.top = domCenterTop + "px";
				domLeft = dragBox.offsetLeft;
				domTop = dragBox.offsetTop;
				// 元素距离右侧距离 body - 元素宽度 - 元素左侧距离
				let domRight = bodyWidth - domLeft - domWidth;
				let domBottom = bodyHight - domHeight - domTop;
				if (domRight <= 0) {
					dragBox.style.left = bodyWidth - domWidth + "px";
				}
				if (domBottom < 0) {
					dragBox.style.top = bodyHight - domHeight + "px";
				}
				if (domLeft < 0) {
					dragBox.style.left = 0;
				}
				if (domTop < 0) {
					dragBox.style.top = 0;
				}
			};
			document.onmouseup = (e) => {
				e.preventDefault();
				//鼠标弹起来的时候不再移动
				document.onmousemove = null;
				//预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
				document.onmouseup = null;
				DB.positionMeta.set({ top: dragBox.offsetTop, left: dragBox.offsetLeft });
			};
		};
	}
};
// 挂载，注册
const drag = {
	install: function (app: any) {
		app.directive("drag", directive);
	}
};
export default drag;
