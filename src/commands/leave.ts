import type { CommandInteraction } from "discord.js";
import { ChannelType } from "discord.js";
import { Discord, Guard, Slash } from "discordx";
import { Player } from "@discordx/music";
import { PermissionGuard } from "@discordx/utilities";

@Discord()
export class Leave {
    player;

    constructor() {
        this.player = new Player();
    }

    @Slash({ description: "Leave the VC", name: "leave" })
    @Guard(PermissionGuard(["Administrator"]))
    async leave(interaction: CommandInteraction): Promise<void> {
            // Check if the bot is in a VC, clear queue and disconnect from the vc else if not in VC respond with an error message.
            if (interaction.client.channels.cache.some(channel => (channel.type === ChannelType.GuildVoice && channel.members.has(interaction.client.user.id)))) {
                const queue = this.player.queue(interaction.guild!);
                await queue.clearTracks();
                await queue.leave();
                await interaction.reply({content: `Disconnected from VC`, ephemeral: true});
            } else {
                await interaction.reply({content: `I'm not in a channel`, ephemeral: true});
            }
    }
}