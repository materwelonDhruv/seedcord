import { ButtonInteraction } from 'discord.js';
import { IEventHandler } from '../Interfaces';

export class ButtonHandler implements IEventHandler {
  private interaction: ButtonInteraction;

  constructor(interaction: ButtonInteraction) {
    this.interaction = interaction;
  }

  private getHandler(): IEventHandler | null {
    switch (this.interaction.customId.split('-')[0]) {
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
