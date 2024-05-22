import { Message, TextChannel } from 'discord.js';
import { MessageContent } from '../../lib';

export class MessageUtils {
  public static async send(
    channel: TextChannel,
    content: MessageContent
  ): Promise<Message> {
    const payload = {
      ...(content.content !== undefined && { content: content.content }),
      ...(content.embeds !== undefined && { embeds: [...content.embeds] }),
      ...(content.components !== undefined && {
        components: [...content.components]
      })
    };

    const sentMessage = await channel.send(payload);
    return sentMessage;
  }
}
