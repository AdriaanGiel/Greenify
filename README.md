# Greenify
App to live cheap and green

## Installatie instructies
### Met Vagrant
Pas eerst de homestead.yaml bestand aan als dat nodig is.

Voeg dan de url aan je hosts bestand

voorbeeld:
```
192.168.10.10	greenify.test
```

Run daarna 

```
composer install
```

Run daarna

```
vagrant up
```

Als dat klaar is run "vagrant ssh" om in de virtuele machine te komen. Eenmaal in de machine
cd in de map greenify. 

Als je in de map greenify bent run:

```
composer install
```

Kopieer de inhoud van .env.example naar een nieuw bestand genaamd .env en plaats daar al de juiste data in. 

Daarna kan je de migraties pushen naar de database door "php artisan migrate --seed" te runnen

Als dat klaar is run:
 ```
 npm install
 ```
 
In windows wordt dat:  
```
yarn install --no-bin-links
```
Om je css en js te compilen run:
```
npm run dev 
```

of 
```
yarn dev 
```


### Zonder vagrant
Plaats project map in www map van wamp
Maak een database aan die je kan koppelen aan je project
note: Zorg dat je de laatste versie heb van PHP

cd in de greenify map en run: 
```
composer install
```
Kopieer de inhoud van .env.example naar een nieuw bestand genaamd .env en plaats daar al de juiste data in. 

Daarna kan je de migraties pushen naar de database pushen met:
 ```
 php artisan migrate --seed
 ``` 

Als dat klaar is run:
``` 
npm install
```

In windows wordt dat 
```
yarn install --no-bin-links
```

Om je css en js te compilen run:
```
npm run dev
```
 of 
 ```
 yarn dev
 ```
Voordat je een branch pushed!
Zorg dat je eerst een production build maakt. Dit voorkomt merge conflicts op de master.
```
npm run prod
```

