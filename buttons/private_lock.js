const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Guilds = require("../schemas/Guilds");
const Users = require("../schemas/Users");

module.exports = async (bot, interaction) => {
  let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })
  let users = await Users.findOne({ guild_id: interaction.guild.id, discord_id: interaction.member.id })

    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    if(!interaction.member.voice?.channel) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(interaction.member.voice?.channel?.parentId != guilds.privates.get('category')) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(!interaction.member.permissionsIn(interaction.member.voice.channel?.id).has(`MANAGE_CHANNELS`)) return interaction.reply({content: `**Вы не владеете приватным голосовым каналом.**`, ephemeral: true})

    interaction.member.voice.channel?.permissionOverwrites.edit(interaction.guild.id, {
        "VIEW_CHANNEL": false,
        "CONNECT": false,
    }).then(() => {
      interaction.reply({content: `**Вы закрыли ваш приват.**`, ephemeral: true})
})
  users.set(`private.PrivateIsLocked`, true)
  users.save()
}
