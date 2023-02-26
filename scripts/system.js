import { system } from "@minecraft/server";

system.events.beforeWatchdogTerminate.subscribe(e => {
	e.cancel = true;
	console.warn("[WatchDogError] " + e.terminateReason);
});