const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('hello_msg_text')
        .setLabel(`Изменить приветственное сообщение`)
        .setStyle('SECONDARY'),
    )

    const embed = new MessageEmbed()
      .setColor(guilds.color)

    if (!interaction.member.permissions.has('ADMINISTRATOR') & interaction.member.id != botconfig.owner & !interaction.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
      embed.setDescription(`Ошибка! Недостаточно прав.`)
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }

    if(interaction.values == `hello_msg_enable`){
      if(guilds.hello_msg.get('isEnabled')) return interaction.reply({ content: `Ошибка! Приветственное сообщение уже включено на данном сервере.`, ephemeral: true })

      guilds.set(`hello_msg.isEnabled`, true)
      guilds.save()

      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      embed.setDescription(`Для настройки привественного сообщения - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nПриветствие при входе: ${guilds.hello_msg.get('isEnabled') == false ?'\`Выключено\`':`\`Включено\``}\nТекст приветствия: ${guilds.hello_msg.get('text') == null ?'\`Отсутствует\`':`\n\`\`\`\n${guilds.hello_msg.get('text')}\`\`\``}`)
      await interaction.update({ embeds: [embed], components: [message_interaction.components[0], row] })
    }

    if(interaction.values == `hello_msg_disable`){
      if(!guilds.hello_msg.get('isEnabled')) return interaction.reply({ content: `Ошибка! Приветственное сообщение уже выключено на данном сервере.`, ephemeral: true })

      guilds.set(`hello_msg.isEnabled`, false)
      guilds.set(`hello_msg.text`, null)
      guilds.save()

      embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
      embed.setDescription(`Для настройки привественного сообщения - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nПриветствие при входе: ${guilds.hello_msg.get('isEnabled') == false ?'\`Выключено\`':`\`Включено\``}\nТекст приветствия: ${guilds.hello_msg.get('text') == null ?'\`Отсутствует\`':`\n\`\`\`\n${guilds.hello_msg.get('text')}\`\`\``}`)
      await interaction.update({ embeds: [embed], components: [message_interaction.components[0]] })
    }

}
