const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Заблокировать пользователя.')
		.addUserOption(option =>
			option.setName('пользователь')
			.setDescription('Пользователь, который будет забанен.')
			.setRequired(true))
		.addNumberOption(option =>
			option.setName('время')
			.setDescription('Время блокировки.')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('тип')
			.setDescription('Тип блокировки.')
			.setRequired(true)
			.addChoices(
		{ name: 'минут', value: 'minutes' },
		{ name: 'часов', value: 'hours' },
		{ name: 'дней', value: 'days' },
		))
		.addStringOption(option =>
			option.setName('причина')
			.setDescription('Причина блокировки.')
			.setRequired(true)),
	async execute(interaction, bot, args) {
	},
};
