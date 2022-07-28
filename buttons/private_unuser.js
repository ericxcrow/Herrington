const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Guilds = require("../schemas/Guilds");
const Users = require("../schemas/Users");

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })
    let users = await Users.findOne({ guild_id: interaction.guild.id, discord_id: interaction.member.id })

    if(!interaction.member.voice?.channel) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(interaction.member.voice?.channel?.parentId != guilds.privates.get('category')) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(!interaction.member.permissionsIn(interaction.member.voice.channel?.id).has(`MANAGE_CHANNELS`)) return interaction.reply({content: `**Вы не владеете приватным голосовым каналом.**`, ephemeral: true})

    interaction.reply({content: `**Упомяните пользователя, у которого нужно забрать доступ:**`, ephemeral: true})

    const filter = m => m.author.id == interaction.user.id
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });

    collector.on('collect', async (m) => {
      let member = m.mentions.members.first()
      setTimeout(async () => {
        m.channel.send({content: `**${interaction.member}, вы забрали у ${member} доступ к своему привату.**`})
      },1000)
      interaction.member.voice.channel?.permissionOverwrites.edit(member.id, {
          "VIEW_CHANNEL": false,
          "CONNECT": false,
          "MOVE_MEMBERS": false,
      })
      if (member.voice?.channelId != interaction.member.voice?.channelId) {
          await member.voice?.disconnect()
      }
    })
}
