# Boost Agriculture — déploiement

Copie rebrandée de l'app AgriWinners. Code, données de dosage et logique identiques — seuls le nom, les couleurs, les icônes et les clés de stockage local changent.

## Ce qui a changé vs AgriWinners

- Nom / titre / manifest : "Boost Agriculture"
- Couleurs : navy `#0e2e42` + orange `#f58220` (au lieu du vert AgriWinners)
- Icônes : nouvelles (icons/icon-192.png, icon-512.png, logo-header.png) — design générique "croissance", à remplacer par un vrai logo dès que tu en as un
- Clés localStorage : `boostagri_data_v1`, `boostagri_licence_v1`, `boostagri_device_id` (différentes d'AgriWinners, donc pas de collision si jamais servi sur le même domaine)
- Service worker : `boostagri-v1` (repart à v1)

## Ce qui n'a PAS changé (volontairement)

- Le protocole 4Tree / 4Soil / Booster et tout `dosages.json` (mêmes cultures, mêmes doses)
- Le numéro WhatsApp de contact (`2250797052449`) — **à remplacer** dans `index.html` (3 endroits) et `dosages.json` (`whatsapp_url`) si Boost Agriculture doit utiliser un autre contact
- `netlify/functions/activate-licence.js` — générique, fonctionne avec n'importe quel store Chariow tant que la variable d'env `CHARIOW_API_KEY` pointe vers le bon store

## À faire côté toi avant mise en ligne

1. **Créer le store Chariow "Boost Agriculture"** (tu as choisi un store séparé d'Agri Winners) et un produit de type "license" dedans (même structure que "App AgriWinners" : prix, `post_purchase_instructions` avec le lien de l'app).
2. **Créer un nouveau site Netlify** à partir de ce même repo GitHub, avec comme "Base directory" `boost-agriculture/` (Netlify supporte plusieurs sites sur un seul repo via ce réglage).
3. Dans ce site Netlify : Site configuration → Environment variables → `CHARIOW_API_KEY` = la clé API du store Boost Agriculture (Chariow → Paramètres → API).
4. Une fois déployé, récupérer l'URL Netlify et la mettre dans `post_purchase_instructions` du produit Chariow (comme `https://agriwinners-outil.netlify.app/` pour AgriWinners).
5. Remplacer les icônes par un vrai logo si tu en as un (mêmes tailles : 192×192, 512×512, 240×240).
6. Remplacer le numéro WhatsApp si ce n'est pas le même contact.

## Pour l'ajouter au repo

Ce dossier `boost-agriculture/` est autonome — copie-le tel quel à la racine de `agriwinners-app` sur GitHub (ou dans une branche dédiée), commit, push. Netlify se charge du reste une fois le site créé avec le bon "Base directory".
