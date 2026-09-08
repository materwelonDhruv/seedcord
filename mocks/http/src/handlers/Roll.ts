import { ButtonBuilder, TextDisplayBuilder } from '@discordjs/builders';
import { ButtonHandler, ButtonRoute, CustomId, RowComponent, SlashHandler, SlashRoute } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

const DEFAULT_SIDES = 20;

export const RerollId = new CustomId('reroll').int('sides', 2, 100);

class RerollRow extends RowComponent<'button'> {
    constructor(sides: number) {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(RerollId.encode({ sides }))
                .setLabel('Roll again')
                .setStyle(ButtonStyle.Secondary)
        );
    }
}

function rollLine(actor: string, sides: number): TextDisplayBuilder {
    const value = 1 + Math.floor(Math.random() * sides);
    return new TextDisplayBuilder().setContent(`${actor} rolled **${value}** on a d${String(sides)}`);
}

@SlashRoute('roll')
export class RollSlash extends SlashHandler<'roll'> {
    public async execute(): Promise<void> {
        const sides = this.options.getInteger('sides') ?? DEFAULT_SIDES;
        const actor = this.dispatch.require('actor');

        await this.reply({ components: [rollLine(actor, sides), new RerollRow(sides).component] });
    }
}

@ButtonRoute(RerollId)
export class RerollButton extends ButtonHandler<[typeof RerollId]> {
    public async execute(): Promise<void> {
        const { sides } = this.params;
        const actor = this.dispatch.require('actor');

        await this.update({ components: [rollLine(actor, sides), new RerollRow(sides).component] });
    }
}
