# Class’Permis – Agent IA

Agent IA personnalisé pour le site **classpermis.com**.

## 🎯 Objectif
- Répondre automatiquement aux questions des visiteurs
- Orienter les clients (boîte automatique / manuelle, tarifs, CPF, pièces à fournir)
- Générer des demandes de rappel envoyées par email
- Limiter au maximum l’utilisation de l’API OpenAI (coûts réduits)

## 🧠 Fonctionnement
- Logique basée sur des règles, FAQ et flows métier
- Appel à OpenAI uniquement en cas de question complexe (fallback)
- Backend hébergé sur Vercel
- Frontend : widget chat intégré au site Medusa / Next.js

## 📩 Leads
Les demandes de rappel sont envoyées par email à :
contact@classpermis.com

## 🔐 Sécurité
- Aucune clé sensible dans le code
- Les variables sont définies dans Vercel (Environment Variables)

## 🚀 Déploiement
1. Projet connecté à GitHub
2. Déploiement automatique via Vercel
3. Intégration du widget sur le site par le développeur

---

Projet interne – Class’Permis
