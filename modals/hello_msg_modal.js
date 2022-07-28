const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction, args) => {
  const message_interaction = interaction.message
  const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
  const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
  const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

  let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

  const embed = new MessageEmbed()
    .setColor(guilds.color)

  if(!guilds.hello_msg.get('isEnabled')) return interaction.reply({ content: `Ошибка! Привественное сообщение выключено на данном сервере.`, ephemeral: true })

  guilds.set(`hello_msg.text`, `${interaction.fields.getTextInputValue('hello_msg_text')}`)
  guilds.save()

  embed.setFooter({text: `Для выбора другого пункта настройки - используйте команду "!settings"`})
  embed.setDescription(`Для настройки привественного сообщения - выберете подходящий пункт в меню.\n\n**Нынешние настройки:**\nПриветствие при входе: ${guilds.hello_msg.get('isEnabled') == false ?'\`Выключено\`':`\`Включено\``}\nТекст приветствия: ${guilds.hello_msg.get('text') == null ?'\`Отсутствует\`':`\n\`\`\`\n${guilds.hello_msg.get('text')}\`\`\``}`)
  await interaction.update({ embeds: [embed], components: [message_interaction.components[0], message_interaction.components[1]] })
}
