# Backend-OMDB-API

## Description

Ce projet est une application Node.js utilisant le framework Express. L'application utilise l'API OMDB pour récupérer des informations sur des films et les stocke dans une feuille de calcul Google Sheets en utilisant l'API Google Sheets.

## Comment est-il construit ?

Le projet utilise Node.js, Express, axios pour les appels API, Google APIs Node.js Client pour accéder à l'API Google Sheets, et dotenv pour charger les variables d'environnement à partir d'un fichier .env.

L'application utilise également des middlewares pour parser le corps de la requête, gérer l'authentification basique à l'aide d'un mot de passe et pour gérer les erreurs.

## Usage

* Clone this repository, from your local machine:
  ```bash
  git clone https://github.com/AILALINassim/Backend-OMDB-API.git
  ```
* Start the application
  ```bash
  cd app
  # Install dependencies with npm
  npm install
  # Start server at 'http://localhost:3000'
  npm start
  ```
## Routes

* GET /get-fast-and-furious-movies : Cette route récupère la liste des films de la série "Fast and Furious" depuis l'API OMDB et retourne une liste de données pour chaque film, y compris le titre, l'année de sortie, l'affiche, le réalisateur, un indicateur s'il a été produit avant 2015, un indicateur s'il a la participation de l'acteur Paul Walker et une liste des acteurs en commun avec la série de films "Star Wars".

* GET /pirates-of-the-caribbean : Cette route récupère la liste des films de la série "Pirates des Caraïbes" depuis l'API OMDB et stocke les données dans une feuille de calcul Google Sheet.

## Hébergement

Il conviendrait d'utiliser Docker pour faciliter le déploiement et les mises à jour mais le projet peut être déployé sur n'importe quelle plateforme d'hébergement de serveurs Node.js telle que Vercel.

## Montée en charge du système

Elle peut être gérée par la mise en cache des résultats de l'API pour éviter des appels redondants ou la mise en place d'un système de mise en file d'attente pour gérer les demandes simultanées.

## Forces & Faiblesses
### Forces
* L'application est simple et facile à comprendre
* Les middlewares assurent une bonne sécurité de l'application
* Le projet utilise des technologies modernes et éprouvées
### Faiblesses
* La récupération des données à partir de l'API peut être lente si l'API OMDB est surchargée
* L'application ne gère pas les erreurs externes

## Mise en production

* Ajouter des tests pour garantir la qualité et la fonctionnalité du code
* Implémenter une gestion plus complète des erreurs
* Mettre en place un mécanisme de surveillance pour surveiller les performances et la disponibilité de l'application en production

## 📚​ Documentation

OMDb API : https://www.omdbapi.com

Google API : https://developers.google.com/sheets/api
