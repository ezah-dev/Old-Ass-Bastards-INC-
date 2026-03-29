const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});


const TOKEN = process.env.TOKEN;
const ABMELDUNG_CHANNEL_ID = "1487609274917064926";
const MOD_CHANNEL_ID = "1487609394903650368";

client.once(Events.ClientReady, async () => {
  console.log("Bot ist online!");

  const channel = await client.channels.fetch(ABMELDUNG_CHANNEL_ID);

  const embed = new EmbedBuilder()
    .setTitle("📋 Abmeldung")
    .setDescription("Drücke auf den Button, um dich abzumelden.")
    .setColor("Blue");

  const button = new ButtonBuilder()
    .setCustomId("abmeldung")
    .setLabel("Abmelden")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  channel.send({
    embeds: [embed],
    components: [row]
  });
});

client.on(Events.InteractionCreate, async interaction => {

  
  if (interaction.isButton()) {
    if (interaction.customId === "abmeldung") {

      const modal = new ModalBuilder()
        .setCustomId("abmeldung_modal")
        .setTitle("Abmeldung einreichen");

      const name = new TextInputBuilder()
        .setCustomId("name")
        .setLabel("Name")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const id = new TextInputBuilder()
        .setCustomId("id")
        .setLabel("ID")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const von = new TextInputBuilder()
        .setCustomId("von")
        .setLabel("Von (z.B. 29.03)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const bis = new TextInputBuilder()
        .setCustomId("bis")
        .setLabel("Bis (z.B. 04.04)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const grund = new TextInputBuilder()
        .setCustomId("grund")
        .setLabel("Begründung")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder().addComponents(name),
        new ActionRowBuilder().addComponents(id),
        new ActionRowBuilder().addComponents(von),
        new ActionRowBuilder().addComponents(bis),
        new ActionRowBuilder().addComponents(grund)
      );

      await interaction.showModal(modal);
    }
  }

  
  if (interaction.isModalSubmit()) {

    const modChannel = await client.channels.fetch(MOD_CHANNEL_ID);

    const embed = new EmbedBuilder()
      .setTitle("📥 Neue Abmeldung")
      .addFields(
        { name: "👤 Name", value: interaction.fields.getTextInputValue("name") },
        { name: "🆔 ID", value: interaction.fields.getTextInputValue("id") },
        { name: "📅 Von", value: interaction.fields.getTextInputValue("von") },
        { name: "📅 Bis", value: interaction.fields.getTextInputValue("bis") },
        { name: "📝 Begründung", value: interaction.fields.getTextInputValue("grund") }
      )
      .setColor("Red")
      .setFooter({ text: `Von: ${interaction.user.tag}` });

    modChannel.send({ embeds: [embed] });

    await interaction.reply({
      content: "✅ Abmeldung erfolgreich gesendet!",
      ephemeral: true
    });
  }
});

client.login(TOKEN);