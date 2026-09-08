// discord requires the first ack within 3s. both transports import this so their windows cannot drift.
export const DRAIN_WINDOW_MS = 5000;
