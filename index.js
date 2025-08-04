const { Manager } = require("erela.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const manager = new Manager({
  nodes: [
    {
      host: "lava-v4.ajieblogs.eu.org",
      port: 443,
      password: "https://dsc.gg/ajidevserver",
      secure: true,
    },
  ],
  // Se usi Discord bot, qui va il clientId (ma per player semplice puoi lasciare una stringa dummy)
  clientId: "000000000000000000",
  send: () => {}, // funzione vuota per ora, serve se usi Discord
});

// Connect the Lavalink manager
manager.on("nodeConnect", node => {
  console.log(`🔗 Nodo Lavalink connesso: ${node.options.host}`);
});

manager.on("nodeError", (node, error) => {
  console.error(`❌ Errore nodo ${node.options.host}:`, error);
});

manager.on("nodeDisconnect", node => {
  console.warn(`⚠️ Nodo scollegato: ${node.options.host}`);
});

// Inizializza manager (connetti ai nodi)
manager.init();

app.get("/", (req, res) => {
  res.send("Backend Lavalink erela.js attivo!");
});

// Qui potresti aggiungere endpoint per fare search, play, ecc.
// Per ora solo test endpoint base

app.listen(PORT, () => {
  console.log(`🟢 Server backend attivo su http://localhost:${PORT}`);
});
