export default function handler(req, res) {
  try {
    // Autoriser uniquement POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Sécurité si body absent ou incorrect
    const body = req.body || {};
    const message = body.message;

    if (!message || typeof message !== "string") {
      return res.status(200).json({
        reply:
          "Pouvez-vous reformuler votre question concernant le permis de conduire ou l’inscription ?"
      });
    }

    const text = message.toLowerCase();

    // 🔹 Permis automatique / manuel
    if (text.includes("automatique") || text.includes("manuel")) {
      return res.status(200).json({
        reply:
          "Souhaitez-vous passer le permis en boîte automatique ou manuelle ? Nous proposons les deux formules."
      });
    }

    // 🔹 Tarifs
    if (text.includes("prix") || text.includes("tarif") || text.includes("coût")) {
      return res.status(200).json({
        reply:
          "Vous pouvez consulter nos tarifs directement sur la page Tarifs du site Class’Permis."
      });
    }

    // 🔹 CPF
    if (text.includes("cpf") || text.includes("compte formation")) {
      return res.status(200).json({
        reply:
          "Oui, la formation est finançable via le CPF sous conditions. Nous pouvons vous accompagner dans les démarches."
      });
    }

    // 🔹 Contact / rappel
    if (
      text.includes("contact") ||
      text.includes("rappel") ||
      text.includes("téléphone") ||
      text.includes("telephone")
    ) {
      return res.status(200).json({
        reply:
          "Souhaitez-vous être rappelé ? Vous pouvez aussi nous contacter via le formulaire du site Class’Permis."
      });
    }

    // 🔹 Fallback sécurisé (ne plante jamais)
    return res.status(200).json({
      reply:
        "Je n’ai pas encore cette information. Souhaitez-vous être rappelé par l’auto-école ou poser une autre question ?"
    });
  } catch (error) {
    // Sécurité ultime
    return res.status(200).json({
      reply:
        "Une erreur est survenue. Vous pouvez nous contacter directement via le site Class’Permis."
    });
  }
}
