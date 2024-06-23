import {
  EffectScope,
  Effects,
} from "@crowbartools/firebot-custom-scripts-types/types/effects";
// import moment from "moment";
// import { v4 as uuid } from "uuid";
import alertEvent from "../events/activity-alert";
import {
  ACTIVITY_ALERT_EFFECT_ID,
  EFFECTS_SOURCE_ID,
  EFFECTS_SOURCE_NAME,
} from "../consts";
import { eventsSource } from "../events";
import { modules } from "../script-modules";
import { ActivityFeedModel } from "../types";

// TODO: this effect is a work-in-progress, and I really should migrate to using frontendCommunicator:
//
//  modules.frontendCommunicator.send('event-activity', {
//    message: effect.message,
//    icon: effect.icon ?? defaultIcon,
//    acknowledged: false,
//    event: trigger.metadata.event ?? {
//      id: alertEvent.id,
//      name: alertEvent.name,
//    },
//    id: uuid(),
//    source: trigger.metadata.eventSource ?? {
//      id: eventsSource.id,
//      name: eventsSource.name,
//    },
//    timestamp: moment().format("H:mm"),
//  });


type Scope = EffectScope<ActivityFeedModel>;
const defaultIcon = "far fa-info-circle";

const activityEffectType: Effects.EffectType<ActivityFeedModel> = {
  definition: {
    id: `${EFFECTS_SOURCE_ID}:${ACTIVITY_ALERT_EFFECT_ID}`,
    name: `${EFFECTS_SOURCE_NAME}: Activity Alert`,
    description: "Adds an item to the Activity Feed on the right column of the main dashboard page of the application",
    icon: "fad fa-microphone-alt",
    categories: ["scripting"],
    dependencies: [],
  },
  optionsTemplate: `
    <eos-container header="Description">
      <p class="muted">Adds an item to the Activity Feed on the right side of the dashboard page of the application. Note that your activity feed must have the "Notification Examples"" source enabled in order for these alerts to appear.</p>
    </eos-container>
    
    <eos-container header="Text">
      <p class="muted">The text that the event message will display</p>
      <textarea ng-model="effect.message" class="form-control" name="text" placeholder="Enter notification message text" rows="2" cols="40" replace-variables menu-position="under" style="margin-bottom: 10px"></textarea>
    </eos-container>
    
    <eos-container header="Icon">
      <p class="muted">(<i>Optional</i>) A custom icon which allows you to identify your activity item.</p>
      <input ng-model="effect.icon" class="form-control" name="icon" maxlength="2" type="text" icon-picker></input>
    </eos-container>
    `,
  optionsController: ($scope: Scope) => {
    if ($scope.effect == null) {
      $scope.effect = {
        message: "",
        icon: defaultIcon,
      };
    }
    if (!$scope.effect.message) {
      $scope.effect.message = "";
    }
    if (!$scope.effect.icon) {
      $scope.effect.icon = defaultIcon;
    }
  },
  optionsValidator: (effect) => {
    const errors = [];
    if (effect.message == null || effect.message == undefined || effect.message === "") {
      errors.push("Activity feed message can not be blank");
    }
    return errors;
  },
  onTriggerEvent: async (event) => {
    const { effect } = event;
    const { logger } = modules;

    try {
      // Override the icon directly in the definition
      alertEvent.activityFeed.icon = effect.icon ?? defaultIcon;

      // Trigger the event directly, but this currently relies on my customized firebot-custom-scripts-types package
      await modules.eventManager.triggerEvent(eventsSource.id, alertEvent.id, effect);

      // And reset it to default after it's submitted
      alertEvent.activityFeed.icon = defaultIcon;

      return { success: true };
    }
    catch (anyError) {
      const error = anyError as Error;
      if (error) {
        logger.error(`Error while triggering activity alert ${error.name}: `, error.message);
      } else {
        logger.error("Unknown error while triggering activity alert: ", JSON.stringify(anyError));
      }
      return { success: false };
    }
  }
}

export default activityEffectType;
