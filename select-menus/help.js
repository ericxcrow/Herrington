const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

    const embed = new MessageEmbed()
      .setColor(guilds.color)

    if(interaction.values == `moderation`){
      embed.setDescription(`**ВНИМАНИЕ! Команды модерации по дефолту отключены. Для настройки используйте \`${guilds.prefix}settings\`**\n\`${guilds.prefix}ban - заблокировать пользователя на сервере\`\n\`${guilds.prefix}unban - разблокировать пользователя на сервере\`\n\`${guilds.prefix}kick - выгнать пользователя с сервера\`\n\`${guilds.prefix}mute - замутить/отправить в тайм-аут пользователя\`\n\`${guilds.prefix}unmute - размутить/снять тайм-аут пользователю\`\n\`${guilds.prefix}warnlog - посмотреть историю наказаний пользователя\``)
      embed.setTitle(`Команды модерации`)
      return interaction.update({ embeds: [embed] })
    }

    if(interaction.values == `settings`){
      embed.setDescription(`\`${guilds.prefix}settings - настроить системы бота\`\n\`${guilds.prefix}prefix - поменять префикс боту\`\n\`${guilds.prefix}color - изменить цвет эмбедов\`\n\`${guilds.prefix}master-add - добавить мастер-роли(роль, имеющие права настройки бота)\`\n\`${guilds.prefix}master-remove - удалить мастер-роли(роли, имеющие права настройки бота)\`\n\`${guilds.prefix}mod-add - добавить роли модерации(роли, имеющие доступ к тикетам/командам модерации)\`\n\`${guilds.prefix}mod-remove - удалить роли модерации(роли, имеющие доступ к тикетам/командам модерации)\``)
      embed.setTitle(`Команды настроек`)
      return interaction.update({ embeds: [embed] })
    }

    if(interaction.values == `other`){
      embed.setDescription(`\`${guilds.prefix}avatar - посмотреть аватар пользователя\`\n\`${guilds.prefix}user - посмотреть информацию о пользователе\`\n\`${guilds.prefix}server-info - посмотреть информацию о сервере\``)
      embed.setTitle(`Прочие команды`)
      return interaction.update({ embeds: [embed] })
    }

}
