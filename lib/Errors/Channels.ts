// Errors
export class ChannelNotFoundError extends Error {
  public readonly channelId: string;

  constructor(message: string, channelId: string) {
    super(message);
    Object.setPrototypeOf(this, ChannelNotFoundError.prototype);
    this.name = 'ChannelNotFoundError';
    this.channelId = channelId;
  }
}

export class ChannelNotTextChannelError extends Error {
  public readonly channelId: string;

  constructor(message: string, channelId: string) {
    super(message);
    Object.setPrototypeOf(this, ChannelNotTextChannelError.prototype);
    this.name = 'ChannelNotTextChannelError';
    this.channelId = channelId;
  }
}
