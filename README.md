# 🌐 TwittoSphere

TwittoSphere est un projet réalisé dans le cadre du **BTS SIO 1ère année** en cursus initial.  
Ce dépôt correspond à la **correction** du projet, avec les instructions pour le faire fonctionner localement.


---

## 🚀 Démarrage rapide

Voici les étapes pour exécuter le projet en local :

### 1. Cloner le dépôt

```bash
git clone https://github.com/Celthim/TwittoSphere.git
```

Ouvrir le dossier dans VSCode avec `Open Folder`

### 2. Configurer l'environnement

Dupliquer le fichier `env_template.ts` en `env.ts` :


Ouvre `env.ts` et remplace l’URL par celle de **l'API privée**.

### 3. Lancer le serveur de développement

```bash
npm run dev
```

### 4. Go Live ✨

Ouvre le projet avec **Live Server** (par exemple sur VS Code : clic droit sur `index.html` > **Open with Live Server**).

---

## 📁 Structure du projet

- `index.html` : Page d'accueil / Connexion
- `home.html` : Interface principale après connexion
- `styles/` : Fichiers CSS
- `dist/` : Fichiers JavaScript compilés
- `env_template.ts` : Exemple de configuration d’environnement

---

## 💡 Fonctionnalités

- Authentification rapide par pseudo
- Envoi de messages en temps réel
- Mode sombre / clair
- Design responsive
- Interaction avec une API privée

---

## 🛠️ Prérequis

- Node.js ≥ 16
- npm
- Live Server pour le rendu HTML local

---

## 🔒 À propos de l’API

L'application communique avec une API privée. Veille à bien configurer l’URL dans le fichier `env.ts` pour que les fonctionnalités fonctionnent correctement.

---

**Enjoy the Sphère 🌐**
