export class DatabaseConnectionFailure extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseConnectionFailure.prototype);
    this.name = 'DatabaseConnectionFailure';
  }
}

export class DatabaseError extends Error {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
    this.name = 'DatabaseError';
  }
}

export class ChannelNotFoundError extends Error {
  private readonly channelId: string;

  constructor(message: string, channelId: string) {
    super(message);
    Object.setPrototypeOf(this, ChannelNotFoundError.prototype);
    this.name = 'ChannelNotFoundError';
    this.channelId = channelId;
  }
}
