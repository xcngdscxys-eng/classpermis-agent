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

  // 🧠 SCÉNARIO GUIDÉ — MENU DE DÉPART
const scenario = {
  start: {
    reply:
      "Bonjour 👋 Que souhaitez-vous faire ?\n\n" +
      "1️⃣ Passer le permis\n" +
      "2️⃣ Consulter les tarifs\n" +
      "3️⃣ Financement CPF\n" +
      "4️⃣ Être rappelé par l’auto-école",
    options: {
      permis: "permis",
      "passer le permis": "permis",
      tarif: "tarifs",
      tarifs: "tarifs",
      cpf: "cpf",
      financement: "cpf",
      rappel: "contact",
      appeler: "contact",
    },
  },

  // 🚗 PERMIS
  permis: {
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
      "Parfait 👍 Souhaitez-vous être rappelé pour un devis personnalisé ou consulter nos offres en ligne ?",
    next: "ask_phone"
  },

  auto_sans_code: {
    reply:
      "Très bien 👍 Souhaitez-vous être rappelé par l’auto-école pour finaliser votre inscription ?",
    next: "ask_phone"
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
      "Parfait 👍 Souhaitez-vous être rappelé pour un devis personnalisé ou consulter nos offres ?",
    next: "ask_phone"
  },

  manuel_sans_code: {
    reply:
      "Très bien 👍 Souhaitez-vous être rappelé par l’auto-école pour finaliser votre inscription ?",
    next: "ask_phone"
      // 📱 DEMANDE DE TÉLÉPHONE
  ask_phone: {
    reply:
      "Parfait 👍 Pouvez-vous me communiquer votre numéro de téléphone pour qu’un conseiller Class’Permis vous rappelle ?",
    expectPhone: true,
  },

  phone_received: {
    reply:
      "Merci 😊 Un conseiller Class’Permis vous contactera très rapidement.",
    next: "ask_phone"
  },

  // 💰 TARIFS
  tarifs: {
    reply:
      "Vous pouvez consulter nos tarifs directement sur le site Class’Permis.\n\nSouhaitez-vous également être rappelé pour un conseil personnalisé ?",
    next: "ask_phone"
  },

  // 🎓 CPF
  cpf: {
    reply:
      "Oui, la formation est finançable via le CPF sous conditions.\n\nSouhaitez-vous que l’on vérifie votre éligibilité par téléphone ?",
next: "ask_phone"
  },

  // 📞 CONTACT
  contact: {
    reply:
      "Très bien 👍 Souhaitez-vous être rappelé par l’auto-école ?",
    next: "ask_phone"
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
