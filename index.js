const { Manager } = require("erela.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const manager = new Manager({
  nodes: [
    {
      host: "lava-v3.ajieblogs.eu.org",
      port: 443,
      password: "https://dsc.gg/ajidevserver",
      secure: true,
    },
  ],
  clientId: "123456789012345678", // Puoi mettere un ID qualsiasi come stringa
  send(id, payload) {
    // Funzione vuota, serve solo per Discord bot, qui lascia così
  },
});

manager.on("nodeConnect", (node) => {
  console.log(`Nodo connesso: ${node.options.host}`);
});

manager.on("nodeError", (node, error) => {
  console.error(`Errore nodo ${node.options.host}:`, error);
});

manager.connect().catch(console.error);

app.get("/", (req, res) => {
  res.send("Backend Lavalink attivo!");
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send("Query mancante");

  try {
    const results = await manager.search(query, "youtube");
    res.json(results);
  } catch (err) {
    res.status(500).send("Errore ricerca: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Server backend attivo su http://localhost:${PORT}`);
});
