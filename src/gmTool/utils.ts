import $ from "./index";
import { MetaBase, GmMetaList } from "./types";

export function getDBData(metaBaseList: MetaBase[]): GmMetaList {
	const get = (meta: MetaBase) => {
		let gmValue = $.GM_getValue(meta.name, undefined);
		try {
			if (gmValue == undefined) return meta.defaultValue;
			return JSON.parse(gmValue);
		} catch (e) {
			return meta.defaultValue;
		}
	};
	const set = (meta: MetaBase, value: any) => {
		$.GM_setValue(meta.name, JSON.stringify(value));
	};
	const gmMetaList: GmMetaList = {};
	metaBaseList.forEach((meta) => {
		gmMetaList[meta.name] = {
			get: () => get(meta),
			set: (value: any) => set(meta, value),
			name: meta.name
		};
	});
	return gmMetaList;
}
