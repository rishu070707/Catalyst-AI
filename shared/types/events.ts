export type EventStatus =
  | 'SENT'
  | 'DELIVERED'
  | 'FAILED'
  | 'OPENED'
  | 'READ'
  | 'CLICKED'
  | 'PURCHASED';

export interface CommunicationEvent {
  recipient: string;
  message: string;
  channel: string;
  missionId: string;
  customerId: string;
}

export interface ReceiptPayload {
  idempotencyKey: string;
  missionId: string;
  customerId: string;
  channel: string;
  status: EventStatus;
  timestamp: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
}
