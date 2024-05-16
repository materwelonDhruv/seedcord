import { ButtonInteraction } from 'discord.js';
import { Executable } from '../../lib';

export class ButtonHandler extends Executable<ButtonInteraction> {
  constructor(interaction: ButtonInteraction) {
    super(interaction);
  }

  private getHandler(): Executable<ButtonInteraction> | null {
    switch (this.event.customId.split('-')[0]) {
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
