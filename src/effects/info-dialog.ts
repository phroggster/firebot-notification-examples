import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import {
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
  INFO_DIALOG_EFFECT_ID,
} from "../consts";
import { modules } from "../script-modules";
import { MessageEffectModel } from "../types";

const infoDialogEffectType: Effects.EffectType<MessageEffectModel> = {
  definition: {
    id: `${EFFECTS_SOURCE_ID}:${INFO_DIALOG_EFFECT_ID}`,
    name: `${EFFECTS_SOURCE_NAME}: Info Dialog`,
    description: "Shows a modal information dialog in the main Firebot window",
    icon: "fad fa-microphone-alt",
    categories: ["scripting"],
    dependencies: []
  },
  optionsTemplate: `
    <eos-container header="Description">
      <p class="muted">Displays a modal informational dialog atop the Firebot window that requires manual dismissal. This provides for an exceedingly poor user experience.</p>
    </eos-container>
    
    <eos-container header="Info Dialog" pad-top="true">
      <textarea ng-model="effect.message" class="form-control" name="text" placeholder="Enter information dialog message (markdown *may* be supported)" rows="4" cols="40" replace-variables></textarea>
    </eos-container>
    `,
  optionsController: () => { },
  optionsValidator: (effect) => {
    const errors = [];
    if (effect.message == null || effect.message === "") {
      errors.push("Info dialog message can not be empty");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    await modules.frontendCommunicator.send("info", event.effect.message);
    return { success: true };
  }
};

export default infoDialogEffectType;
