import { ErrorUtils, ExecutableInteraction } from '../../lib';

export function CatchErrors() {
  return function (
    _target: ExecutableInteraction,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      this: ExecutableInteraction,
      ...args: any[]
    ): Promise<void> {
      const interaction = this.event;

      if (!originalMethod) {
        throw new Error('Method not found');
      }

      try {
        await originalMethod.apply(this, args);
      } catch (error) {
        const res = {
          embeds: [ErrorUtils.getErrorEmbed(error).getComponent],
          ephemeral: true
        };
        if (interaction.replied) {
          await interaction.followUp(res);
        } else if (interaction.deferred) {
          await interaction.editReply(res);
        } else {
          await interaction.reply(res);
        }
      }
    };
  };
}
