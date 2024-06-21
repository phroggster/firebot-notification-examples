import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import {
  CHAT_ALERT_EFFECT_ID,
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
} from "../consts";
import { modules } from "../script-modules";
import { MessageEffectModel } from "../types";

interface WebContents {
  send: (channel: string, ...args: unknown[]) => void;
}
interface Window {
  webContents: WebContents;
}

// Mimics the firebot:chat-feed-alert effect, which shows an alert in the main chat feed if it's connected.
const chatAlertEffectType: Effects.EffectType<MessageEffectModel> = {
  definition: {
    id: `${EFFECTS_SOURCE_ID}:${CHAT_ALERT_EFFECT_ID}`,
    name: `${EFFECTS_SOURCE_NAME}: Chat Alert`,
    description: "Displays an alert in the chat box, queuing pending alerts until chat is connected",
    icon: "fad fa-microphone-alt",
    categories: ["scripting"],
    dependencies: []
  },
  optionsTemplate: `
    <eos-container header="Description">
      <p class="muted">Adds an alert to the Firebot chat feed without sending an actual chat message. This means that alerts are only visible to you. Additionally, this effect will not be shown until chat is connected.</p>
    </eos-container>
    <eos-container header="Alert Message" pad-top="true">
      <textarea ng-model="effect.message" class="form-control" name="text" placeholder="Enter alert message (markdown *may* be supported)" rows="4" cols="40" replace-variables></textarea>
    </eos-container>
    `,
  optionsController: () => { },
  optionsValidator: (effect) => {
    const errors = [];
    if (effect.message == null || effect.message === "") {
      errors.push("Alert message can't be blank");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    // const alertEffect = modules.effectManager.getEffectById<MessageEffectModel>("firebot:chat-feed-alert");
    // await alertEffect.onTriggerEvent(event);

    const { effect } = event;
    if (modules.twitchChat.chatIsConnected) {
      (renderWindow as Window).webContents.send("chatUpdate", {
        fbEvent: "ChatAlert",
        message: effect.message
      });
    } else {
      modules.twitchChat.once("connected", () => {
        (renderWindow as Window).webContents.send("chatUpdate", {
          fbEvent: "ChatAlert",
          message: effect.message
        });
      });
    }
    return {
      success: true,
      execution: {
        stop: false,
        bubbleStop: false,
      },
    };
  }
}

export default chatAlertEffectType;
