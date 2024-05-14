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

    const channel = await client.channels.fetch(channelId);

    if (channel instanceof TextChannel) {
      return channel;
    }

    throw new ChannelNotFoundError('Channel not found', channelId);
  }
}
