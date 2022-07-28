const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Tickets = require('../schemas/Tickets');
const Guilds = require('../schemas/Guilds')

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

    const close_parent = await bot.channels.cache.get(guilds.tickets.get('categoryClosed')); // Категория закрытых каналов
    if(close_parent.children?.size >= 49){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(guilds.color)
        .setDescription("В данный момент вы не можете закрыть этот тикет!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    if(!interaction.member.permissions.has('ADMINISTRATOR') & interaction.member.id != botconfig.owner & !interaction.member.roles.cache.some(r => guilds.master_roles.some(role => r.id == role))){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setColor(guilds.color)
        .setDescription("Недостаточно прав!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    let ticket_db = await Tickets.findOne({ channel_id: channel_interaction.id })
    if(!ticket_db){
        let err = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(guilds.color)
        .setDescription(`Произошла ошибка с базой данных, обратитесь к администратору!`)
        return interaction.reply({ embeds: [err], ephemeral: true })
    }

    if(channel_interaction.parentId == guilds.tickets.get('categoryClosed')){
        let embednotify = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(guilds.color)
        .setDescription(`Данный тикет уже закрыт, ожидайте удаления через 24-е часа!`)
        return interaction.reply({ embeds: [embednotify], ephemeral: true })
    }

    // const msg_log = await channel_interaction.send({ content: `<@${ticket_db.discord_id}>, модератор ${member_interaction} закончил работу по вашему обращению и установил ему статус \`«Закрыто»\`.\n\nОжидайте, в течение 24 часов Вы получите транскрипцию данного канала в личные сообщения. Канал будет удалён через 24 часа. `, ephemeral: true })
    const msg_log = await channel_interaction.send({ content: `<@${ticket_db.discord_id}>, модератор ${member_interaction} закончил работу по вашему обращению и установил ему статус \`«Закрыто»\`.`, ephemeral: true })

    const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('ticket_delete')
        .setEmoji('❌')
        .setLabel(`Удалить`)
        .setStyle('SECONDARY'),
    )

    await message_interaction.edit({ embeds: [message_interaction.embeds[0]], components: [row] })

    await guild_interaction.channels.edit(interaction.channelId, {
          parent: guilds.tickets.get('categoryClosed'),
          reason: `Тикету установлен статус "Закрыто"`,
          permissionOverwrites: [
            {
              id: ticket_db.discord_id,
              allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"],
              deny: ["SEND_MESSAGES"],
            },
            {
              id: interaction.guild.roles.everyone.id,
              deny: ["VIEW_CHANNEL"],
            },
            ...guilds.mod_roles?.map((x) => ({ id: x, allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "ATTACH_FILES"], }))
          ]
        }).then(async(channel) => {

    const now_date = new Date(Date.now())
    const zeroPad = (n, digits) => n.toString().padStart(digits, '0');

    ticket_db.close = true
    ticket_db.log.push({
        timestamp: msg_log.createdAt.getTime(),
        content: `[${zeroPad(now_date.getDay() + 3, 2)}.${zeroPad(now_date .getMonth() + 1, 2)}.${zeroPad(now_date.getFullYear(), 2)} ${zeroPad(now_date.getHours(), 2)}:${zeroPad(now_date.getMinutes(), 2)}:${zeroPad(now_date.getSeconds(), 2)}] ${interaction.user.tag} [ID: ${interaction.user.id}]: закрыл обращение.`
    })
    await ticket_db.save().catch(() => {})

    await interaction.deferUpdate();

  })
}
