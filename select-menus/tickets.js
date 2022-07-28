const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Guilds = require('../schemas/Guilds')
const Tickets = require('../schemas/Tickets')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('ticket_create')
        .setEmoji('📨')
        .setLabel(`Создать тикет`)
        .setStyle('SECONDARY'),
    )

    const embed = new MessageEmbed()
      .setColor(guilds.color)

    if (!interaction.member.permissions.has('ADMINISTRATOR') & interaction.member.id != botconfig.owner & !interaction.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
      embed.setDescription(`Ошибка! Недостаточно прав.`)
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if(interaction.values == `tickets_enable`){
      if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление каналами... Рекомендуется дать мне права "Администратора".`, ephemeral: true })
      if(guilds.tickets.get('isEnabled')) return interaction.reply({ content: `Ошибка! Тикеты уже включены на данном сервере.`, ephemeral: true })

      let roles = guilds.mod_roles.map((x) => `<@&${x}>`).join(`, `);
      if (guilds.mod_roles.length <=0){
        roles = `\`Отсутствуют\``
      }

      let categoryOpen = await interaction.guild.channels.create(`🔔 Активные тикеты`, { type: `GUILD_CATEGORY`, reason: `Создание категории новых тикетов` }).catch(() => null)
      let categoryHold = await interaction.guild.channels.create(`🔔 Закреплённые тикеты`, { type: `GUILD_CATEGORY`, reason: `Создание категории рассматриваемых тикетов` }).catch(() => null)
      let categoryClosed = await interaction.guild.channels.create(`Закрытые тикеты`, { type: `GUILD_CATEGORY`, reason: `Создание категории закрытых тикетов` }).catch(() => null)
      let channelNew = await interaction.guild.channels.create(`создание-тикета`, { type: `GUILD_TEXT`, reason: `Создание канала создания тикетов` }).catch(() => null)
      let channelLog = await interaction.guild.channels.create(`лог-тикетов`, { type: `GUILD_TEXT`, reason: `Создание канала лога тикетов` }).catch(() => null)

      embed.setTitle(`Связаться с модерацией`)
      embed.setDescription(`Нажмите на «Создать тикет», чтобы создать обращение.`)
      let channelMessage = await channelNew.send({ embeds: [embed], components: [row] })
      await channelMessage.pin()
      await channelNew.bulkDelete(1)

      guilds.set(`tickets.isEnabled`, true)
      guilds.set(`tickets.categoryOpen`, `${categoryOpen.id}`)
      guilds.set(`tickets.categoryHold`, `${categoryHold.id}`)
      guilds.set(`tickets.categoryClosed`, `${categoryClosed.id}`)
      guilds.set(`tickets.channelNew`, `${channelNew.id}`)
      guilds.set(`tickets.channelLog`, `${channelLog.id}`)
      guilds.save()

      embed.setTitle(``)
      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      embed.setDescription(`Для настройки системы тикетов - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nСистема тикетов: ${guilds.tickets.get('isEnabled') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nКанал создания тикетов: ${guilds.tickets.get('channelNew') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('channelNew')}>`}\n Канал лога тикетов: ${guilds.tickets.get('channelLog') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('channelLog')}>`}\nКатегория новых тикетов: ${guilds.tickets.get('categoryOpen') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryOpen')}>`}\nКатегория рассматриваемых тикетов: ${guilds.tickets.get('categoryHold') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryHold')}>`}\nКатегория закрытых тикетов: ${guilds.tickets.get('categoryClosed') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryClosed')}>`}`)
      await interaction.update({ embeds: [embed] })
    }

    if(interaction.values == `tickets_disable`){
      if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление каналами и на создание приглашений... Рекомендуется дать мне права "Администратора".`, ephemeral: true })
      if(!guilds.tickets.get('isEnabled')) return interaction.reply({ content: `Ошибка! Тикеты уже выключены на данном сервере.`, ephemeral: true })

      let roles = guilds.mod_roles.map((x) => `<@&${x}>`).join(`, `);
      if (guilds.mod_roles.length <=0){
        roles = `\`Отсутствуют\``
      }

      await bot.channels.cache.get(guilds.tickets.get('categoryOpen')).children?.map(x => x?.delete());
      await bot.channels.cache.get(guilds.tickets.get('categoryHold')).children?.map(x => x?.delete());
      await bot.channels.cache.get(guilds.tickets.get('categoryClosed')).children?.map(x => x?.delete());

      await interaction.guild.channels.delete(guilds.tickets.get('categoryOpen'), `Удаление категории новых тикетов`).catch(() => null)
      await interaction.guild.channels.delete(guilds.tickets.get('categoryHold'), `Удаление категории рассматриваемых тикетов`).catch(() => null)
      await interaction.guild.channels.delete(guilds.tickets.get('categoryClosed'), `Удаление категории закрытых тикетов`).catch(() => null)
      await interaction.guild.channels.delete(guilds.tickets.get('channelNew'), `Удаление канала создания тикетов`).catch(() => null)
      await interaction.guild.channels.delete(guilds.tickets.get('channelLog'), `Удаление канала лога тикетов`).catch(() => null)

      guilds.set(`tickets.isEnabled`, false)
      guilds.set(`tickets.categoryOpen`, null)
      guilds.set(`tickets.categoryHold`, null)
      guilds.set(`tickets.categoryClosed`, null)
      guilds.set(`tickets.channelNew`, null)
      guilds.set(`tickets.channelLog`, null)
      guilds.save()

      await Tickets.deleteMany({ guild_id: interaction.guild.id })

      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      embed.setDescription(`Для настройки системы тикетов - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nСистема тикетов: ${guilds.tickets.get('isEnabled') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nКанал создания тикетов: ${guilds.tickets.get('channelNew') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('channelNew')}>`}\n Канал лога тикетов: ${guilds.tickets.get('channelLog') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('channelLog')}>`}\nКатегория новых тикетов: ${guilds.tickets.get('categoryOpen') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryOpen')}>`}\nКатегория рассматриваемых тикетов: ${guilds.tickets.get('categoryHold') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryHold')}>`}\nКатегория закрытых тикетов: ${guilds.tickets.get('categoryClosed') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryClosed')}>`}`)
      await interaction.update({ embeds: [embed] })
    }

}
