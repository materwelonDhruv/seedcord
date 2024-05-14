import { CustomErrorEmbed } from '../Interfaces';

// Embeds
export class GenericErrorEmbed extends CustomErrorEmbed {
  constructor() {
    super();
    this.component.setDescription(
      `An error occurred while processing this request. Please report this to materwelon`
    );
  }
}
