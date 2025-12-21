export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Message manquant" });
  }

  const text = message.toLowerCase();

  // Règles simples (sans IA)
  if (text.includes("automatique") || text.includes("manuel")) {
    return res.status(200).json({
      reply:
        "Souhaitez-vous passer le permis en boîte automatique ou manuelle ? Nous proposons les deux formules."
    });
  }

  if (text.includes("prix") || text.includes("tarif")) {
    return res.status(200).json({
      reply:
        "Vous pouvez consulter nos tarifs directement sur la page Tarifs du site Class’Permis."
    });
  }

  if (text.includes("cpf")) {
    return res.status(200).json({
      reply:
        "Oui, la formation est finançable via le CPF sous conditions. Nous pouvons vous accompagner."
    });
  }

  if (text.includes("contact") || text.includes("rappel")) {
    return res.status(200).json({
      reply:
        "Souhaitez-vous être rappelé ? Vous pouvez aussi nous contacter via le formulaire du site."
    });
  }

  // Fallback
  return res.status(200).json({
    reply:
      "Je n’ai pas encore cette information. Souhaitez-vous être rappelé par l’auto-école ?"
  });
}
