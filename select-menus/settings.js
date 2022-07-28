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

    if (!interaction.member.permissions.has('ADMINISTRATOR') & interaction.member.id != botconfig.owner & !interaction.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
      embed.setDescription(`Ошибка! Недостаточно прав.`)
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    const moderation = new MessageSelectMenu()
        .setCustomId('moderation')
        .setPlaceholder('Включить/выключить систему модерации')
        .addOptions([
          {
            label: 'Включить',
            description: 'Включить систему модерации на сервере',
            value: 'moderation_enable',
          },
          {
            label: 'Выключить',
            description: 'Выключить систему модерации на сервере',
            value: 'moderation_disable',
          },
        ])

    const mutes = new MessageSelectMenu()
        .setCustomId('mutes')
        .setPlaceholder('Настройки мутов')
        .addOptions([
          {
            label: 'Роль',
            description: 'Включить систему мутов по выдаче роли',
            value: 'mutes_roles',
          },
          {
            label: 'Тайм-аут',
            description: 'Выключить систему мутов по выдаче тайм-аутов',
            value: 'mutes_timeot',
          },
        ])

      const privates = new MessageSelectMenu()
          .setCustomId('privates')
          .setPlaceholder('Настройки приватов')
          .addOptions([
            {
              label: 'Включить',
              description: 'Включить систему кастомных приватов на сервере',
              value: 'privates_enable',
            },
            {
              label: 'Выключить',
              description: 'Выключить систему кастомных приватов на сервере',
              value: 'privates_disable',
            },
          ])

        const tickets = new MessageSelectMenu()
            .setCustomId('tickets')
            .setPlaceholder('Настройки тикетов')
            .addOptions([
              {
                label: 'Включить',
                description: 'Включить систему тикетов на сервере',
                value: 'tickets_enable',
              },
              {
                label: 'Выключить',
                description: 'Выключить систему тикетов на сервере',
                value: 'tickets_disable',
              },
            ])

    const row = new MessageActionRow()
      .addComponents(moderation)
    const row2 = new MessageActionRow()
      .addComponents(mutes)
    const row3 = new MessageActionRow()
      .addComponents(privates)
    const row4 = new MessageActionRow()
      .addComponents(tickets)

    if(interaction.values == `moderation`){
      let roles = guilds.mod_roles.map((x) => `<@&${x}>`).join(`, `);
      if (guilds.mod_roles.length <=0){
        roles = `\`Отсутствуют\``
      }
      embed.setDescription(`Для настройки модерации - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nМодерация: ${guilds.moderation.get('isModerating') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nМуты: ${guilds.moderation.get('mutes') == false ?'\`Выдача тайм-аута\`':`\`Выдача роли\``}\nРоль мута: ${guilds.moderation.mute_role==null?'\`Отсутствует\`':`<@&${guilds.moderation.mute_role}>`}`)
      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      return interaction.update({ embeds: [embed], components: [row, row2] })
    }

    if(interaction.values == `tickets`){
      let roles = guilds.mod_roles.map((x) => `<@&${x}>`).join(`, `);
      if (guilds.mod_roles.length <=0){
        roles = `\`Отсутствуют\``
      }
      embed.setDescription(`Для настройки системы тикетов - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nСистема тикетов: ${guilds.tickets.get('isEnabled') == false ?'\`Выключена\`':`\`Включена\``}\nРоли модераторов: ${roles}\nКанал создания тикетов: ${guilds.tickets.get('channelNew') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('channelNew')}>`}\n Канал лога тикетов: ${guilds.tickets.get('channelLog') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('channelLog')}>`}\nКатегория новых тикетов: ${guilds.tickets.get('categoryOpen') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryOpen')}>`}\nКатегория рассматриваемых тикетов: ${guilds.tickets.get('categoryHold') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryHold')}>`}\nКатегория закрытых тикетов: ${guilds.tickets.get('categoryClosed') == null ?'\`Отсутствует\`':`<#${guilds.tickets.get('categoryClosed')}>`}`)
      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      return interaction.update({ embeds: [embed], components: [row4] })
    }

    if(interaction.values == `privates`){
      embed.setDescription(`Для настройки системы кастомных приватов - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nПриваты: ${guilds.privates.get('isEnabled') == false ?'\`Выключены\`':`\`Включены\``}\nКатегория приватов: ${guilds.privates.get('category') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('category')}>`}\nКанал создания приватов: ${guilds.privates.get('channelVoice') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('channelVoice')}>`}\nКанал настройки приватов: ${guilds.privates.get('channelText') == null ?'\`Отсутствует\`':`<#${guilds.privates.get('channelText')}>`}`)
      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      return interaction.update({ embeds: [embed], components: [row3] })
    }

}
