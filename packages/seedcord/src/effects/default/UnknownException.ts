import { DiscordAPIError, SnowflakeUtil, WebhookClient } from 'discord.js';
import { Envapt } from 'envapt';

import { BuilderComponent } from '../../interfaces/Components';
import { RegisterEffect } from '../decorators/RegisterEffect';
import { WebhookLog } from '../interfaces/abstracts/WebhookLog';
import { AllEffects } from '../types/Effects';

/**
 * Default effect to log unhandled exceptions via webhook
 *
 * Developers need to set the UNKNOWN_EXCEPTION_WEBHOOK_URL environment variable in their .env file otherwise this effect will throw an error during initialization.
 *
 * @throws Error if UNKNOWN_EXCEPTION_WEBHOOK_URL is not set or is invalid
 */
@RegisterEffect('unknownException')
export class UnknownException extends WebhookLog<'unknownException'> {
    @Envapt('UNKNOWN_EXCEPTION_WEBHOOK_URL', {
        converter(raw, _fallback) {
            if (!raw) throw new Error('Missing UNKNOWN_EXCEPTION_WEBHOOK_URL');
            if (!URL.canParse(String(raw))) throw new Error('Invalid UNKNOWN_EXCEPTION_WEBHOOK_URL');

            return raw;
        }
    })
    declare static readonly unknownExceptionWebhookUrl: string;

    webhook = new WebhookClient({
        url: UnknownException.unknownExceptionWebhookUrl
    });

    async execute(): Promise<void> {
        await this.webhook.send({
            username: 'Unknown Exception',
            avatarURL: 'https://cdn.discordapp.com/attachments/1351446034827579466/1351446912947191830/warning-2.png',
            embeds: [new UnhandledErrorEmbed(this.data).component]
        });
    }
}

class UnhandledErrorEmbed extends BuilderComponent<'embed'> {
    constructor(data: AllEffects['unknownException']) {
        super('embed');

        const { uuid, error, guild, user } = data;

        this.instance
            .setTitle(`An unknown exception was thrown`)
            .setColor('#ef4860')
            .setDescription(
                `**Guild ID:** \`${guild?.id ?? 'Not used in a guild'}\`\n` +
                    `**Guild Name:** ${guild?.name ?? 'Not used in a guild'}\n` +
                    `**User ID:** \`${user?.id ?? 'Missing user info'}\`\n` +
                    `**Username:** ${user?.username ?? 'Missing user info'}\n` +
                    `### UUID: \`${uuid}\`\n` +
                    `\`\`\`${error.stack}\`\`\``
            );

        this.setTimestampsIfAvailable(error);
    }

    private setTimestampsIfAvailable(error: Error): void {
        if (!(error instanceof DiscordAPIError)) return;

        const now = Date.now();

        // Extract the snowflake ID from `/interactions/{ID}/`
        const snowflake = error.url.match(/\/interactions\/(\d+)\//)?.[1];
        if (!snowflake) return undefined;

        // Discord epoch offset (ms) and timestamp extraction
        const interactionTs = Number(SnowflakeUtil.deconstruct(snowflake).timestamp);

        // Time difference
        const diff = now - interactionTs;
        const seconds = Math.floor(diff / 1000);
        const millis = diff % 1000;

        this.instance.addFields([
            {
                name: 'Timestamps',
                value:
                    `- **\`Interaction sent\` :** ${new Date(interactionTs).toISOString()} (${interactionTs})\n` +
                    `- **\`Error logged    \` :** ${new Date(now).toISOString()} (${now})\n` +
                    `- **\`Offset          \` :** ${seconds}s ${millis}ms`,
                inline: true
            }
        ]);
    }
}
