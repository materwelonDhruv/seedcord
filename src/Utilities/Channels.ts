import { Guild, Message, TextChannel } from 'discord.js';
import { MessageContent } from '../Interfaces';

export class ChannelUtils {
  public static async channelSendMessage(
    guild: Guild | null,
    channel: TextChannel,
    content: MessageContent
  ): Promise<Message | undefined> {
    if (!guild) {
      throw new Error('Guild not found');
    }

    const guildChannel = await guild?.channels.fetch(channel.id);

    if (guildChannel?.isTextBased()) {
      const payload = {
        ...(content.content !== undefined && { content: content.content }),
        ...(content.embeds !== undefined && { embeds: [...content.embeds] }),
        ...(content.components !== undefined && {
          components: [...content.components]
        })
      };

      const sentMessage = await guildChannel.send(payload);

      const fetchedMessage = await sentMessage.fetch();
      return fetchedMessage;
    } else {
      throw new Error('Channel is not a text channel');
    }
  }
}
