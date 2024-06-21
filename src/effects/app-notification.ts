import { Effects, EffectScope } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { v4 as uuid } from "uuid";
import {
  APP_NOTIFICATION_EFFECT_ID,
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
} from "../consts";
import { modules } from "../script-modules";
import { NotificationModel, NotificationSource, NotificationType } from "../types";

interface Scope extends EffectScope<NotificationModel> {
  /** The beautified (capitalized) display names of the NotificationType enum values. */
  notificationTypes: Array<string>,

  /** Capitalizes the first letter of the string value provided, and lower-cases the remainder. */
  beautifyNotificationType: (plainType: string) => string,
  /** Converts the string value provided (one from notificationTypes) into a NotificationType, and stores it in $scope.effect. */
  selectNotificationType: (beautifiedType: string) => void,
}

const appNotificationEffectType: Effects.EffectType<NotificationModel> = {
  definition: {
    id: `${EFFECTS_SOURCE_ID}:${APP_NOTIFICATION_EFFECT_ID}`,
    name: `${EFFECTS_SOURCE_NAME}: App Notification`,
    description: "Adds an application notification, 'ringing' the bell in the top-right of the application",
    icon: "fad fa-microphone-alt",
    categories: ["scripting"],
    dependencies: []
  },
  optionsTemplate: `
    <eos-container header="Description">
      <p class="muted">Adds a notification to the Firebot notifications feed on the right of the main window</p>
    </eos-container>
    
    <eos-container header="Title">
      <textarea ng-model="effect.title" class="form-control" name="title" placeholder="Enter notification title" rows="1" cols="40" replace-variables menu-position="under" style="margin-bottom: 10px"></textarea>
    </eos-container>
    
    <eos-container header="Text">
      <textarea ng-model="effect.message" class="form-control" name="text" placeholder="Enter notification message text" rows="2" cols="40" replace-variables menu-position="under" style="margin-bottom: 10px"></textarea>
    </eos-container>
    
    <eos-container header="Type">
      <div class="btn-group">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span class="list-effect-type">{{effect.notificationType ? beautifyNotificationType(effect.notificationType) : 'Select One'}}</span>
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li ng-repeat="notificationType in notificationTypes" ng-click="selectNotificationType(notificationType)">
            <a href>{{notificationType}}</a>
          </li>
        </ul>
      </div>
    </eos-container>
    `,
  optionsController: ($scope: Scope) => {
    $scope.notificationTypes = ['Alert', 'Info', 'Tip', 'Update'];

    $scope.beautifyNotificationType = (type: string): string => {
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    };
    $scope.selectNotificationType = (type: string): void => {
      $scope.effect.notificationType = type.toLowerCase() as NotificationType;
    };

    if ($scope.effect == null) {
      $scope.effect = {
        message: "",
        title: "",
      };
    }
    if (!$scope.effect.message) {
      $scope.effect.message = "";
    }
    if (!$scope.effect.title) {
      $scope.effect.title = "";
    }
  },
  optionsValidator: (effect) => {
    const errors = [];
    if (effect.title == null || effect.title == undefined || effect.title === "") {
      errors.push("Notification title can not be blank");
    }
    if (effect.message == null || effect.message == undefined || effect.message === "") {
      errors.push("Notification message can not be blank");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    const { effect } = event;
    const { logger } = modules;

    try {
      modules.frontendCommunicator.send('new-notification', {
        message: effect.message,
        title: effect.title,
        type: effect.notificationType || NotificationType.INFO,
        source: effect.source || NotificationSource.EXTERNAL,
        externalId: effect.externalId,

        id: uuid(),
        timestamp: new Date(),
        read: false,
        saved: false,
      });
      return { success: true };
    }
    catch (anyError) {
      const error = anyError as Error;
      logger.error(`Error while submitting notification: ${error.name}: `, error.message);
      return { success: false };
    }
  }
}

export default appNotificationEffectType;
