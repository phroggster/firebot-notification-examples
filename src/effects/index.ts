import { modules } from "../script-modules";

import activityAlert from "./activity-alert";
import appNotification from "./app-notification";
import chatAlert from "./chat-alert";
import errorDialog from "./error-dialog";
import infoDialog from "./info-dialog";
//import showDialog from "./show-dialog";

const effects = [
  activityAlert,
  appNotification,
  chatAlert,
  errorDialog,
  infoDialog,
  // showDialog,
];

export function registerEffects() {
  for (const effect of effects) {
    try {
      modules.effectManager.registerEffect(effect);
    }
    catch (anyError) {
      const error = anyError as Error;
      modules.logger.warn(`Failed to register ${effect.definition.id} effect, skipping it… Error was "${error.message}"`);
    }
  }
};
