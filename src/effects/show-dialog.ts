import { EffectScope, Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import {
  SHOW_DIALOG_EFFECT_ID,
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
} from "../consts";
import { modules } from "../script-modules";
import { DialogType, ShowDialogModel } from "../types";

// TODO: this effect is a work-in-progress, and *DOES* *NOT* *WORK*. It's not currently being loaded, and exists here more as an idea for the time being.
// We _can_ get dialogs from Electron *somehow* (not that it's *much* better than info-dialog nor warning-dialog) I just don't want to import Electron to do it...

type Scope = EffectScope<ShowDialogModel> & {
  dialogTypes: Array<string>,

  selectEffectType: (type: string) => void,
  beautifyDialogType: (type: string) => string,
};
interface MessageBoxReturnValue {
  response: number;
}
interface DialogModal {
  message: string;
  title?: string;
  type?: DialogType;
  buttons?: Array<string>;
  defaultId?: number;
  signal?: unknown;
  detail?: string;
}
interface Dialog {
  showMessageBox: (browserWindow: Window, options: DialogModal) => Promise<MessageBoxReturnValue>;
}
interface WebContents {
  dialog: Dialog;
  send: (channel: string, ...args: unknown[]) => void;
}
interface Window {
  dialog: Dialog;
  webContents: WebContents;
}

const showDialogEffectType: Effects.EffectType<ShowDialogModel> = {
  definition: {
    id: `${EFFECTS_SOURCE_ID}:${SHOW_DIALOG_EFFECT_ID}`,
    name: `${EFFECTS_SOURCE_NAME}: Show Dialog`,
    description: "Shows a modal dialog in the main Firebot window",
    icon: "fad fa-microphone-alt",
    categories: ["scripting"],
    dependencies: []
  },
  optionsTemplate: `
    <eos-container header="Description">
      <p class="muted">Under testing: displays a modal customized dialog</p>
    </eos-container>
    
    <eos-container header="Title">
      <textarea ng-model="effect.title" class="form-control" name="title" placeholder="Enter dialog title" rows="1" cols="40" replace-variables menu-position="under" style="margin-bottom: 10px"></textarea>
    </eos-container>
    
    <eos-container header="Text">
      <textarea ng-model="effect.message" class="form-control" name="text" placeholder="Enter dialog message text" rows="4" cols="40" replace-variables menu-position="under" style="margin-bottom: 10px"></textarea>
    </eos-container>
    
    <eos-container header="Type">
      <div class="btn-group">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="list-effect-type">{{effect.dialogType ? beautifyDialogType(effect.dialogType) : 'Select one'}}</span>
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li ng-repeat="dialogType in dialogTypes" ng-click="selectEffectType(dialogType)">
            <a href>{{dialogType}}</a>
          </li>
        </ul>
      </div>
    </eos-container>
    `,
  optionsController: ($scope: Scope) => {
    $scope.dialogTypes = ['None', 'Question', 'Info', 'Warning', 'Error'];

    $scope.beautifyDialogType = (type: string): string => {
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    };
    $scope.selectEffectType = (type: string): void => {
      $scope.effect.dialogType = type.toLowerCase() as DialogType;
    };


    if ($scope.effect == null) {
      $scope.effect = {
        message: "",
        title: undefined,
        dialogType: undefined,
        buttons: undefined,
        defaultId: undefined,
      }
    }
    if (!$scope.effect.message) {
      $scope.effect.message = "";
    }
    //if (!$scope.effect.title) {
    //    $scope.effect.title = "Dialog Title";
    //}
    //if (!$scope.effect.dialogType) {
    //    $scope.effect.dialogType = "none";
    //}
    //if (!$scope.effect.buttons || $scope.effect.buttons.length < 1) {
    //    $scope.effect.buttons = ["OK", "Cancel"];
    //}
  },
  optionsValidator: (effect) => {
    const errors = [];
    if (effect.message == null || effect.message === "") {
      errors.push("Dialog message text can not be empty");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    const { /*frontendCommunicator,*/ logger } = modules;
    logger.debug(`Attempting to display ${event.effect.dialogType} dialog titled "${event.effect.title}": `, event.effect.message);

    // https://www.electronjs.org/docs/latest/api/dialog#dialogshowmessageboxbrowserwindow-options
    const window = renderWindow as Window;
    const { effect } = event;

    // logger.debug("renderWindow is: ", JSON.stringify(renderWindow));
    //// { "_events": { "blur": [null, null], "focus": [null, null, null], "show": [null, null], "minimize": [null, null], "restore": [null, null], "close": [null, null], "closed": [null, null] }, "_eventsCount": 13, "devToolsWebContents": { "_windowOpenHandler": null, "ipc": { "_events": { }, "_eventsCount": 1, "_invokeHandlers": { } }, "_events": { "render-process-gone": [null, null] }, "_eventsCount": 9 } }
    // logger.debug("renderWindow.webcontents is: ", JSON.stringify((renderWindow as any).webContents));
    //// {"ipc":{"_events":{},"_eventsCount":1,"_invokeHandlers":{}},"_events":{"render-process-gone":[null,null]},"_eventsCount":13}

    //logger.debug("dialog is: ", JSON.stringify((renderWindow as any).dialog));
    //   [empty, null, undefined, etc.]
    //logger.debug("webcontents.dialog is: ", JSON.stringify(((renderWindow as any).webContents as any).dialog));
    //   [empty, null, undefined, etc.]

    try {
      // This does not work...
      //frontendCommunicator.send("dialog", effect);

      // TODO: This also does not work. There's another way into this; find it...
      await window.webContents.dialog.showMessageBox(window, {
        message: effect.message,
        title: effect.title,
        type: effect.dialogType,
      });
      return { success: true };
    }
    catch (anyError) {
      const error = anyError as Error;
      if (error) {
        logger.error(`Error while triggering custom dialog ${error.name}: `, error.message);
      } else {
        logger.error("Unknown error while triggering custom dialog: ", JSON.stringify(anyError));
      }
      return { success: false };
    }
  }
};

export default showDialogEffectType;
