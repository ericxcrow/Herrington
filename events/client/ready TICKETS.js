const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Tickets = require('../../schemas/Tickets')
const Guilds = require('../../schemas/Guilds')
const { readdirSync } = require("fs");
const fs = require('fs')

module.exports = async (bot) => {
  // setInterval(async() => {
  //
  //   let ticket_db = await Tickets.find()
  //   ticket_db.map(async(x) => {
  //     let guilds = await Guilds.findOne({ guild_id: x.guild_id })
  //     let parent = await bot.channels.cache.get(guilds.get(`tickets.categoryClosed`))
  //     const zeroPad = (n) => n.toString().padStart(2, '0');
  //     let log_msg = []
  //
  //     await parent.children.map(async(channel) => {
  //       const messages = await channel.messages.fetch()
  //       const messages_values = messages.filter(x => x.id != messages.last().id).sort(async(a,b) => a.createdTimestamp-b.createdTimestamp).toJSON()
  //       const last_messages_at = await messages.first().createdAt
  //
  //       if(Date.now() >= last_messages_at.getTime()) {
  //         for (var i in messages_values) {
  //           const ticket_db = await Tickets.findOne({ "log.timestamp": messages_values[i].createdTimestamp })
  //           if(ticket_db){
  //             log_msg.push(ticket_db?.log.filter((x) => x.timestamp == messages_values[i].createdTimestamp)[0].content)
  //           } else {
  //             log_msg.push(`[${zeroPad(messages_values[i].createdAt.getDay() + 3 )}.${zeroPad(messages_values[i].createdAt .getMonth() + 1 )}.${zeroPad(messages_values[i].createdAt.getFullYear())} ${zeroPad(messages_values[i].createdAt.getHours())}:${zeroPad(messages_values[i].createdAt.getMinutes())}:${zeroPad(messages_values[i].createdAt.getSeconds())}] ${messages_values[i].author.tag} [ID: ${messages_values[i].author.id}]: ${messages_values[i].content}`)
  //           }
  //         }
  //
  //         log_msg.reverse()
  //
  //         const creator_db = await Tickets.findOne({ channel_id: channel.id })
  //         fs.appendFileSync(`./${creator_db.ticket_name}.txt`, log_msg.join("\r\n"))
  //         if(creator_db){
  //           let user = await bot.users.fetch(creator_db.discord_id).catch(() => null)
  //           user.send({ content: `Ваш тикет **${creator_db.ticket_name}** был удалён системой. Его расшифровка прикреплена к данному сообщению. \nСпасибо за Ваше обращение!`, files: [`./${creator_db.ticket_name}.txt`] }).catch(() => null);
  //         }
  //         let channelLog = await bot.channels.fetch(guilds.get(`tickets.channelLog`)).catch(() => null)
  //         channelLog.send({ content: `\`[DELETE-TICKET]\` Тикет **${creator_db.ticket_name}** был удалён системой. Его расшифровка прикреплена к данному сообщению`, files: [`./${creator_db.ticket_name}.txt`] }).catch(() => null)
  //
  //         fs.unlinkSync(`./${creator_db.ticket_name}.txt`)
  //
  //         await channel.delete();
  //
  //         await Tickets.deleteOne({ channel_id: channel.id })
  //       }
  //     })
  //
  //   });
  // }, 30000)
}
