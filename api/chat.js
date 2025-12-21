export default function handler(req, res) {
  // 🔐 CORS (à restreindre à ton domaine Medusa en prod)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, state } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(200).json({
        reply:
          "Pouvez-vous préciser votre demande concernant le permis de conduire ?",
        state: null,
      });
    }

    // 🔹 Normalisation simple
    const text = message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // 🧠 SCÉNARIO GUIDÉ — PERMIS
    const scenario = {
      start: {
        reply:
          "Souhaitez-vous passer le permis en boîte automatique ou manuelle ?",
        options: {
          automatique: "auto",
          manuelle: "manuel",
        },
      },

      auto: {
        reply:
          "Très bien. Souhaitez-vous passer le permis en boîte automatique avec ou sans le code ?",
        options: {
          "avec code": "auto_avec_code",
          "sans code": "auto_sans_code",
        },
      },

      auto_avec_code: {
        reply:
          "Parfait. Souhaitez-vous être rappelé pour un devis personnalisé ou consulter nos offres en ligne ?",
        end: true,
      },

      auto_sans_code: {
        reply:
          "Très bien. Souhaitez-vous être rappelé par l’auto-école pour finaliser votre inscription ?",
        end: true,
      },

      manuel: {
        reply:
          "Très bien. Souhaitez-vous passer le permis en boîte manuelle avec ou sans le code ?",
        options: {
          "avec code": "manuel_avec_code",
          "sans code": "manuel_sans_code",
        },
      },

      manuel_avec_code: {
        reply:
          "Parfait. Souhaitez-vous être rappelé pour un devis personnalisé ou consulter nos offres ?",
        end: true,
      },

      manuel_sans_code: {
        reply:
          "Très bien. Souhaitez-vous être rappelé par l’auto-école pour finaliser votre inscription ?",
        end: true,
      },
    };

    // ▶️ Démarrage du scénario
    if (!state) {
      return res.status(200).json({
        reply: scenario.start.reply,
        state: "start",
      });
    }

    const currentStep = scenario[state];

    if (!currentStep) {
      return res.status(200).json({
        reply:
          "Souhaitez-vous être rappelé par l’auto-école ou poser une autre question ?",
        state: null,
      });
    }

    // 🔁 Gestion des transitions
    if (currentStep.options) {
      for (const keyword in currentStep.options) {
        if (text.includes(keyword)) {
          const nextState = currentStep.options[keyword];
          const nextStep = scenario[nextState];

          return res.status(200).json({
            reply: nextStep.reply,
            state: nextStep.end ? null : nextState,
          });
        }
      }
    }

    // ❌ Réponse non comprise → on repose la même question
    return res.status(200).json({
      reply: currentStep.reply,
      state,
    });
  } catch (error) {
    return res.status(200).json({
      reply:
        "Une erreur est survenue. Vous pouvez nous contacter directement via le site Class’Permis.",
      state: null,
    });
  }
}
