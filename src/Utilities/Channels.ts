import {
  Channel,
  Client,
  TextChannel,
  TextChannelResolvable
} from 'discord.js';
import { ChannelNotTextChannelError, Nullish } from '../../lib';

export class ChannelUtils {
  public static async fetchText(
    client: Client,
    channelId: TextChannelResolvable
  ): Promise<TextChannel> {
    if (channelId instanceof TextChannel) {
      return channelId;
    }

    let channel: Nullish<Channel> = client.channels.cache.get(channelId);

    if (!channel) {
      channel = await client.channels.fetch(channelId);
    }

    if (channel instanceof TextChannel) {
      return channel;
    }

    throw new ChannelNotTextChannelError('Channel not found', channelId);
  }
}
