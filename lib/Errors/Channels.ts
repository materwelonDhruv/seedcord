// Errors
export class ChannelNotFoundError extends Error {
  private readonly channelId: string;

  constructor(message: string, channelId: string) {
    super(message);
    Object.setPrototypeOf(this, ChannelNotFoundError.prototype);
    this.name = 'ChannelNotFoundError';
    this.channelId = channelId;
  }
}

export class ChannelNotTextChannelError extends Error {
  private readonly channelId: string;

  constructor(message: string, channelId: string) {
    super(message);
    Object.setPrototypeOf(this, ChannelNotTextChannelError.prototype);
    this.name = 'ChannelNotTextChannelError';
    this.channelId = channelId;
  }
}
