

import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

app.use(express.json());

// Date actuelle en heure de la RDC (Lubumbashi)
function getToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lubumbashi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

// Page principale
app.get("/", (req, res) => {
  res.json({
    projet: "SMART PREDICT",
    statut: "Serveur actif",
    message: "Bienvenue sur SMART PREDICT"
  });
});

// Vérification du serveur
app.get("/api/status", (req, res) => {
  res.json({
    actif: true,
    service: "SMART PREDICT"
  });
});

// Vérification de la connexion API-Football
app.get("/api/api-status", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Clé API absente sur Render"
    });
  }

  try {
    const response = await fetch(`${API_URL}/status`, {
      method: "GET",
      headers: {
        "x-apisports-key": API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Erreur de connexion API-Football",
        details: data
      });
    }

    res.json({
      success: true,
      message: "Connexion API-Football réussie",
      data: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Impossible de contacter API-Football"
    });
  }
});

// Récupération des matchs
app.get("/api/fixtures", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Clé API absente sur Render"
    });
  }

  const date = req.query.date || getToday();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "Date invalide. Format attendu : AAAA-MM-JJ"
    });
  }

  try {
    const params = new URLSearchParams({
      date: date,
      timezone: "Africa/Lubumbashi"
    });

    const response = await fetch(
      `${API_URL}/fixtures?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Erreur lors de la récupération des matchs",
        details: data
      });
    }

    res.json({
      success: true,
      date: date,
      nombre_de_matchs: data.results || 0,
      matchs: data.response || [],
      erreurs_api: data.errors || {}
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur de communication avec API-Football"
    });
  }
});

app.listen(PORT, () => {
  console.log(`SMART PREDICT actif sur le port ${PORT}`);
});
