# HCS-U7 Website – Deployment Guide

Ce document décrit comment déployer le site HCS-U7 sur Vercel, les prérequis et la checklist de pré-lancement.

---

## 1. Prérequis

- Compte Vercel (gratuit ou payant).
- Accès au dépôt Git contenant ce projet (`hcs-u7-website`).
- Node.js LTS installé en local si vous voulez builder avant déploiement.

Le projet utilise :

- Next.js 14 (App Router)
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- Recharts
- React Hook Form + Zod

---

## 2. Déploiement sur Vercel (via Git)

1. Poussez ce dossier sur un dépôt GitHub / GitLab / Bitbucket.
2. Sur Vercel, cliquez sur **New Project**.
3. Importez le dépôt contenant `hcs-u7-website`.
4. Vérifiez la configuration automatique :
   - Framework détecté : `Next.js`.
   - Build Command : `npm run build`.
   - Install Command : `npm install`.
   - Output : `.next` (valeur par défaut pour Next).
5. Ajoutez la variable d&apos;environnement suivante (onglet *Environment Variables*) :

   - `NEXT_PUBLIC_SITE_URL` = `https://hcs-u7.vercel.app` (ou l&apos;URL assignée par Vercel si différente).

6. Lancez le déploiement. Vercel va :
   - Installer les dépendances.
   - Exécuter `npm run build`.
   - Déployer le site.

La configuration `vercel.json` à la racine reflète déjà ces choix.

---

## 3. Déploiement via CLI (optionnel)

Si vous utilisez la CLI Vercel :

```bash
npm install -g vercel
vercel login
vercel # premier déploiement interactif
vercel --prod # déploiement en production
```

La CLI lira automatiquement `vercel.json` et la configuration du projet Next.js.

---

## 4. Checklist pré-lancement

Avant d&apos;ouvrir le site au public :

- [ ] **Build** local réussi :
  - `npm install`
  - `npm run lint`
  - `npm run build`
- [ ] **SEO** :
  - Balises `metadata` dans `app/layout.tsx` correctes (titre, description, Open Graph, Twitter).
  - Images `og-image.png` et favicon en place dans `public/`.
- [ ] **Navigation** :
  - Liens principaux : `/`, `/generate`, `/generate/result`, `/docs`, `/examples`, `/integrations`, `/research`, `/pricing` fonctionnels.
  - Navigation mobile (menu hamburger) utilisable au clavier.
- [ ] **Questionnaire** :
  - Les 24 questions se chargent.
  - La progression est correcte.
  - Le profil HCS-U7 est généré sans erreur et la page `/generate/result` s&apos;affiche.
- [ ] **Accessibilité** :
  - Lien "Skip to main content" visible au focus.
  - Focus visible sur les boutons et liens.
  - Navigation possible uniquement au clavier.
- [ ] **Performances** (optionnel) :
  - Vérification rapide avec Lighthouse (performance, accessibilité, SEO).

---

## 5. Variables d&apos;environnement

Variables utilisées :

- `NEXT_PUBLIC_SITE_URL` : URL publique du site (ex. `https://hcs-u7.vercel.app`). Utilisable dans les composants pour générer des liens absolus si nécessaire.

Aucune clé d&apos;API secrète n&apos;est stockée dans ce projet par défaut. Pour intégrer OpenAI, Anthropic ou d&apos;autres fournisseurs, ajoutez vos clés d&apos;API dans Vercel et utilisez-les côté serveur uniquement.

---

## 6. URL de preview

Une fois déployé, Vercel fournit :

- Une URL de **preview** pour chaque pull request (par exemple : `https://hcs-u7-website-git-feature.vercel.app`).
- Une URL de **production** principale, recommandée :

```text
https://hcs-u7.vercel.app
```

Vous pouvez changer ce domaine dans les paramètres du projet Vercel (Custom Domains).
