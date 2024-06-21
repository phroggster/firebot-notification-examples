export interface MessageEffectModel extends Record<string, unknown> {
  message: string;
}

export enum NotificationSource {
  EXTERNAL = "external",
  INTERNAL = "internal"
}
export enum NotificationType {
  INFO = "info",
  TIP = "tip",
  UPDATE = "update",
  ALERT = "alert"
}
export interface NotificationModel extends Record<string, unknown> {
  message: string;
  title: string;
  notificationType?: NotificationType;
  source?: NotificationSource;
  externalId?: string;
}

export interface ActivityFeedModel extends MessageEffectModel {
  message: string;
  icon?: string;
}

export interface EventDefinition extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  cached?: boolean;
  manualMetadata: Record<string, unknown>;
}

export interface ActivityAlertEventDefinition extends EventDefinition {
  activityFeed: Record<string, unknown> & {
    getMessage: (eventData: ActivityFeedModel) => string;
    icon: string;
  };
  manualMetadata: ActivityFeedModel;
}

export type DialogType = 'none' | 'question' | 'info' | 'warning' | 'error';

export interface ShowDialogModel extends Record<string, unknown> {
  message: string;
  title?: string;
  dialogType?: DialogType;
  buttons?: Array<string>;
  defaultId?: number;
  signal?: unknown;
  detail?: string;
}
