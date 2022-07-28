const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction) => {
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

    if(!guilds.hello_msg.get('isEnabled')) return interaction.reply({ content: `Ошибка! Привественное сообщение выключено на данном сервере.`, ephemeral: true })

    const modal = new Modal()
    .setCustomId('hello_msg_modal')
    .setTitle('Изменить приветственное сообщение');

    const hello_msg_text = new TextInputComponent()
      .setCustomId('hello_msg_text')
      .setLabel("Суть обращения")
      .setStyle('PARAGRAPH')
      .setPlaceholder(`Введите приветственное сообщение...`)
      .setMinLength(`150`)
      .setMaxLength(`3500`)
      .setRequired();

    const firstActionRow = new MessageActionRow().addComponents(hello_msg_text);

    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

}
