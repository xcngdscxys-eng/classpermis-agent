export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const message = body.message;
    const state = body.state || null;

    if (!message || typeof message !== "string") {
      return res.status(200).json({
        reply: "Que souhaitez-vous faire ? permis / tarifs / cpf / contact",
        state: "start",
      });
    }

    const text = message.toLowerCase();

    const scenario = {
      start: {
        reply: "Que souhaitez-vous faire ? permis / tarifs / cpf / contact",
        options: {
          permis: "permis",
          tarifs: "tarifs",
          cpf: "cpf",
          contact: "contact",
        },
      },

      permis: {
        reply: "Boite automatique ou manuelle ?",
        options: {
          automatique: "auto",
          manuelle: "manuel",
        },
      },

      auto: {
        reply: "Avec code ou sans code ?",
        options: {
          "avec code": "ask_phone",
          "sans code": "ask_phone",
        },
      },

      manuel: {
        reply: "Avec code ou sans code ?",
        options: {
          "avec code": "ask_phone",
          "sans code": "ask_phone",
        },
      },

      tarifs: {
        reply: "Consultez les tarifs sur le site. Souhaitez-vous etre rappele ?",
        options: {
          oui: "ask_phone",
        },
      },

      cpf: {
        reply: "Formation CPF possible. Souhaitez-vous etre rappele ?",
        options: {
          oui: "ask_phone",
        },
      },

      contact: {
        reply: "Souhaitez-vous etre rappele ?",
        options: {
          oui: "ask_phone",
        },
      },

      ask_phone: {
        reply: "Merci de saisir votre numero de telephone",
        expectPhone: true,
      },
    };

    if (!state) {
      return res.status(200).json({
        reply: scenario.start.reply,
        state: "start",
      });
    }

    const step = scenario[state];

    if (!step) {
      return res.status(200).json({
        reply: scenario.start.reply,
        state: "start",
      });
    }

    if (step.expectPhone) {
      const phone = text.replace(/\s/g, "");
      if (!/^(\+33|0)[1-9]\d{8}$/.test(phone)) {
        return res.status(200).json({
          reply: "Numero incorrect. Reessayez.",
          state,
        });
      }

      return res.status(200).json({
        reply: "Merci. Nous vous rappelons rapidement.",
        state: null,
        phone,
      });
    }

    if (step.options) {
      for (const key in step.options) {
        if (text.includes(key)) {
          return res.status(200).json({
            reply: scenario[step.options[key]].reply,
            state: step.options[key],
          });
        }
      }
    }

    return res.status(200).json({
      reply: step.reply,
      state,
    });
  } catch (e) {
    return res.status(500).json({
      reply: "Erreur serveur",
    });
  }
}
