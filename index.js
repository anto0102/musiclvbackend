const { Manager } = require("erela.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

// Configura il manager di Lavalink
const manager = new Manager({
  nodes: [
    {
      host: "lava.link",
      port: 443,
      password: "youshallnotpass",
      secure: true,
    },
  ],
  clientId: "123456789012345678", // metti un tuo clientId o anche un numero stringa dummy
  send(id, payload) {
    // funzione vuota, serve per Discord ma qui può restare così
  },
});

// Quando il manager è pronto
manager.on("nodeConnect", node => {
  console.log(`Nodo connesso: ${node.options.identifier}`);
});

manager.on("nodeError", (node, error) => {
  console.error(`Errore nodo ${node.options.identifier}:`, error);
});

// Connetti al nodo
manager.connect().catch(console.error);

// API base per test
app.get("/", (req, res) => {
  res.send("Backend Lavalink attivo!");
});

// Endpoint di ricerca esempio
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
