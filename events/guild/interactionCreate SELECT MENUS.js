const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = async (bot, interaction, args) => {

  if(interaction.isSelectMenu()){
    const customId = interaction.customId;
    const customIdArgs = customId.split(".")
    if(customIdArgs.length == 1){
      try {
        const functionSelect = require(`../../select-menus/${interaction.customId}`);
        if(functionSelect){
          functionSelect(bot, interaction);
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
