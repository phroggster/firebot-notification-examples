import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import {
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
  ERROR_DIALOG_EFFECT_ID,
} from "../consts";
import { modules } from "../script-modules";
import { MessageEffectModel } from "../types";

// Displays a modal error dialog box that blocks access to the Firebot UI until it gets dismissed.
const errorDialogEffectType: Effects.EffectType<MessageEffectModel> = {
  definition: {
    id: `${EFFECTS_SOURCE_ID}:${ERROR_DIALOG_EFFECT_ID}`,
    name: `${EFFECTS_SOURCE_NAME}: Error Dialog`,
    description: "Shows a modal error dialog in the main Firebot window",
    icon: "fad fa-microphone-alt",
    categories: ["scripting"],
    dependencies: []
  },
  optionsTemplate: `
    <eos-container header="Description">
      <p class="muted">Displays a modal error dialog atop the Firebot window that requires manual dismissal. This effect provides for an exceedingly poor user experience.</p>
    </eos-container>
    <eos-container header="Error Dialog" pad-top="true">
      <textarea ng-model="effect.message" class="form-control" name="text" placeholder="Enter error dialog message (markdown *may* be supported)" rows="4" cols="40" replace-variables></textarea>
    </eos-container>
    `,
  optionsController: () => { },
  optionsValidator: (effect) => {
    const errors = [];
    if (effect.message == null || effect.message === "") {
      errors.push("Error dialog message can not be empty");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    const { logger } = modules;

    try {
      await modules.frontendCommunicator.send("error", event.effect.message);
      return { success: true };
    }
    catch (anyError) {
      const error = anyError as Error;
      if (error) {
        logger.error(`Error while triggering error dialog ${error.name}: `, error.message);
      } else {
        logger.error("Unknown error while triggering error dialog: ", JSON.stringify(anyError));
      }
      return { success: false };
    }
  }
};

export default errorDialogEffectType;
