import { StringSelectMenuInteraction } from 'discord.js';
import { Executable } from '../../lib';

export class StringMenuHandler extends Executable<StringSelectMenuInteraction> {
  constructor(interaction: StringSelectMenuInteraction) {
    super(interaction);
  }

  private getHandler(): Executable<StringSelectMenuInteraction> | null {
    switch (this.event.customId.split('_')[0]) {
      default:
        return null;
    }
  }

  public async execute(): Promise<void> {
    const handler = this.getHandler();

    if (handler) {
      await handler.execute();
    }
  }
}
