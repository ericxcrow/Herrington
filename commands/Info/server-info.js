const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = {
    name: "server-info",
    description: "Посмотреть информацию о сервере.",

    async run (bot, message, args) {
      let guilds = await Guilds.findOne({ guild_id: message.guild.id })
      const banner_url = await message.guild.bannerURL({dynamic: true, size: 2048});
      const avatar_url = await message.guild.iconURL({dynamic: true, size: 1024});

      let language = ``
      if(message.guild.preferredLocale == `en-US`) language = `Английский`
      if(message.guild.preferredLocale == `en-GB`) language = `Английский`
      if(message.guild.preferredLocale == `bg`) language = `Болгарский`
      if(message.guild.preferredLocale == `zh-CN`) language = `Китайский`
      if(message.guild.preferredLocale == `zh-TW`) language = `Китайский`
      if(message.guild.preferredLocale == `hr`) language = `Хорватский`
      if(message.guild.preferredLocale == `cz`) language = `Чешский`
      if(message.guild.preferredLocale == `da`) language = `Датский`
      if(message.guild.preferredLocale == `nl`) language = `Голландский`
      if(message.guild.preferredLocale == `fi`) language = `Финский`
      if(message.guild.preferredLocale == `fr`) language = `Французский`
      if(message.guild.preferredLocale == `de`) language = `Немецкий`
      if(message.guild.preferredLocale == `el`) language = `Греческий`
      if(message.guild.preferredLocale == `hi`) language = `Хинди`
      if(message.guild.preferredLocale == `hu`) language = `Венгерский`
      if(message.guild.preferredLocale == `it`) language = `Итальянский`
      if(message.guild.preferredLocale == `ja`) language = `Японский`
      if(message.guild.preferredLocale == `ko`) language = `Корейский`
      if(message.guild.preferredLocale == `lt`) language = `Литовский`
      if(message.guild.preferredLocale == `no`) language = `Норвежский`
      if(message.guild.preferredLocale == `pl`) language = `Польский`
      if(message.guild.preferredLocale == `pt-BR`) language = `Бразильский`
      if(message.guild.preferredLocale == `ro`) language = `Румынский`
      if(message.guild.preferredLocale == `ru`) language = `Русский`
      if(message.guild.preferredLocale == `es-ES`) language = `Испанский`
      if(message.guild.preferredLocale == `sv-SE`) language = `Шведский`
      if(message.guild.preferredLocale == `th`) language = `Тайский`
      if(message.guild.preferredLocale == `tr`) language = `Турецкий`
      if(message.guild.preferredLocale == `uk`) language = `Украинский`
      if(message.guild.preferredLocale == `vi`) language = `Вьетнамский`

      let embed = new MessageEmbed()
        .setColor(guilds.color)

      embed.setTitle(`Информация о сервере`)
      embed.setDescription(`Название: \`${message.guild.name}\`\nОписание: \`${message.guild.description.replace(/[^a-zа-яё0-9\s]/gi, '')}\`\nЯзык: \`${language}\`\n\nВладелец: <@${message.guild.ownerId}> \`[ID: ${message.guild.ownerId}]\`\nБустов: \`${message.guild.premiumSubscriptionCount} (${message.guild.premiumTier == `NONE`?`0`:message.guild.premiumTier.replace(/TIER_/gi, '')} уровень)\`\nДата создания: <t:${~~(message.guild.createdTimestamp/1000)}:F>\n\nУчастников: \`${message.guild.memberCount}\`\nГолосовой онлайн: \`${message.guild.voiceStates.cache.size}\`\nРолей: \`${message.guild.roles.cache.size}\`\nКаналов: \`${message.guild.channels.cache.size}\`\nЭмодзи: \`${message.guild.emojis.cache.size}\`\nСтикеров: \`${message.guild.stickers.cache.size}\``)
      embed.setThumbnail(avatar_url)
      embed.setImage(banner_url)

      await message.reply({ embeds: [embed] })
    }
}
