const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Guilds = require('../../schemas/Guilds')

module.exports = async (bot, guild) => {
    let guilds = await Guilds.findOne({ guild_id: guild.id }) ?? Guilds.create({ guild_id: guild.id, moderation: { isModerating: false, mutes: true, mute_role: null }, privates: { isEnabled: false, category: null, channelVoice: null, channelText: null }, tickets: { isEnabled: false, number: 0, categoryOpen: null, categoryHold: null, categoryClosed: null, channelLog: null, channelNew: null } })

    const banner_url = await guild.bannerURL({dynamic: true, size: 2048});
    const avatar_url = await guild.iconURL({dynamic: true, size: 1024});

    let language = ``
    if(guild.preferredLocale == `en-US`) language = `Английский`
    if(guild.preferredLocale == `en-GB`) language = `Английский`
    if(guild.preferredLocale == `bg`) language = `Болгарский`
    if(guild.preferredLocale == `zh-CN`) language = `Китайский`
    if(guild.preferredLocale == `zh-TW`) language = `Китайский`
    if(guild.preferredLocale == `hr`) language = `Хорватский`
    if(guild.preferredLocale == `cz`) language = `Чешский`
    if(guild.preferredLocale == `da`) language = `Датский`
    if(guild.preferredLocale == `nl`) language = `Голландский`
    if(guild.preferredLocale == `fi`) language = `Финский`
    if(guild.preferredLocale == `fr`) language = `Французский`
    if(guild.preferredLocale == `de`) language = `Немецкий`
    if(guild.preferredLocale == `el`) language = `Греческий`
    if(guild.preferredLocale == `hi`) language = `Хинди`
    if(guild.preferredLocale == `hu`) language = `Венгерский`
    if(guild.preferredLocale == `it`) language = `Итальянский`
    if(guild.preferredLocale == `ja`) language = `Японский`
    if(guild.preferredLocale == `ko`) language = `Корейский`
    if(guild.preferredLocale == `lt`) language = `Литовский`
    if(guild.preferredLocale == `no`) language = `Норвежский`
    if(guild.preferredLocale == `pl`) language = `Польский`
    if(guild.preferredLocale == `pt-BR`) language = `Бразильский`
    if(guild.preferredLocale == `ro`) language = `Румынский`
    if(guild.preferredLocale == `ru`) language = `Русский`
    if(guild.preferredLocale == `es-ES`) language = `Испанский`
    if(guild.preferredLocale == `sv-SE`) language = `Шведский`
    if(guild.preferredLocale == `th`) language = `Тайский`
    if(guild.preferredLocale == `tr`) language = `Турецкий`
    if(guild.preferredLocale == `uk`) language = `Украинский`
    if(guild.preferredLocale == `vi`) language = `Вьетнамский`

    let embed = new MessageEmbed()
      .setColor(3158326)

    embed.setTitle(`Информация о сервере`)
    embed.setDescription(`Название: \`${guild.name}\` \`[ID: ${guild.id}]\`\nЯзык: \`${language}\`\n\nВладелец: <@${guild.ownerId}> \`[ID: ${guild.ownerId}]\`\nБустов: \`${guild.premiumSubscriptionCount} (${guild.premiumTier == `NONE`?`0`:guild.premiumTier.replace(/TIER_/gi, '')} уровень)\`\nДата создания: <t:${~~(guild.createdTimestamp/1000)}:F>\n\nУчастников: \`${guild.memberCount}\`\nГолосовой онлайн: \`${guild.voiceStates.cache.size}\`\nРолей: \`${guild.roles.cache.size}\`\nКаналов: \`${guild.channels.cache.size}\`\nЭмодзи: \`${guild.emojis.cache.size}\`\nСтикеров: \`${guild.stickers.cache.size}\``)
    embed.setThumbnail(avatar_url)
    embed.setImage(banner_url)

    let channel = await bot.guilds.cache.get(`947748034962419753`).channels.fetch(`997748047729668147`)
    await channel.send({content: `🗑️ Отключённый сервер`, embeds: [embed]})
}
