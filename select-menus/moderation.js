const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })
    let roles = guilds.mod_roles.map((x) => `<@&${x}>`).join(`, `);
    if (guilds.mod_roles.length <=0){
      roles = `\`Отсутствуют\``
    }

    const embed = new MessageEmbed()
      .setColor(guilds.color)
      .setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})

    if (!interaction.member.permissions.has('ADMINISTRATOR') & interaction.member.id != botconfig.owner & !interaction.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
      embed.setDescription(`Ошибка! Недостаточно прав.`)
      return interaction.update({ embeds: [embed] })
    }

    if(interaction.values == `moderation_enable`){
      if(!interaction.guild.me.permissions.has("MANAGE_ROLES") & !interaction.guild.me.permissions.has("MODERATE_MEMBERS")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление ролями/выдачу тайм-аутов. Рекомендуется дать боту права "Администратора"...`, ephemeral: true })
      if(guilds.moderation.get('isModerating')) return interaction.reply({ content: `Ошибка! Модерация уже включена на данном сервере.`, ephemeral: true })
      if(guilds.moderation.get('mutes')) {
        let role = await interaction.guild.roles.create({ name: `В муте`, color: `#222222`, reason: `Создание роли мута` }).catch(() => null)
        guilds.set(`moderation.isModerating`, true)
        guilds.set(`moderation.mute_role`, `${role?.id}`)
        guilds.save().catch(() => null)
        embed.setDescription(`Для настройки модерации - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nМодерация: ${guilds.moderation.get('isModerating') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nМуты: ${guilds.moderation.get('mutes') == false ?'\`Выдача тайм-аута\`':`\`Выдача роли\``}\nРоль мута: <@&${role?.id}>`)
      } else {
        guilds.set(`moderation.isModerating`, true)
        guilds.save().catch(() => null)
        embed.setDescription(`Для настройки модерации - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nМодерация: ${guilds.moderation.get('isModerating') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nМуты: ${guilds.moderation.get('mutes') == false ?'\`Выдача тайм-аута\`':`\`Выдача роли\``}\nРоль мута: \`Отсутствует\``)
      }

      await interaction.update({ embeds: [embed] })
    }

    if(interaction.values == `moderation_disable`){
      if(!interaction.guild.me.permissions.has("MANAGE_ROLES") & !interaction.guild.me.permissions.has("MODERATE_MEMBERS")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление ролями/выдачу тайм-аутов. Рекомендуется дать боту права "Администратора"...`, ephemeral: true })
      if(!guilds.moderation.get('isModerating')) return interaction.reply({ content: `Ошибка! Модерация уже выключена на данном сервере.`, ephemeral: true })
      if(guilds.moderation.get('mutes')) {
        await interaction.guild.roles.delete(`${guilds.get(`moderation.mute_role`)}`, `Удаление роли мута`).catch(() => null)
        guilds.set(`moderation.isModerating`, false)
        guilds.set(`moderation.mute_role`, null)
        guilds.save().catch(() => null)
      } else {
        guilds.set(`moderation.isModerating`, false)
        guilds.save()
      }

      embed.setDescription(`Для настройки модерации - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nМодерация: ${guilds.moderation.get('isModerating') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nМуты: ${guilds.moderation.get('mutes') == false ?'\`Выдача тайм-аута\`':`\`Выдача роли\``}\nРоль мута: \`Отсутствует\``)
      await interaction.update({ embeds: [embed] })
    }

}
