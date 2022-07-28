const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "avatar",
    description: "Посмотреть аватар пользователя.",
    async run (bot, message, args) {
    let guilds = await Guilds.findOne({ guild_id: message.guild.id })

    const user = message.mentions.users.first();
    let id = user?.id ?? args[0]
    let fetched_user = await message.guild.members.fetch(id)
    const url = await (fetched_user.user?fetched_user.user:message.author).avatarURL({dynamic: true, size: 1024});

    if(!url) return message.reply({
      embeds: [{
        title: `❌ | Упс, ошибка`,
        description: `У данного пользвателя нет аватара`
      }]
    });

    if(!id) {
      message.reply({
        embeds: [{
          description: `**Аватар пользователя ${message.author}**`,
          image: {url},
          color: guilds.color
        }]
      })
    } else  message.reply({
        embeds: [{
            description: `**Аватар пользователя ${fetched_user}**`,
            image: {url},
            color: guilds.color
        }]
      });

    }
}
