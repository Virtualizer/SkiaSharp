﻿/// <reference path="../../../externals/typescript/types/emscripten/index.d.ts" />

namespace SkiaSharp {
	declare type MemberMap = { [name: string]: string };

	export class SkiaApi {
		private static createJsMethod(monoMethod: Function): Function {
			return (...args: any[]): any => {
				return monoMethod.apply(undefined, args)
			};
		}
		public static bindMembers(type: string, members: MemberMap): any[] {
			let ptrs: any[] = [];
			for (let member in members) {
				let monoMethod: Function = (<any>Module).mono_bind_static_method(`${type}:${member}`);
				let jsMethod = SkiaApi.createJsMethod(monoMethod);
				let wasmMethod = (<any>Module).addFunction(jsMethod, members[member]);
				ptrs.push(wasmMethod);
			}
			return ptrs;
		}
	}
}