const express = require("express");
const cors = require("cors");
const { Manager } = require("erela.js");

const app = express();
app.use(cors());

const manager = new Manager({
  nodes: [
    {
      host: "lava-v4.ajieblogs.eu.org",
      port: 443,
      password: "https://dsc.gg/ajidevserver",
      secure: true,
    },
  ],
  send: () => {}, // necessario per erela.js
});

manager.on("nodeConnect", node =>
  console.log(`✅ Lavalink connesso: ${node.options.host}`)
);

manager.on("nodeError", (node, error) =>
  console.error(`❌ Errore sul nodo ${node.options.host}: ${error.message}`)
);

manager.connect();

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send("Query mancante");
  try {
    const result = await manager.search(query);
    res.json({ tracks: result.tracks });
  } catch (err) {
    console.error("Errore nella ricerca:", err.message);
    res.status(500).send("Errore nel server Lavalink");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Server attivo su http://localhost:${PORT}`));
