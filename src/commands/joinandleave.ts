import type { CommandInteraction, VoiceChannel } from "discord.js";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { ArgsOf, Client, Discord, Guard, On, Slash, SlashOption } from "discordx";
import { CustomTrack, Player } from "@discordx/music";
import { PermissionGuard } from "@discordx/utilities";

@Discord()
export class JoinAndLeave {
    player;

    constructor() {
        this.player = new Player();
    }

    @Slash({ description: "Joins a VC and starts playing the station.", name: "join" })
    @Guard(PermissionGuard(["Administrator"]))
    async join(
        @SlashOption({
            description: "Voice Channel to join",
            name: "vc",
            required: true,
            type: ApplicationCommandOptionType.Channel
        })
        vc: VoiceChannel,
        interaction: CommandInteraction): Promise<void> {
            // Check if the bot is already in a VC and cancel the continuation of the interaction after reply
            if (interaction.guild!.channels.cache.some(channel => (channel.type === ChannelType.GuildVoice && channel.members.has(interaction.client.user.id)))) {
                await interaction.reply({content: `I'm already in a channel`, ephemeral: true});
                return;
            }

            if (vc.type == ChannelType.GuildVoice) {
                const queue = this.player.queue(interaction.guild!);
                await queue.join(vc);
                
                // Add station to the guild queue of the player and when playing respond with message.
                const status = await queue.playTrack(new CustomTrack(this.player, "Anison.FM", "https://pool.anison.fm:9000/AniSonFM(320)"));
                if (status) {
                    await interaction.reply({content: `Now playing Anison.FM in ${vc}`, ephemeral: true});
                }
            } else {
                await interaction.reply({content: `The provided channel is not a Voice Channel!`, ephemeral: true});
            }
    }

    @Slash({ description: "Leave the VC", name: "leave" })
    @Guard(PermissionGuard(["Administrator"]))
    async leave(interaction: CommandInteraction): Promise<void> {
            // Check if the bot is in a VC, clear queue and disconnect from the vc else if not in VC respond with an error message.
            if (interaction.guild!.channels.cache.some(channel => (channel.type === ChannelType.GuildVoice && channel.members.has(interaction.client.user.id)))) {
                const queue = this.player.queue(interaction.guild!);
                await queue.clearTracks();
                await queue.leave();
                await interaction.reply({content: `Disconnected from VC`, ephemeral: true});
            } else {
                await interaction.reply({content: `I'm not in a channel`, ephemeral: true});
            }
    }

    // Make sure the bot actually clears the queue if it gets Disconnected forcefully by an mod/admin
    @On()
    VoiceDisconnect([oldState, newState]: ArgsOf<"voiceStateUpdate">, client: Client): void {
        if (oldState.member?.user.username == client.user?.username && !newState.member?.voice.channel) {
            const queue = this.player.queue(newState.guild!);
            queue.clearTracks();
        }
    }
}