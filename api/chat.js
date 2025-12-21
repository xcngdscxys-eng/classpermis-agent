export default function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const body = req.body || {};
    const message = body.message;

    if (!message || typeof message !== "string") {
      return res.status(200).json({
        reply:
          "Pouvez-vous reformuler votre question concernant le permis ou l’inscription ?"
      });
    }

    const text = message.toLowerCase();

    // 🔹 CPF (très spécifique)
    if (text.includes("cpf") || text.includes("compte formation")) {
      return res.status(200).json({
        reply:
          "Oui, la formation est finançable via le CPF sous conditions. Souhaitez-vous que l’on vérifie votre éligibilité ?"
      });
    }

    // 🔹 Tarifs
    if (
      text.includes("prix") ||
      text.includes("tarif") ||
      text.includes("coût")
    ) {
      return res.status(200).json({
        reply:
          "Vous pouvez consulter nos tarifs directement sur la page Tarifs du site Class’Permis. Souhaitez-vous un conseil personnalisé ?"
      });
    }

    // 🔹 Documents
    if (
      text.includes("document") ||
      text.includes("pièce") ||
      text.includes("inscription")
    ) {
      return res.status(200).json({
        reply:
          "Les pièces à fournir sont généralement : pièce d’identité, justificatif de domicile, photos e-photo, ASSR2 (si concerné) et JDC selon l’âge. Certaines inscriptions ont des particularités."
      });
    }

    // 🔹 Permis automatique
    if (text.includes("automatique")) {
      return res.status(200).json({
        reply:
          "Très bien. Souhaitez-vous passer le permis en boîte automatique avec ou sans le code ?"
      });
    }

    // 🔹 Permis manuel
    if (text.includes("manuel")) {
      return res.status(200).json({
        reply:
          "Très bien. Souhaitez-vous passer le permis en boîte manuelle avec ou sans le code ?"
      });
    }

    // 🔹 Demande générale sur le permis (PLUS GÉNÉRAL)
    if (text.includes("permis")) {
      return res.status(200).json({
        reply:
          "Souhaitez-vous passer le permis en boîte automatique ou manuelle ?"
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
          "Souhaitez-vous être rappelé par l’auto-école ou préférez-vous nous contacter via le formulaire du site ?"
      });
    }

    // 🔹 Fallback final
    return res.status(200).json({
      reply:
        "Je n’ai pas encore cette information. Souhaitez-vous être rappelé par l’auto-école ou poser une autre question ?"
    });
  } catch (error) {
    return res.status(200).json({
      reply:
        "Une erreur est survenue. Vous pouvez nous contacter directement via le site Class’Permis."
    });
  }
}
