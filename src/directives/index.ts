import drag from "./drag";
const directive = {
	install: function (app: any) {
		app.use(drag);
	}
};
export default directive;
