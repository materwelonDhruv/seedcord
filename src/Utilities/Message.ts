import { Message, TextChannel, User } from 'discord.js';
import { MessageContent, Nullish } from '../../lib';

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

  public static async sendDM(
    user: User,
    content: MessageContent
  ): Promise<Nullish<Message>> {
    const payload = {
      ...(content.content !== undefined && { content: content.content }),
      ...(content.embeds !== undefined && { embeds: [...content.embeds] }),
      ...(content.components !== undefined && {
        components: [...content.components]
      })
    };

    const sentMessage = await user.send(payload);
    return sentMessage;
  }
}
