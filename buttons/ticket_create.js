const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
const Guilds = require('../schemas/Guilds')
const Tickets = require('../schemas/Tickets');

module.exports = async (bot, interaction) => {
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие
    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })
    const create_parent = await bot.channels.cache.get(guilds.tickets.get('categoryOpen'));

    const ticket_db = await Tickets.findOne({ discord_id: interaction.member.id, guild_id: interaction.guild.id, close: false })

    if(ticket_db) {
      let err = new MessageEmbed()
      .setTitle('Ошибка')
      .setColor(botconfig.color)
      .setDescription(`У вас уже имеется активный тикет: **<#${ticket_db.channel_id}>**, дождитесь его рассмотрения прежде чем создавать новый!`)
      return interaction.reply({ embeds: [err], ephemeral: true })
    }

    if(create_parent?.children?.size >= 49){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(botconfig.color)
        .setDescription("В данный момент вы не можете создать тикет!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    const modal = new Modal()
    .setCustomId('ticket_modal')
    .setTitle('Обращение к команде поддержки');

    const ticket_text = new TextInputComponent()
      .setCustomId('ticket_text')
      .setLabel("Суть обращения")
      .setStyle('PARAGRAPH')
      .setPlaceholder(`Введите суть обращения...`)
      .setRequired();

    const firstActionRow = new MessageActionRow().addComponents(ticket_text);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

}
