import { Message, TextChannel } from 'discord.js';
import { MessageContent } from '../Interfaces';

export class MessageUtils {
  public static async send(
    channel: TextChannel,
    content: MessageContent
  ): Promise<Message | undefined> {
    if (channel.isTextBased()) {
      const payload = {
        ...(content.content !== undefined && { content: content.content }),
        ...(content.embeds !== undefined && { embeds: [...content.embeds] }),
        ...(content.components !== undefined && {
          components: [...content.components]
        })
      };

      const sentMessage = await channel.send(payload);

      const fetchedMessage = await sentMessage.fetch();
      return fetchedMessage;
    } else {
      throw new Error('Channel is not a text channel');
    }
  }
}
