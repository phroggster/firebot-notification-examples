import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import {
  CHAT_ALERT_EFFECT_ID,
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
} from "../consts";
import { modules } from "../script-modules";
import { MessageEffectModel } from "../types";

type UpdatedTwitchChat = ScriptModules["twitchChat"] & {
  /** Whether or not the streamer is currently connected to chat. */
  get chatIsConnected(): boolean;
  /**
   * Adds a one-time listener function to the end of the listeners array for the event named eventName. The next time eventName is triggered, this listener is removed and then invoked.
   * @param eventName The name of the event.
   * @param listener The callback function.
   */
  once<ExpectedArgs extends Array<any> = [], ReturnPayload = void>( // eslint-disable-line @typescript-eslint/no-explicit-any
    eventName: string | symbol,
    listener: (...args: ExpectedArgs[]) => ReturnPayload
  ): UpdatedTwitchChat;
}
interface WebContents {
  send: (channel: string, ...args: unknown[]) => void;
}
interface Window {
  webContents: WebContents;
}

// Mimics the firebot:chat-feed-alert (src/backend/effects/builtin/chat-feed-alert.js) effect, which shows an alert in the main chat feed if chat is connected.
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
    const { effect } = event;
    const { logger } = modules;
    const twitchChat = modules.twitchChat as UpdatedTwitchChat;

    try {
      if (twitchChat.chatIsConnected) {
        // Fire the effect off immediately
        (renderWindow as Window).webContents.send("chatUpdate", {
          fbEvent: "ChatAlert",
          message: effect.message
        });
      } else {
        // Queue the effect up for after chat gets connected
        twitchChat.once("connected", () => {
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
    catch (anyError) {
      const error = anyError as Error;
      if (error) {
        logger.error(`Error while triggering chat alert ${error.name}: `, error.message);
      } else {
        logger.error("Unknown error while triggering chat alert: ", JSON.stringify(anyError));
      }
      return { success: false };
    }
  }
};

export default chatAlertEffectType;
