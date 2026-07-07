# Maison of Wishes by ACH - Site E-commerce

Ce projet est un site e-commerce élégant pour la boutique **Maison of Wishes by ACH**, spécialisée dans les pièces décoratives artisanales en argile. 

Le site permet de présenter les produits, de gérer un panier persistant (via `localStorage`), et d'envoyer la commande directement au vendeur par message WhatsApp contenant toutes les coordonnées du client.

## Fonctionnalités

- **Design Premium Organique** : Une esthétique douce inspirée de la poterie et de l'argile, avec des polices raffinées (Outfit, Playfair Display), des ombres douces et une structure entièrement responsive.
- **Panier Interactif (Drawer)** : Un volet latéral pour ajuster les quantités, supprimer des articles, et voir le total instantanément.
- **Formulaire de Commande Intégré** : Formulaire demandant le nom, numéro de téléphone, gouvernorat (sélection facile parmi les 24 gouvernorats de Tunisie) et adresse complète.
- **Validation & affichage de la facture** : Génère un message structuré et lisible pour le vendeur .
- **Optimisé pour GitHub Pages** : Fichiers statiques (HTML/CSS/JS) prêts à être hébergés gratuitement.

## Guide de Déploiement sur GitHub Pages

### Étape 1 : Initialiser Git localement et lier votre dépôt GitHub

Ouvrez un terminal dans le dossier du projet (`clay-ecommerce`) et exécutez les commandes suivantes :

```bash
# Initialiser le dépôt local
git init

# Ajouter les fichiers
git add .

# Créer le premier commit
git commit -m "Initial commit - Maison of Wishes Clay E-Commerce"

# Définir la branche principale sur main
git branch -M main

# Ajouter l'adresse de votre dépôt distant GitHub
git remote add origin https://github.com/amanitek/maison-of-wishes.git

# Pousser le code vers GitHub
git push -u origin main
```

*(Note : Si Git vous demande des informations de connexion, la connexion est gérée par Git Credential Manager qui est déjà installé sur votre machine).*

### Étape 2 : Activer GitHub Pages sur votre dépôt

Une fois que les fichiers sont poussés sur GitHub :
1. Allez sur votre dépôt GitHub : [https://github.com/amanitek/maison-of-wishes](https://github.com/amanitek/maison-of-wishes)
2. Cliquez sur l'onglet **Settings** (Paramètres) en haut.
3. Dans le menu de gauche, sous la section **Code and automation**, cliquez sur **Pages**.
4. Sous **Build and deployment** :
   - Source : Sélectionnez **Deploy from a branch**.
   - Branch : Choisissez **main** et le dossier **/ (root)**.
   - Cliquez sur **Save**.
5. Attendez environ 1 à 2 minutes. GitHub va générer le lien de votre site (qui ressemblera à `https://amanitek.github.io/maison-of-wishes/`).
6. Le lien apparaîtra en haut de la page des paramètres GitHub Pages une fois le déploiement terminé !

<!-- Trigger deployment: retry due to GitHub Pages transient runner glitch -->
