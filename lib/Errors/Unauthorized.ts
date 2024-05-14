import { CustomErrorEmbed } from '../Interfaces';

// Embeds
export class CannotInteractWithBotEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(`You cannot interact with the bot.`);
  }
}

export class MissingPermissionsEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `You are missing the required permissions for this action.`
    );
  }
}
