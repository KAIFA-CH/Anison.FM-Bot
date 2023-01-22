import type { CommandInteraction, MessageActionRowComponentBuilder } from "discord.js";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Info {
    @Slash({ description: "Get information", name: "info" })
    async info(interaction: CommandInteraction) {
        // Get the currently active VC connections
        const activeconnections = interaction.client.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice && channel.members.has(interaction.client.user.id));

        // Construct a simple embed showing a count of how many servers the bot is in and how many active VC connections there are
        const infoEmbed = new EmbedBuilder()
            .setColor("#F7B24A")
            .setTitle("Information")
            .setImage("https://sun9-45.userapi.com/LIHQRMNRdRn1yJ05W43yqKFEMRtzAC4XQusTbQ/ZctnorRjMTQ.jpg")
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .addFields(
                { name: 'Servers', value: interaction.client.guilds.cache.size.toString(), inline: true },
                { name: 'Active Connections', value: activeconnections.size.toString(), inline: true },
            );

        // Create all Buttons which link to different sites and then reply with the embed and buttons
        const radiolink = new ButtonBuilder()
            .setLabel("Site")
            .setURL("https://en.anison.fm")
            .setStyle(ButtonStyle.Link);
        
        const discordlink = new ButtonBuilder()
            .setLabel("Discord")
            .setURL("https://discord.gg/WsNWt4HSWK")
            .setStyle(ButtonStyle.Link);

        const invitelink = new ButtonBuilder()
            .setLabel("Invite to Server")
            .setURL("https://google.com")
            .setStyle(ButtonStyle.Link);

        const buttonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(radiolink, discordlink, invitelink);
        await interaction.reply({ embeds: [infoEmbed], components: [buttonRow] })
    }
}