import { Client, TextChannel, TextChannelResolvable } from 'discord.js';
import { ChannelNotFoundError } from '../../lib';

export class ChannelUtils {
  public static async fetch(
    client: Client,
    channelId: TextChannelResolvable
  ): Promise<TextChannel> {
    if (channelId instanceof TextChannel) {
      return channelId;
    }

    const channel = client.channels.fetch(channelId) as Promise<TextChannel>;

    if (channel instanceof TextChannel) {
      return channel;
    }

    throw new ChannelNotFoundError('Channel not found', channelId);
  }
}
