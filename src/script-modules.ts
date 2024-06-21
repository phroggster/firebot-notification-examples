import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";

/** The ScriptModules available for us to use. Provides the majority of interaction capabilities to our Firebot host. */
export let modules: ScriptModules;

export function registerModules(newModules: ScriptModules) {
	modules = newModules;
}
