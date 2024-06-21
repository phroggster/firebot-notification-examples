import {
  EVENTS_SOURCE_ID,
  EVENTS_SOURCE_NAME,
} from "../consts";
import { modules } from "../script-modules";
import activityAlert from "./activity-alert";

export const eventsSource = {
  id: EVENTS_SOURCE_ID,
  name: EVENTS_SOURCE_NAME,
  events: [
    activityAlert,
  ],
};

export function registerEvents() {
  try {
    modules.eventManager.registerEventSource(eventsSource);
  }
  catch (anyError) {
    const error = anyError as Error;
    modules.logger.error("Error while registering event source: likely already registered, or script was relaoded; skipping: ", error.message);
  }
}
