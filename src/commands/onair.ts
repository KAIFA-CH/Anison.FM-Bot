import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { EmbedBuilder } from "discord.js";
import axios from "axios";

@Discord()
export class OnAir {
    @Slash({ description: "Get currently playing song", name: "onair" })
    async onair(interaction: CommandInteraction) {
        await interaction.deferReply();

        // Get the current air information from the API
        const response = await axios.get("https://anison.fm/status.php", {headers: {"Referer": "https://en.anison.fm/"}});

        // Check if the current requester has an PFP if not return default PFP
        let pfp: any = await axios.get(`https://anison.fm/resources/avatars/original/${response.data.on_air.order_by}.jpg`).catch(err => {});

        if (pfp && pfp.status === 200) {
            pfp = `https://anison.fm/resources/avatars/original/${response.data.on_air.order_by}.jpg`;
        } else {
            pfp = "https://anison.fm/resources/avatars/original/0.jpg";
        };

        // Build embed with song title, anime name and requester info
        const onairEmbed = new EmbedBuilder()
            .setTimestamp()
            .setThumbnail(`https://anison.fm${response.data.poster.match(/src=\"([^]*?)\"/)[1].replace("200", "150")}`)
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
            .setTitle(`Currently Playing: ${response.data.on_air.track}`)
            .setAuthor({ name: `Song Requested by ${response.data.on_air.order_by_login}`, iconURL: pfp, url: `https://en.anison.fm/user/${response.data.on_air.order_by}` })
            .setDescription(`From the anime **${response.data.on_air.anime}**\nRequested through https://en.anison.fm`);
        
        await interaction.editReply({embeds: [onairEmbed]});
    }
}