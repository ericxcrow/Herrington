const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs');
const Guilds = require('../schemas/Guilds');
const Tickets = require('../schemas/Tickets');

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    let guilds = await Guilds.findOne({ guild_id: interaction.guild.id })

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

    if(channel_interaction.parentId != guilds.tickets.get('categoryClosed')){
        let embednotify = new MessageEmbed()
        .setTitle('Ошибка')
        .setColor(guilds.color)
        .setDescription(`Данный тикет ещё не закрыт, удаление невозможно!`)
        return interaction.reply({ embeds: [embednotify], ephemeral: true })
    }

    const messages = await channel_interaction.messages.fetch()
    const messages_values = messages.filter(x => x.id != messages.last().id).sort(async(a,b) => a.createdTimestamp-b.createdTimestamp).toJSON()
    const zeroPad = (n) => n.toString().padStart(2, '0');
    let log_msg = []

    for (var i in messages_values) {
        const ticket_db = await Tickets.findOne({ "log.timestamp": messages_values[i].createdTimestamp })
        if(ticket_db){
            log_msg.push(ticket_db?.log.filter((x) => x.timestamp == messages_values[i].createdTimestamp)[0].content)
        } else {
            log_msg.push(`[${zeroPad(messages_values[i].createdAt.getDay() + 3)}.${zeroPad(messages_values[i].createdAt .getMonth() + 1)}.${zeroPad(messages_values[i].createdAt.getFullYear())} ${zeroPad(messages_values[i].createdAt.getHours())}:${zeroPad(messages_values[i].createdAt.getMinutes())}:${zeroPad(messages_values[i].createdAt.getSeconds())}] ${messages_values[i].author.tag} [ID: ${messages_values[i].author.id}]: ${messages_values[i].content}`)
        }
    }

    log_msg.reverse()

    fs.appendFileSync(`./${channel_interaction.name}.txt`, log_msg.join("\r\n"))

    const creator_db = await Tickets.findOne({ channel_id: channel_interaction.id })
    if(creator_db){
        let user = await bot.users.fetch(creator_db.discord_id)
        await user.send({ content: `Ваш тикет **${channel_interaction.name}** был удалён системой. Его расшифровка прикреплена к данному сообщению.\nСпасибо за Ваше обращение!`, files: [`./${channel_interaction.name}.txt`] }).catch(() => null);
    }
    let channel = await bot.channels.fetch(guilds.tickets.get('channelLog'))
    await channel.send({ content: `\`[DELETE-TICKET]\` Тикет **${channel_interaction.name}** был удалён системой. Его расшифровка прикреплена к данному сообщению`, files: [`./${channel_interaction.name}.txt`] })

    fs.unlinkSync(`./${channel_interaction.name}.txt`)

    await channel_interaction.delete(); // Удаление канала

    await Tickets.deleteOne({ channel_id: channel_interaction.id })

    await interaction.deferUpdate();
}
