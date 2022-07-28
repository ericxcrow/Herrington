const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = async (bot, message) => {
  let guilds = await Guilds.findOne({ guild_id: message.guildId })

  if(message?.channel?.id == guilds?.privates?.get('channelText')) {
    setTimeout(async () => {
      await message?.delete().catch(() => null)
    },5000)
  }

}
