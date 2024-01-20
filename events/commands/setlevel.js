import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { getIdFromUser, getUserPFP } from '../../RobloxAPI.js'; 
import { Datastore } from 'rblx.js';
import dotenv from 'dotenv';
dotenv.config();

// Creates an Object in JSON with the data required by Discord's API to create a SlashCommand
const create = () => {
	const command = new SlashCommandBuilder()
		.setName('setlevel')
		.setDescription('Sets user level.')
		.addStringOption(option =>
		option.setName('username')
			.setDescription('The username of the user.')
			.setRequired(true)
		)
		.addIntegerOption(option =>
		option.setName('level')
			.setDescription('Level')
			.setRequired(true)
		)
		.setDMPermission(false);

  return command.toJSON();
};

// Called by the interactionCreate event listener when the corresponding command is invoked
const invoke = async (interaction) => {


	const guild = interaction.guild;

	const allowedRoleName = process.env.WHITELIST_ROLE;
  	const allowedRole = guild.roles.cache.find(role => role.name === allowedRoleName);
  	if (!allowedRole || !interaction.member.roles.cache.has(allowedRole.id)) {
    	return interaction.reply('You do not have the required role to use this command.');
  	}

	const username = interaction.options.getString('username');
	const level = interaction.options.getInteger("level");

	const userResponse = await getIdFromUser(username);
	const userId = userResponse.data[0]?.id; 
	const datastore = new Datastore(process.env.UNIVERSE_ID, process.env.OPENCLOUD_API_KEY);
	
	const stats = await datastore.GetAsync(process.env.DATASTORE_NAME, userId);
	const new_stats = await datastore.SetAsync(process.env.DATASTORE_NAME, userId, {
		"Credits": stats.Credits,
		"Level": parseInt(level, 10)
	});
	const PFPUrl = await getUserPFP(userId);


	const embed = new EmbedBuilder().setTitle(`${username}'s Stats`).addFields([
		{
			name: 'Old Level',
			value: `\`${stats.Level}\``,
			inline: true,
		},
		{
			name: ' New Level',
			value: `\`${level}\``,
			inline: true,
		},
	]);

	embed
		.setColor('Green')
		.setDescription("Sucessfully changed.")
		.setFooter({ text: 'bot by arifexta' })
		.setTimestamp()
		.setAuthor({
			name: process.env.GAME_OR_GROUP_NAME,
			url: process.env.GAME_OR_GROUP_URL,
			iconURL: process.env.GAME_OR_GROUP_ICON,
		})
		.setImage(guild.iconURL())
		.setThumbnail(PFPUrl);

	// Reply to the user
	interaction.reply({
		embeds: [embed],
	});
};

export { create, invoke };
