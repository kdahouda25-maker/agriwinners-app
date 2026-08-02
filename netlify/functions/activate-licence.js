// Fonction serveur Netlify — active une clé de licence AgriWinners auprès de Chariow.
// La clé API Chariow reste ICI, côté serveur, jamais dans le code de l'application.
// Elle doit être configurée dans Netlify : Site configuration -> Environment variables -> CHARIOW_API_KEY

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return reponse(405, { ok: false, message: "Méthode non autorisée." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return reponse(400, { ok: false, message: "Requête invalide." });
  }

  const cle = (body.cle || "").trim();
  const deviceId = (body.device_id || "").trim();

  if (!cle) {
    return reponse(400, { ok: false, message: "Entrez votre clé d'accès." });
  }

  const apiKey = process.env.CHARIOW_API_KEY;
  if (!apiKey) {
    return reponse(500, { ok: false, message: "Configuration serveur incomplète. Contactez le support." });
  }

  try {
    const res = await fetch(
      `https://api.chariow.com/v1/licenses/${encodeURIComponent(cle)}/activate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ device_identifier: deviceId })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return reponse(res.status, { ok: false, message: traduireErreur(data.message) });
    }

    return reponse(200, {
      ok: true,
      activations_restantes: data.data.activations_remaining,
      expire_le: data.data.expires_at
    });
  } catch (e) {
    return reponse(502, { ok: false, message: "Impossible de joindre le serveur de licence. Réessayez." });
  }
};

function reponse(statusCode, obj) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  };
}

function traduireErreur(msg) {
  if (!msg) return "Clé invalide.";
  if (/revoked/i.test(msg)) return "Cette clé a été désactivée. Contactez le support AgriWinners.";
  if (/expired/i.test(msg)) return "Cette clé a expiré. Contactez le support AgriWinners.";
  if (/limit/i.test(msg)) return "Cette clé est déjà utilisée sur 2 appareils. Écrivez-nous sur WhatsApp pour un changement de téléphone.";
  if (/No query results/i.test(msg)) return "Clé introuvable. Vérifiez les caractères et réessayez.";
  return "Clé invalide.";
}
