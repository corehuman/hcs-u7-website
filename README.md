# HCS-U7 Website

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zefparis/HCS-U7-website)

Site web officiel du système **HCS-U7 (Human Cognitive Signature)**, permettant de :

- Générer un profil cognitif HCS-U7 via un questionnaire de 24 questions.
- Visualiser et interpréter le profil (radar chart, descriptions détaillées).
- Générer des prompts adaptés pour **ChatGPT** et **Claude**.
- Consulter la documentation technique, les exemples de profils, les intégrations et la partie recherche.

---

## Stack

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS v4, shadcn/ui
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Formulaires** : React Hook Form + Zod
- **Charts** : Recharts (radar pour la cognition)
- **TypeScript** : v5 avec configuration optimisée
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
- `/cognitive-tests` – Tests cognitifs : suite de tests interactifs (Stroop, N-Back) pour validation empirique.

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

Le projet est configuré pour un déploiement automatique sur Vercel.

### Configuration requise

1. **Dépôt Git** : Le code est hébergé sur GitHub à [github.com/zefparis/HCS-U7-website](https://github.com/zefparis/HCS-U7-website)
2. **Commandes de build** :
   - Install : `npm install`
   - Build : `npm run build`
3. **Variables d'environnement** :
   - `NEXT_PUBLIC_SITE_URL` = URL publique du site (ex. `https://hcs-u7.vercel.app`)

### Notes techniques

- **Tailwind CSS v4** : Utilise la nouvelle syntaxe `@import` et `@theme inline`
- **TypeScript** : Configuration optimisée pour Next.js 16 avec `jsx: "react-jsx"` et `moduleResolution: "bundler"`
- **PostCSS** : Configure avec `@tailwindcss/postcss` pour Tailwind v4

### Déploiement

Le déploiement est automatique à chaque push sur la branche `main`.

Pour un guide détaillé (checklist pré-lancement, CLI, etc.), voir :

- `DEPLOYMENT.md`

---

## Fonctionnalités récentes

### Tests cognitifs interactifs

Le site inclut maintenant une suite complète de 5 tests neurocognitifs validés scientifiquement pour la validation empirique du système HCS-U7 :

- **Test de Stroop** : Évalue le contrôle inhibiteur et l'attention sélective
- **Test N-Back** : Mesure la mémoire de travail et la capacité de mise à jour
- **Trail Making Test** : Évalue la flexibilité cognitive et la vitesse de traitement (parties A et B)
- **Digit Span Test** : Mesure la mémoire à court terme (forward/backward span)
- **Reaction Time Test** : Évalue la vitesse de traitement et le temps de réaction (simple/choice RT)
- Interface moderne avec animations fluides et feedback en temps réel
- Sauvegarde automatique des résultats dans sessionStorage
- Collecte de données pour la recherche sur les signatures cognitives

### Architecture technique

- **Composants modulaires** : Architecture basée sur des composants réutilisables (shadcn/ui)
- **Performance optimisée** : Next.js 16 avec React 19 pour des performances maximales
- **Type-safe** : TypeScript v5 avec configuration stricte
- **Responsive design** : Interface adaptative pour tous les appareils

---

## Troubleshooting

### Erreurs TypeScript avec Tailwind CSS v4

Si vous rencontrez des erreurs de type avec Tailwind CSS v4, assurez-vous que :
- Le fichier `tailwind.config.ts` n'importe pas le type `Config`
- La configuration TypeScript utilise `"moduleResolution": "bundler"`

### Module resolution errors

En cas d'erreur de résolution de modules :
1. Redémarrez le serveur TypeScript dans VS Code (`Ctrl+Shift+P` → "TypeScript: Restart TS Server")
2. Supprimez le dossier `.next` et reconstruisez : `rm -rf .next && npm run dev`
