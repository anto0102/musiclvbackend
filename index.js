const express = require("express");
const cors = require("cors");
const { Manager } = require("erela.js");

const app = express();
app.use(cors());
app.use(express.json());

const manager = new Manager({
  nodes: [
    {
      host: "lava.link",
      port: 80,
      password: "youshallnotpass",
      secure: false,
    },
  ],
  clientId: "123456789012345678", // metti qui un valore stringa qualsiasi
  send: () => {},
});

manager.on("nodeConnect", node => console.log(`✅ Connesso a ${node.options.host}`));
manager.on("nodeError", (node, err) => console.error(`❌ Errore su ${node.options.host}:`, err));

manager.on("ready", () => {
  console.log("Manager pronto!");
});

manager.init();

app.get("/", (req, res) => {
  res.send("✅ Backend online");
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).send("Query mancante");

  try {
    const result = await manager.search(query);
    res.json({ tracks: result.tracks });
  } catch (err) {
    console.error("Errore nella ricerca:", err.message);
    res.status(500).send("Errore durante la ricerca");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Server attivo su http://localhost:${PORT}`));
