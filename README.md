# Projet Paris Sportif
## 1. Membre du groupe
- Alexandre CERF
- Baptiste COLLINOT
- Romain GILOT
- Seynabou BA KANE

## 2. Installation du projet
1. Cloner le dépôt GitHub :
   ```bash
   git clone git@github.com:CollectEverything-MNS/ParisSportif.git
    ```
2. Installer yarn si ce n'est pas déjà fait :
   ```bash
   npm install -g yarn
   ```
3. **Optionnel :** Installer les dépendances du projet :
   ```bash
   yarn install:project
   ``` 
4. Démarrer le projet : *Cette commande installe aussi toutes les dépendances du projets*
    ```bash
    yarn start
    ```

## 3. Accéder à l'application via SWAGGER
1. Ouvrir votre navigateur web et accéder à l'URL suivante : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
2. Vous verrez l'interface Swagger où vous pourrez explorer et tester les différentes API disponibles dans l'application.

## 4. Tests du projets
1. A la racine du mono repo, il y a le fichier bruno 
2. Concernant le forget password request, je n'ai pas mis le mot de passe dans le .env pour éviter de le partager sur le github. Pour vérifier que ça fonctionne tu peux voir dans Rabbit MQ dans le queue

## Connexion RabbitMQ
- username: guest
- password: guest
- url interface: http://localhost:15672/