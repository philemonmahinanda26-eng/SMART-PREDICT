
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    projet: "SMART PREDICT",
    statut: "Serveur actif",
    message: "Bienvenue sur SMART PREDICT"
  });
});

app.get("/api/status", (req, res) => {
  res.json({
    actif: true,
    service: "SMART PREDICT"
  });
});

app.listen(PORT, () => {
  console.log(`SMART PREDICT actif sur le port ${PORT}`);
});
