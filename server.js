
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_FOOTBALL_KEY;
const API_URL = "https://v3.football.api-sports.io";

app.use(express.json());

function getToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lubumbashi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

// INTERFACE SMART PREDICT
app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#101a17">
<title>SMART PREDICT</title>

<style>
*{box-sizing:border-box}
body{
  margin:0;
  background:#101a17;
  color:#f5f7f5;
  font-family:Arial,sans-serif;
}
header{
  padding:22px 18px;
  background:#172620;
  border-bottom:1px solid #294037;
}
.brand{font-size:23px;font-weight:900;letter-spacing:1px}
.brand span{color:#48db91}
.subtitle{color:#9eafa5;font-size:12px;margin-top:7px}
main{max-width:900px;margin:auto;padding:20px 15px}
.welcome{
  background:linear-gradient(135deg,#204c38,#142820);
  padding:23px;
  border-radius:18px;
  margin-bottom:20px;
}
.welcome h1{font-size:25px;margin:0 0 10px}
.welcome p{color:#d0e5d9;font-size:13px;line-height:1.6}
.status{
  display:inline-block;
  background:#174b35;
  color:#65e5a4;
  border:1px solid #327b55;
  border-radius:30px;
  padding:7px 12px;
  font-size:11px;
  margin-top:8px;
}
.section-title{font-size:18px;font-weight:bold;margin:24px 0 14px}
.stats{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:10px;
}
.stat{
  background:#1b2a24;
  border:1px solid #2c4036;
  padding:15px 9px;
  border-radius:13px;
}
.stat strong{display:block;font-size:23px;color:#52df98}
.stat small{font-size:11px;color:#aabbb1}
.controls{
  display:flex;
  gap:9px;
  margin-bottom:15px;
}
input,button{
  border-radius:10px;
  padding:13px;
  font-size:13px;
}
input{
  min-width:0;
  flex:1;
  background:#1b2a24;
  color:white;
  border:1px solid #405449;
}
button{
  background:#42d78d;
  border:0;
  color:#102019;
  font-weight:bold;
  cursor:pointer;
}
button:disabled{opacity:.6}
.message{
  background:#1b2a24;
  border:1px solid #34473d;
  padding:18px;
  border-radius:12px;
  color:#b8c8bf;
  font-size:13px;
  line-height:1.6;
  text-align:center;
}
.match{
  background:#1b2a24;
  border:1px solid #30453a;
  border-radius:14px;
  padding:15px;
  margin-bottom:12px;
}
.league{
  color:#a6b8ac;
  font-size:11px;
  padding-bottom:13px;
  border-bottom:1px solid #304238;
}
.teams{
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
  gap:8px;
  padding:17px 0;
}
.team{text-align:center;font-size:12px;font-weight:bold}
.team img{width:34px;height:34px;object-fit:contain;display:block;margin:0 auto 8px}
.score{font-size:20px;font-weight:900;color:#53df98}
.match-status{
  text-align:center;
  color:#a6b8ac;
  font-size:11px;
}
.live{color:#ff7777}
.footer{
  text-align:center;
  padding:30px 10px;
  color:#7e9286;
  font-size:11px;
}
@media(max-width:400px){
  .welcome h1{font-size:21px}
  .controls{flex-wrap:wrap}
  .controls input{flex-basis:100%}
  .controls button{width:100%}
}
</style>
</head>

<body>

<header>
  <div class="brand">SMART <span>PREDICT</span></div>
  <div class="subtitle">FOOTBALL INTELLIGENCE PLATFORM</div>
</header>

<main>

<section class="welcome">
  <h1>Bienvenue sur SMART PREDICT</h1>
  <p>Votre centre d'analyse du football. Consultez les rencontres et suivez les résultats depuis un seul tableau de bord.</p>
  <div class="status">● PLATEFORME EN LIGNE</div>
</section>

<div class="section-title">Vue générale</div>

<section class="stats">
  <div class="stat">
    <strong id="total">0</strong>
    <small>Matchs</small>
  </div>
  <div class="stat">
    <strong id="live">0</strong>
    <small>En direct</small>
  </div>
  <div class="stat">
    <strong id="finished">0</strong>
    <small>Terminés</small>
  </div>
</section>

<div class="section-title">Calendrier des matchs</div>

<div class="controls">
  <input type="date" id="matchDate">
  <button id="refresh" onclick="loadMatches()">Actualiser</button>
</div>

<div id="message" class="message">
  Chargement des rencontres...
</div>

<div id="matches"></div>

<div class="section-title">Centre des pronostics</div>

<div class="message">
  Le module d'analyse intelligente sera activé après la mise en place du moteur de prédiction et de sa validation historique.
  <br><br>
  Aucun taux de réussite n'est inventé.
</div>

<div class="footer">
  SMART PREDICT · FOOTBALL ANALYTICS<br>
  Données fournies par API-Football
</div>

</main>

<script>
function escapeHTML(value){
  return String(value == null ? "" : value).replace(/[&<>"']/g,function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
  });
}

function localDate(){
  var d = new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

document.getElementById("matchDate").value = localDate();

function matchCard(m){
  var f = m.fixture || {};
  var league = m.league || {};
  var home = m.teams && m.teams.home ? m.teams.home : {};
  var away = m.teams && m.teams.away ? m.teams.away : {};
  var goals = m.goals || {};
  var status = f.status || {};
  var started = status.short !== "NS";
  var score = started
    ? (goals.home == null ? "-" : goals.home)+" - "+(goals.away == null ? "-" : goals.away)
    : "VS";
  var live = ["1H","2H","HT","ET","P","LIVE"].indexOf(status.short) !== -1;
  var statusText = live
    ? "EN DIRECT"
    : status.long || "À venir";

  return '<div class="match">' +
    '<div class="league">'+escapeHTML(league.name || "Compétition")+" · "+escapeHTML(league.country || "")+'</div>' +
    '<div class="teams">' +
      '<div class="team"><img src="'+escapeHTML(home.logo || "")+'" onerror="this.style.display=\'none\'">'+escapeHTML(home.name || "Équipe à confirmer")+'</div>' +
      '<div class="score">'+score+'</div>' +
      '<div class="team"><img src="'+escapeHTML(away.logo || "")+'" onerror="this.style.display=\'none\'">'+escapeHTML(away.name || "Équipe à confirmer")+'</div>' +
    '</div>' +
    '<div class="match-status '+(live ? "live" : "")+'">'+escapeHTML(statusText)+'</div>' +
  '</div>';
}

async function loadMatches(){
  var date = document.getElementById("matchDate").value;
  var button = document.getElementById("refresh");
  var message = document.getElementById("message");
  var container = document.getElementById("matches");

  if(!date){
    message.textContent = "Choisissez une date.";
    return;
  }

  button.disabled = true;
  button.textContent = "Chargement...";
  message.textContent = "Récupération des rencontres...";
  container.innerHTML = "";

  try{
    var response = await fetch("/api/fixtures?date="+encodeURIComponent(date));
    var data = await response.json();

    if(!response.ok || !data.success){
      throw new Error(data.message || "Erreur de récupération des matchs.");
    }

    var matches = data.matchs || [];
    var liveCount = matches.filter(function(m){
      return ["1H","2H","HT","ET","P","LIVE"].indexOf(
        m.fixture && m.fixture.status ? m.fixture.status.short : ""
      ) !== -1;
    }).length;

    var finishedCount = matches.filter(function(m){
      return ["FT","AET","PEN"].indexOf(
        m.fixture && m.fixture.status ? m.fixture.status.short : ""
      ) !== -1;
    }).length;

    document.getElementById("total").textContent = matches.length;
    document.getElementById("live").textContent = liveCount;
    document.getElementById("finished").textContent = finishedCount;

    if(matches.length === 0){
      message.textContent = "Aucun match disponible pour cette date avec les données reçues.";
    }else{
      message.textContent = matches.length+" rencontre(s) trouvée(s).";
      container.innerHTML = matches.map(matchCard).join("");
    }

  }catch(error){
    message.textContent = "Impossible de charger les matchs : "+error.message;
  }finally{
    button.disabled = false;
    button.textContent = "Actualiser";
  }
}

loadMatches();
</script>
</body>
</html>`);
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
    const response = await fetch(API_URL + "/status", {
      headers: { "x-apisports-key": API_KEY }
    });

    const data = await response.json();

    res.status(response.ok ? 200 : 502).json({
      success: response.ok,
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
      message: "Format de date invalide"
    });
  }

  try {
    const params = new URLSearchParams({
      date: date,
      timezone: "Africa/Lubumbashi"
    });

    const response = await fetch(
      API_URL + "/fixtures?" + params.toString(),
      {
        headers: { "x-apisports-key": API_KEY }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Erreur API-Football",
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
  console.log("SMART PREDICT actif sur le port " + PORT);
});
