import { ModalSubmitInteraction } from 'discord.js';
import { Executable } from '../../lib';

export class ModalSubmitHandler extends Executable<ModalSubmitInteraction> {
  constructor(interaction: ModalSubmitInteraction) {
    super(interaction);
  }

  private getHandler(): Executable<ModalSubmitInteraction> | null {
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
