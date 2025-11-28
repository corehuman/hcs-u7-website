# HCS-U7 Website

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zefparis/HCS-U7-website)

Site web officiel du système **HCS-U7 (Human Cognitive Signature)**, une plateforme complète pour le profilage cognitif et la sécurité biométrique cognitive.

## 🚀 Fonctionnalités principales

### 📊 Profilage Cognitif
- Générer un profil cognitif HCS-U7 via un questionnaire de 24 questions
- Visualiser et interpréter le profil (radar chart, descriptions détaillées)
- Générer des prompts adaptés pour **ChatGPT** et **Claude**
- Consulter la documentation technique, exemples, intégrations et recherche

### 🧠 Tests Neurocognitifs
- **5 tests validés scientifiquement** pour mesurer les capacités cognitives :
  - **Stroop Test** : Contrôle inhibiteur et attention sélective
  - **N-Back Test** : Mémoire de travail et mise à jour
  - **Trail Making Test** : Flexibilité cognitive (parties A & B)
  - **Digit Span Test** : Mémoire à court terme (forward/backward)
  - **Reaction Time Test** : Vitesse de traitement (simple/choice RT)
- Sauvegarde automatique des résultats en sessionStorage
- Interface moderne avec animations, feedback en temps réel et contraste optimisé

### 🔐 Sécurité Cognitive (NOUVEAU)
- **Authentification biométrique cognitive** : Remplacez les mots de passe
- **CAPTCHA résistant à l'IA** : Détection de bots basée sur les patterns cognitifs
- **Vérification de profil** : Comparaison cryptographique de signatures
- **Détection de fraude** : Surveillance en temps réel des anomalies comportementales
- **Démos interactives** : `/security/auth-demo`, `/security/captcha-demo`, `/security/verify`, `/security/fraud-demo`
- API et SDKs pour intégration facile

### 🌐 Support Multilingue
- Interface **entièrement bilingue** (EN/FR)
- Changement de langue persistant via localStorage
- Traductions complètes pour tous les tests et interfaces

---

## Stack

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19, Tailwind CSS v4, shadcn/ui
- **Composants UI** : Radix UI (Accordion, Tabs)
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Formulaires** : React Hook Form + Zod
- **Charts** : Recharts (radar pour la cognition)
- **TypeScript** : v5 avec configuration stricte
- **Localisation** : LanguageProvider custom (EN/FR)
- **Déploiement** : Vercel (auto-deploy depuis GitHub)

---

## Pages principales

### 🏠 Pages principales
- `/` – **Homepage** : Présentation HCS-U7, section sécurité, cas d'usage, open-source
- `/generate` – **Générateur** : Questionnaire interactif (24 questions) avec progression
- `/generate/result` – **Résultat** : Code HCS-U7, interprétation, radar chart, prompts IA

### 🧪 Tests Cognitifs
- `/cognitive-tests` – **Hub principal** : Suite complète de 5 tests neurocognitifs
- `/cognitive-tests/stroop` – Test de Stroop (contrôle inhibiteur)
- `/cognitive-tests/nback` – Test N-Back (mémoire de travail)
- `/cognitive-tests/trail-making` – Trail Making Test (flexibilité cognitive)
- `/cognitive-tests/digit-span` – Digit Span Test (mémoire court terme)
- `/cognitive-tests/reaction-time` – Reaction Time Test (vitesse de traitement)

### 🔒 Sécurité
- `/security` – **Page sécurité** : Solutions d'authentification cognitive
- `/security/auth-demo` – Démo d'authentification biométrique cognitive
- `/security/captcha-demo` – Démo CAPTCHA cognitif résistant à l'IA
- `/security/verify` – Outil de vérification de profils HCS-U7
- `/security/fraud-demo` – Démo de détection de fraude en temps réel

### 📚 Documentation & Ressources
- `/docs` – Documentation technique complète
- `/examples` – 6 profils types avec dialogues avant/après
- `/integrations` – OpenAI, Claude, LangChain, SDKs
- `/research` – Protocole empirique, études, publications
- `/pricing` – Gratuit & open-source + Enterprise

### 🔌 API
- `/api/generate-prompt` – Endpoint REST pour générer les prompts ChatGPT / Claude à partir d’un profil HCS-U7

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

## 🏗️ Structure du projet

```
hcs-u7-website/
├── app/                       # App Router Next.js 16
│   ├── cognitive-tests/       # Tests neurocognitifs
│   │   ├── stroop/           
│   │   ├── nback/            
│   │   ├── trail-making/     
│   │   ├── digit-span/       
│   │   └── reaction-time/    
│   ├── security/              # Page sécurité cognitive
│   ├── generate/              # Générateur HCS-U7
│   ├── docs/                  # Documentation
│   └── ...                    
├── components/                
│   ├── security/              # 9 composants sécurité
│   │   ├── SecurityHero.tsx
│   │   ├── ProblemSolution.tsx
│   │   ├── UseCasesGrid.tsx
│   │   ├── TechnicalSection.tsx
│   │   └── ...
│   ├── tests/                 # Tests cognitifs
│   │   ├── StroopTest.tsx
│   │   └── NBackTest.tsx
│   ├── ui/                    # shadcn/ui + Radix UI
│   └── LanguageProvider.tsx   # Gestion EN/FR
├── lib/                       # Utilitaires
└── public/                    # Assets statiques
```

---

## 🎯 Fonctionnalités récentes

### ✨ Sécurité Cognitive (Nov 2024)
- Page complète `/security` avec 8 composants spécialisés
- Solutions d'authentification biométrique cognitive
- Détection de bots résistante à l'IA (GPT-4V proof)
- Vérification cryptographique de profils
- Documentation technique avec exemples de code
- FAQ complète avec 10 questions détaillées

### 🧪 Tests Cognitifs Complets (Nov 2024)
- Suite de 5 tests neurocognitifs validés scientifiquement
- Interface unifiée avec suivi de progression
- Sauvegarde automatique des résultats
- Support bilingue complet (EN/FR)
- Animations Framer Motion fluides
- Score normalisé 0-100 pour chaque capacité

### 🌍 Support Multilingue (Nov 2024)
- Interface entièrement bilingue (EN/FR)
- LanguageProvider avec persistence localStorage
- Tous les tests et composants traduits
- Navigation avec sélecteur de langue

---

## 🐛 Troubleshooting

### Erreurs TypeScript avec Tailwind CSS v4
Si vous rencontrez des erreurs de type avec Tailwind CSS v4, assurez-vous que :
- Le fichier `tailwind.config.ts` n'importe pas le type `Config`
- La configuration TypeScript utilise `"moduleResolution": "bundler"`

### Test N-Back bloqué
Le test N-Back attend maintenant une réponse de l'utilisateur (bug fix Nov 2024) :
- Les premiers N essais sont automatiques (mémorisation)
- Après, le test attend votre clic sur MATCH/NO MATCH
- Si bloqué, rechargez la page

### Module resolution errors
En cas d'erreur de résolution de modules :
1. Redémarrez le serveur TypeScript dans VS Code (`Ctrl+Shift+P` → "TypeScript: Restart TS Server")
2. Supprimez le dossier `.next` et reconstruisez : `rm -rf .next && npm run dev`

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le repository
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Conventions de code
- **Commits** : Utilisez les conventions [Conventional Commits](https://www.conventionalcommits.org/)
- **TypeScript** : Mode strict activé
- **Composants** : Utilisez les composants shadcn/ui quand possible
- **Styles** : Tailwind CSS uniquement (pas de CSS custom)
- **i18n** : Ajoutez toujours les traductions EN/FR

---

## 📜 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🔗 Liens utiles

- **Site en production** : [hcs-u7.vercel.app](https://hcs-u7.vercel.app)
- **GitHub** : [github.com/zefparis/HCS-U7-website](https://github.com/zefparis/HCS-U7-website)
- **API** : endpoint REST `/api/generate-prompt` (documentation détaillée à venir)
- **Support** : Ouvrez une [issue sur GitHub](https://github.com/zefparis/HCS-U7-website/issues)

---

## 📊 Statistiques (approx.)

- **Pages** : une vingtaine de routes (statiques + dynamiques)
- **Tests cognitifs** : 5 tests neurocognitifs principaux
- **Composants** : 50+ composants React réutilisables
- **Langues** : 2 (EN/FR) avec support complet

---

<div align="center">
  <strong>Construit avec ❤️ pour l'avancement de la recherche en cognition humaine et IA</strong>
</div>
