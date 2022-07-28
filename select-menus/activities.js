const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const { DiscordTogether } = require('discord-together');
const Guilds = require("../schemas/Guilds");
const Users = require("../schemas/Users");

module.exports = async (bot, interaction) => {
    bot.discordTogether = new DiscordTogether(bot);
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

    const embed = new MessageEmbed()
      .setColor(guilds.color)

    if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS") & !interaction.guild.me.permissions.has("CREATE_INSTANT_INVITE")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление каналами и на создание приглашений... Рекомендуется дать мне права "Администратора".`, ephemeral: true })
    if(!interaction.member.voice?.channel) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(interaction.member.voice?.channel?.parentId != guilds.privates.get('category')) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(!interaction.member.permissionsIn(interaction.member.voice.channel?.id).has(`MANAGE_CHANNELS`)) return interaction.reply({content: `**Вы не владеете приватным голосовым каналом.**`, ephemeral: true})
    
    if(interaction.values == `activities_yt`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'youtube').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_poker`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'poker').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_chess`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'chess').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_betrayal`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'betrayal').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_fishington`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'fishing').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_letter_tile`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'lettertile').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_words_snack`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'wordsnack').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_doodle_crew`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'doodlecrew').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_spellcast`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'spellcast').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_awkword`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'awkword').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_puttparty`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'puttparty').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_sketchheads`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'sketchheads').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

    if(interaction.values == `activities_ocho`){
      bot.discordTogether.createTogetherCode(interaction.member?.voice?.channel?.id, 'ocho').then(async invite => {
        embed.setDescription(`${invite.code}`)
        await interaction.reply({ embeds: [embed], ephemeral: true })
      });
    }

}
