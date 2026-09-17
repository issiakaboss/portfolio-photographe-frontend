# Contexte de travail pour Gemini - Frontend

## 1. Objectif du depot

Ce depot contient le site public bilingue du portfolio d'un photographe/video maker, construit avec Astro. Il consomme l'API Laravel du depot `portfolio-photographe-backend`.

Le site actuel presente :

- une page d'accueil avec hero, selection d'oeuvres, processus et temoignages ;
- une galerie complete avec filtres photo/video/projet ;
- une page detail pour chaque oeuvre ;
- une page About alimentee par le CMS ;
- une page Contact alimentee par le CMS ;
- les locales `fr` et `en`.

Le nom visuel utilise actuellement est `Studio Visuals`.

## 2. Stack et commandes

- Astro `^7.2.10`
- TypeScript
- Tailwind CSS `^4.3.3` via le plugin Vite
- Node.js `>=22.12.0`
- Integration Astro i18n native
- API Laravel locale en developpement sur `http://127.0.0.1:8000`

Commandes depuis la racine :

```bash
npm install
npm run dev
npm run build
npm run preview
npm run astro -- --help
```

Pour les outils du workspace, le serveur de developpement peut etre lance avec :

```bash
astro dev --background
```

## 3. Structure utile

```text
src/
  assets/                  Images locales du front
  components/              PortfolioGrid, TestimonialSection, SocialIcon...
  i18n/translations.ts     Textes UI FR/EN
  layouts/Layout.astro    Layout global, header, footer, contenu contact
  pages/index.astro       Redirection vers /fr
  pages/[lang]/            Pages localisees
  services/api.ts          Client API et types Testimonial/SiteContent
  styles/global.css        Styles globaux
  types/artwork.ts         Contrat TypeScript Artwork
public/                    Fichiers servis tels quels
astro.config.mjs           i18n, proxy API/storage, port 4321
```

`Welcome.astro` et certains assets Astro presents dans `src/` sont des restes du starter et ne sont pas le chemin principal du site actuel.

## 4. Routage et rendu

- `/` redirige vers `/fr`.
- Les locales sont `fr` et `en`.
- La locale par defaut est `fr` et le prefixe de locale est toujours present.
- Les pages localisees utilisent `getStaticPaths()`.
- Les donnees API sont donc recuperees pendant le build pour les pages statiques.
- Les chemins principaux sont :
  - `/{lang}`
  - `/{lang}/gallery`
  - `/{lang}/about`
  - `/{lang}/contact`
  - `/{lang}/artwork/{id}`
- Le proxy Vite redirige `/api` et `/storage` vers `http://127.0.0.1:8000` en developpement.

Toute nouvelle structure de donnees doit tenir compte du fait qu'une page peut etre rendue cote serveur/build et pas uniquement dans le navigateur.

## 5. Contrat API actuel consomme

Le client se trouve dans `src/services/api.ts`.

### `GET /api/artworks?limit=6`

Reponse attendue :

```json
{
  "data": [
    {
      "id": 1,
      "title": "Titre",
      "description": "Description ou null",
      "image_url": "/storage/artworks/fichier.jpg",
      "thumbnail_url": null,
      "category": "general",
      "is_private": false,
      "created_at": "2026-09-06T12:00:00+00:00"
    }
  ]
}
```

Le backend exclut les oeuvres privees. `limit` est plafonne a 24 cote backend.

### `GET /api/artworks/{id}`

Reponse : `{ "data": Artwork }` avec le meme objet que ci-dessus.

### `GET /api/testimonials`

Reponse :

```json
{
  "data": [
    {
      "id": 1,
      "author": "Nom",
      "role": "Role ou null",
      "quote": "Texte",
      "avatar": "https://... ou null",
      "created_at": "2026-09-06T12:00:00+00:00"
    }
  ]
}
```

### `POST /api/testimonials`

Payload :

```json
{
  "author": "Nom",
  "role": "Role ou null",
  "quote": "500 caracteres maximum"
}
```

Le backend valide et publie actuellement le temoignage directement avec un avatar aleatoire preenregistre.

### `GET /api/content/{section}?locale=fr`

Sections actuelles : `about` et `contact`.

About contient actuellement : `eyebrow`, `title`, `bio`, `image_url`, `experience_years`, `projects_completed`, `experience_label`, `projects_label`.

Contact contient actuellement : `title`, `description`, `panel_title`, `panel_description`, `email`, `phone`, `socials[]` avec `label` et `url`.

La reponse est `{ "data": object ou null }`.

## 6. Regles pour changer le format

Avant de modifier le front, definir explicitement :

1. le nouveau schema JSON exact ;
2. les champs obligatoires et optionnels ;
3. la compatibilite ou non avec les anciennes reponses ;
4. la strategie de migration des URLs media ;
5. le comportement des locales absentes ;
6. le comportement des erreurs, chargements et donnees vides.

Lors d'un changement de contrat :

- modifier `src/types/artwork.ts` et les types dans `src/services/api.ts` ;
- adapter `PortfolioGrid.astro`, les pages detail et les pages CMS concernees ;
- conserver l'encodage de l'identifiant dans les URLs ;
- verifier les URLs `/storage` et les URLs absolues ;
- mettre a jour les textes FR et EN dans `src/i18n/translations.ts` ;
- lancer `npm run build`.

## 7. Points d'attention connus

- `PortfolioGrid.astro` deduit le type photo/video depuis l'extension du fichier et la categorie. Un nouveau format de media doit probablement remplacer cette deduction par un champ API explicite.
- Le formulaire Contact ne fait pas de POST API : il ouvre un lien `mailto:`.
- Le formulaire de temoignage utilise un fetch navigateur direct. Sa valeur par defaut est `http://127.0.0.1:8000/api` si `PUBLIC_API_URL` n'est pas defini ; verifier ce choix avec le proxy `/api` lors d'une refonte/deploiement.
- `Layout.astro` charge aussi le contenu `contact` pour afficher les reseaux sociaux dans le footer.
- Les appels API echoues retournent des tableaux vides ou `null`, donc les composants doivent conserver un rendu degrade propre.
- Ne pas mettre de secret dans le front ou dans `PUBLIC_*`.

## 8. Consignes pour l'agent qui reprend le projet

- Lire ce fichier et le backend `GEMINI_CONTEXT.md` avant toute modification de format.
- Ne pas inventer un contrat API : verifier le controller/resource Laravel correspondant.
- Conserver Astro et les conventions existantes sauf demande explicite de migration.
- Preferer des types stricts et des transformations centralisees dans `src/services/api.ts`.
- Tester au minimum le build Astro apres chaque changement de contrat.
- Si le nouveau format n'est pas encore specifie, poser les questions de schema avant d'implementer une conversion irreversible.
