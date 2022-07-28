const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    const private_slots = new MessageButton()
    .setStyle('SECONDARY')
    .setCustomId('private_slots')
    .setLabel("⚙️")
    const private_rename = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("📝")
    .setCustomId('private_rename')
    const private_kick = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("🚫")
    .setCustomId('private_kick')
    const private_lock = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("🔒")
    .setCustomId('private_lock')
    const private_unlock = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("🔓")
    .setCustomId('private_unlock')
    const private_user = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("📥")
    .setCustomId('private_user')
    const private_unuser = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("📤")
    .setCustomId('private_unuser')
    const private_delete = new MessageButton()
    .setStyle('SECONDARY')
    .setLabel("🗑")
    .setCustomId('private_delete')

    const activities = new MessageSelectMenu()
        .setCustomId('activities')
        .setPlaceholder('Выбрать активность')
        .addOptions([
          {
            label: 'YouTube',
            description: 'Включить активность \`YouTube\` в вашем привате',
            value: 'activities_yt',
          },
          {
            label: 'Poker',
            description: 'Включить активность \`Poker\` в вашем привате',
            value: 'activities_poker',
          },
          {
            label: 'Chess',
            description: 'Включить активность \`Chess\` в вашем привате',
            value: 'activities_chess',
          },
          {
            label: 'Betrayal',
            description: 'Включить активность \`Betrayal\` в вашем привате',
            value: 'activities_betrayal',
          },
          {
            label: 'Fishington',
            description: 'Включить активность \`Fishington\` в вашем привате',
            value: 'activities_fishington',
          },
          {
            label: 'Letter Tile',
            description: 'Включить активность \`Letter Tile\` в вашем привате',
            value: 'activities_letter_tile',
          },
          {
            label: 'Words Snack',
            description: 'Включить активность \`Words Snack\` в вашем привате',
            value: 'activities_words_snack',
          },
          {
            label: 'Doodle Crew',
            description: 'Включить активность \`Doodle Crew\` в вашем привате',
            value: 'activities_doodle_crew',
          },
          {
            label: 'SpellCast',
            description: 'Включить активность \`SpellCast\` в вашем привате',
            value: 'activities_spellcast',
          },
          {
            label: 'Awkword',
            description: 'Включить активность \`Awkword\` в вашем привате',
            value: 'activities_awkword',
          },
          {
            label: 'Puttparty',
            description: 'Включить активность \`Puttparty\` в вашем привате',
            value: 'activities_puttparty',
          },
          {
            label: 'Sketchheads',
            description: 'Включить активность \`Sketchheads\` в вашем привате',
            value: 'activities_sketchheads',
          },
          {
            label: 'Ocho',
            description: 'Включить активность \`Ocho\` в вашем привате',
            value: 'activities_ocho',
          },
        ])

    const row = new MessageActionRow()
      .addComponents(private_slots)
      .addComponents(private_rename)
      .addComponents(private_kick)
      .addComponents(private_lock)

    const row2 = new MessageActionRow()
      .addComponents(private_unlock)
      .addComponents(private_user)
      .addComponents(private_unuser)
      .addComponents(private_delete)

    const row3 = new MessageActionRow()
      .addComponents(activities)

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

    const embed = new MessageEmbed()
      .setColor(guilds.color)

    if (!interaction.member.permissions.has('ADMINISTRATOR') & interaction.member.id != botconfig.owner & !interaction.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
      embed.setDescription(`Ошибка! Недостаточно прав.`)
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if(interaction.values == `privates_enable`){
      if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS") & !interaction.guild.me.permissions.has("CREATE_INSTANT_INVITE") & !interaction.guild.me.permissions.has("MOVE_MEMBERS")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление каналами/создание приглашений/перемещение участников... Рекомендуется дать мне права "Администратора".`, ephemeral: true })
      if(guilds.privates.get('isEnabled')) return interaction.reply({ content: `Ошибка! Кастомные приваты уже включены на данном сервере.`, ephemeral: true })

      let category = await interaction.guild.channels.create(`Кастомные приваты`, { type: `GUILD_CATEGORY`, reason: `Создание категории кастомных приватов` }).catch(() => null)
      let channelText = await interaction.guild.channels.create(`Настройка привата`, { type: `GUILD_TEXT`, parent: category, reason: `Создание канала настройки кастомных приватов` }).catch(() => null)
      let channelVoice = await interaction.guild.channels.create(`[+] Создание привата`, { type: `GUILD_VOICE`, parent: category, reason: `Создание канала создания приватов` }).catch(() => null)

      embed.setTitle(`Управление приватом`)
      embed.setFooter(null)
      embed.setDescription(`⚙️ - Изменить количество слотов\n📝 - Переименовать приват\n🚫 - Выгнать пользователя\n🔒 - Закрыть комнату для всех\n🔓 - Открыть комнату для всех\n📥 - Дать доступ пользователю (сможет заходить в закрытую или переполненную комнату)\n📤 - Убрать доступ у пользователя\n🗑 - Удалить приват`)
      let channelMessage = await channelText.send({ embeds: [embed], components: [row3, row, row2] })
      let channelPin = await channelMessage.pin()
      await channelText.bulkDelete(1)

      guilds.set(`privates.isEnabled`, true)
      guilds.set(`privates.category`, `${category.id}`)
      guilds.set(`privates.channelVoice`, `${channelVoice.id}`)
      guilds.set(`privates.channelText`, `${channelText.id}`)
      guilds.save()

      embed.setTitle(``)
      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      embed.setDescription(`Для настройки системы кастомных приватов - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nПриваты: ${guilds.privates.get('isEnabled') == false ?'\`Выключены\`':`\`Включены\``}\nКатегория приватов: ${guilds.privates.get('category') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('category')}>`}\nКанал создания приватов: ${guilds.privates.get('channelVoice') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('channelVoice')}>`}\nКанал настройки приватов: ${guilds.privates.get('channelText') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('channelText')}>`}`)
      await interaction.update({ embeds: [embed] })
    }

    if(interaction.values == `privates_disable`){
      if(!interaction.guild.me.permissions.has("MANAGE_CHANNELS") & !interaction.guild.me.permissions.has("CREATE_INSTANT_INVITE") & !interaction.guild.me.permissions.has("MOVE_MEMBERS")) return interaction.reply({ content: `Ошибка! У меня нет прав на управление каналами/создание приглашений/перемещение участников... Рекомендуется дать мне права "Администратора".`, ephemeral: true })
      if(!guilds.privates.get('isEnabled')) return interaction.reply({ content: `Ошибка! Кастомные приваты уже выключены на данном сервере.`, ephemeral: true })

      await bot.channels.cache.get(guilds.privates.get('category')).children?.map(x => x?.delete());
      await interaction.guild.channels.delete(guilds.privates.get('channelText'), `Удаление канала настройки кастомных приватов`).catch(() => null)
      await interaction.guild.channels.delete(guilds.privates.get('channelVoice'), `Удаление канала создания кастомных приватов`).catch(() => null)
      await interaction.guild.channels.delete(guilds.privates.get('category'), `Удаление категории кастомных приватов`).catch(() => null)

      guilds.set(`privates.isEnabled`, false)
      guilds.set(`privates.category`, null)
      guilds.set(`privates.channelVoice`, null)
      guilds.set(`privates.channelText`, null)
      guilds.save()

      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      embed.setDescription(`Для настройки системы кастомных приватов - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nПриваты: ${guilds.privates.get('isEnabled') == false ?'\`Выключены\`':`\`Включены\``}\nКатегория приватов: ${guilds.privates.get('category') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('category')}>`}\nКанал создания приватов: ${guilds.privates.get('channelVoice') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('channelVoice')}>`}\nКанал настройки приватов: ${guilds.privates.get('channelText') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('channelText')}>`}`)
      await interaction.update({ embeds: [embed] })
    }

}
