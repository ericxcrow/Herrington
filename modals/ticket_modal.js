const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Tickets = require('../schemas/Tickets');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction, args) => {
  const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
  const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
  const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

  let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })
  const create_parent = await bot.channels.cache.get(guilds.tickets.get('categoryOpen'));

  let num_ticket = guilds.tickets.get('number')

  const num_str = String(num_ticket)

  let num;
  if(num_str.length == 1){
      num = "000" + num_ticket
  }
  if(num_str.length == 2){
      num = "00" + num_ticket
  }
  if(num_str.length == 3){
      num = "0" + num_ticket
  }
  if(num_str.length == 4){
      num = num_ticket
  }

  await guild_interaction.channels.create(`ticket-${num}`, {
      type: "GUILD_TEXT",
      parent: create_parent,
      reason: `Создание тикета №${num}. Создатель: ${interaction.user.tag}`,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"],
        },
        {
          id: interaction.guild.roles.everyone.id,
          deny: ["VIEW_CHANNEL"],
        },
        ...guilds.mod_roles?.map((x) => ({ id: x, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"], }))
      ]
  }).then(async(channel) => {

    await interaction.reply({ content: `${member_interaction}, ваше обращение создано. Номер обращения: ${num}.\n\nПерейти: <#${channel.id}>`, ephemeral: true })

      let embednotify = new MessageEmbed()
        .setTitle('Обращение к команде поддержки')
        .setColor(guilds.color)
        .setTimestamp()
        .setDescription(`Пользователь ${member_interaction} \`[ID: ${member_interaction.id}]\`\nСуть обращения: \`${interaction.fields.getTextInputValue('ticket_text')}\``)

      const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setCustomId('ticket_hold')
        .setEmoji('⏰')
        .setLabel(`На рассмотрение`)
        .setStyle('SECONDARY'),
          new MessageButton()
          .setCustomId('ticket_close')
          .setEmoji('🔒')
          .setLabel(`Закрыть`)
          .setStyle('SECONDARY'),
      )

      await channel.send({ embeds: [embednotify], content: `${member_interaction}`, components: [row] }).then(async(msg) => {
          await Tickets.create({
              ticket_name: channel.name,
              created_at: Date.now(),
              guild_id: interaction.guild.id,
              discord_id: member_interaction.id,
              channel_id: channel.id,
              creator_msg: msg.id
          })

          msg.pin()

          guilds.set(`tickets.number`, guilds.tickets.get('number')+1)
          guilds.save()

      })

  })
}
