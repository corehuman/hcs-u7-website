# HCS-U7 Website

Site web officiel du système **HCS-U7 (Human Cognitive Signature)**, permettant de :

- Générer un profil cognitif HCS-U7 via un questionnaire de 24 questions.
- Visualiser et interpréter le profil (radar chart, descriptions détaillées).
- Générer des prompts adaptés pour **ChatGPT** et **Claude**.
- Consulter la documentation technique, les exemples de profils, les intégrations et la partie recherche.

---

## Stack

- **Framework** : Next.js 14 (App Router)
- **UI** : React, Tailwind CSS v4, shadcn/ui
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Formulaires** : React Hook Form + Zod
- **Charts** : Recharts (radar pour la cognition)
- **Déploiement** : Vercel

---

## Pages principales

- `/` – Homepage : présentation d&apos;HCS-U7, problème, fonctionnement, cas d&apos;usage, open-source.
- `/generate` – Générateur : questionnaire interactif (24 questions) avec barre de progression.
- `/generate/result` – Résultat : code HCS-U7, interprétation, radar chart, prompts ChatGPT/Claude.
- `/docs` – Documentation : introduction, spécification du code, intégrations, robotique, validation, développeurs.
- `/examples` – Exemples : 6 profils types avec dialogues avant/après HCS-U7.
- `/integrations` – Intégrations : OpenAI, Claude, LangChain, parsers & SDKs.
- `/research` – Recherche : protocole empirique, timeline des études, publications, participation.
- `/pricing` – Tarification : gratuit & open-source (individuel) + offre Enterprise à venir.

---

## Développement local

Installation des dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Le site est accessible sur `http://localhost:3000`.

Lint TypeScript / ESLint :

```bash
npm run lint
```

Build de production :

```bash
npm run build
```

---

## Déploiement sur Vercel

Le fichier `vercel.json` est déjà configuré pour un déploiement standard Next.js.

Résumé rapide :

1. Pousser ce dossier sur un dépôt Git (GitHub, GitLab, ...).
2. Créer un projet sur Vercel et lier le dépôt.
3. Vérifier les commandes :
   - Build : `npm run build`
   - Install : `npm install`
4. Ajouter la variable d&apos;environnement :
   - `NEXT_PUBLIC_SITE_URL` = URL publique du site (ex. `https://hcs-u7.vercel.app`).
5. Lancer le déploiement.

Pour un guide détaillé (checklist pré-lancement, CLI, etc.), voir :

- `WEBSITE_DEPLOYMENT.md`
