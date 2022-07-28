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

    interaction.reply({content: `**Напишите количество необходимых слотов (от 0 до 99) в чат:**`, ephemeral: true})

    const filter = m => m.author.id == interaction.user.id
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });

    collector.on('collect', m => {
      if (isNaN(m.content) || m.content < 0 || m.content > 99) return m.channel.send({content: `**${interaction.member}, попробуйте вновь и укажите числовое значение в диапазоне от 0 до 99.**`})
      interaction.member.voice.channel?.setUserLimit(m.content)
      setTimeout(async () => {
        await m.channel.send({content: `**${interaction.member}, вы изменили количество слотов в вашем привате на ${m.content}.**`})
        users.set(`private.PrivateSlots`, `${m.content}`)
        users.save()
      },1000)
     });
}
