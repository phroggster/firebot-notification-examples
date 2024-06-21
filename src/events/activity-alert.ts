import { ActivityAlertEventDefinition } from "../types";
import { ACTIVITY_ALERT_EVENT_ID } from "../consts";

const activityAlert: ActivityAlertEventDefinition = {
  id: ACTIVITY_ALERT_EVENT_ID,
  name: "Activity Alert",
  description: "An event to allow for custom elements to appear in the activity feed",
  manualMetadata: {
    icon: "far fa-info-circle",
    message: "Example activity feed message"
  },
  activityFeed: {
    // This icon value will be manually modified whenever the linked effect (../effects/activity-alert) triggers this event.
    icon: "far fa-info-circle",
    getMessage: (eventData) => {
      return eventData.message;
    }
  }
}

export default activityAlert;
