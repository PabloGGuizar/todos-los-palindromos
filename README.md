# Todos los Palíndromos / Tots els Palíndroms

*Idiomas / Idiomes:* **[Castellano / Español](#castellano--español)** | **[Català](#català)**

---

## Castellano / Español

Este es un proyecto interactivo y de análisis lingüístico diseñado para recopilar, validar, explorar y jugar con palabras y frases simétricas (palíndromos) en los idiomas **español** y **catalán**.

El proyecto une dos colecciones de corpus enriquecidos de manera programática, ofreciendo una landing page informativa con un explorador interactivo y un juego dinámico de tipo slide puzzle.

---

### 🌟 Características Principales

* **Doble Corpus Lingüístico**: Recopila palíndromos en español y catalán validados de forma automatizada.
* **Enriquecimiento de Datos**: Cada palabra cuenta con validación y enlace directo a diccionarios oficiales como el **DLE (Diccionario de la Lengua Española)** de la RAE, el **DIEC** de la IEC y **Wiktionary**.
* **Explorador Interactivo**: Permite buscar y filtrar palíndromos por idioma (Español / Català) y longitud de palabras directamente en la web principal.
* **Constructor de Palíndromos**: Un divertido juego web de tipo *slide puzzle* donde el jugador debe deslizar y reordenar las letras mezcladas para revelar el palíndromo oculto.
* **Diseño Premium**:
  * Interfaz responsiva y elegante usando **Glassmorphism**.
  * Animaciones numéricas para las estadísticas del corpus cargadas en tiempo real.
  * Selector de idiomas dinámico (Español / Català) y selector de tema (Claro / Oscuro) sincronizados en todo el sitio a través de `localStorage`.
  * Efectos de sonido dinámicos en el juego generados mediante la **Web Audio API**.

---

### 📂 Estructura del Proyecto

* **`/` (Raíz)**:
  * `index.html`: Landing page informativa y exploradora del corpus en tiempo real.
  * `palindromos_es_enriquecidos.json`: Corpus estructurado y verificado en español.
  * `palindromos_cat_enriquecidos.json`: Corpus estructurado y verificado en catalán.
  * Scripts de procesamiento de datos: `enriquecer.js`, `validar_enlaces.js`.
* **`/constructor-de-palindromos`**:
  * `index.html`: Estructura HTML de la interfaz del Constructor de Palíndromos.
  * `style.css`: Estilos visuales del juego (soporte de animaciones, temas claros y oscuros).
  * `game.js`: Lógica interactiva del juego (movimiento de fichas, sonido Web Audio API, progresión inteligente de niveles).

---

### 🚀 Cómo ejecutar localmente

Debido a que el navegador restringe la lectura de archivos JSON locales (`fetch` a archivos `.json` locales) por políticas de seguridad (CORS), **se requiere iniciar un servidor web local** en el directorio raíz del proyecto.

#### Usando Python (Recomendado)

1. Abre tu terminal o consola de comandos.
2. Navega hasta la carpeta raíz del proyecto (`todos-los-palindromos`):
   ```bash
   cd todos-los-palindromos
   ```
3. Ejecuta el servidor integrado de Python:
   ```bash
   python -m http.server 8000
   ```
4. Abre tu navegador de preferencia y accede a:
   * **Sitio Principal y Explorador**: [http://localhost:8000](http://localhost:8000)
   * **Constructor de Palíndromos (Juego)**: [http://localhost:8000/constructor-de-palindromos/](http://localhost:8000/constructor-de-palindromos/)

---

### ⚙️ Tecnologías Utilizadas

* **HTML5**: Estructura semántica del sitio web.
* **Vanilla CSS**: Estilos premium responsivos, gradientes dinámicos, glassmorphism y variables CSS para el cambio de temas.
* **Vanilla JavaScript (ES6+)**: Lógica de interacción, búsqueda en tiempo real, traducción instantánea sin dependencias, efectos sonoros y algoritmos del juego.
* **Web Audio API**: Motor de sonido procedural en el navegador.

---

### 📄 Autor y Licencia

* **Desarrollador**: [Pablo G. Guízar](https://www.linkedin.com/in/pablogguizar/)
* **Licencia**: Código abierto bajo la licencia MIT.

---
---

## Català

Aquest és un projecte interactiu i d'anàlisi lingüística dissenyat per recopilar, validar, explorar i jugar amb paraules i frases simètriques (palíndroms) en els idiomes **espanyol** i **català**.

El projecte uneix dues col·leccions de corpus enriquits de manera programàtica, oferint una landing page informativa amb un explorador interactiu i un joc dinàmic de tipus slide puzzle.

---

### 🌟 Característiques Principals

* **Doble Corpus Lingüístic**: Recopila palíndroms en espanyol i català validats de forma automatitzada.
* **Enriquiment de Dades**: Cada paraula compta amb validació i enllaç directe a diccionaris oficials com el **DLE (Diccionario de la Lengua Española)** de la RAE, el **DIEC** de l'IEC i **Wiktionary**.
* **Explorador Interactiu**: Permet cercar i filtrar palíndroms per idioma (Espanyol / Català) i longitud de paraules directament a la web principal.
* **Constructor de Palíndroms**: Un divertit joc web de tipus *slide puzzle* on el jugador ha de lliscar i reordenar les lletres barrejades per revelar el palíndrom ocult.
* **Disseny Premium**:
  * Interfície responsiva i elegant utilitzant **Glassmorphism**.
  * Animacions numèriques per a les estadístiques del corpus carregades en temps real.
  * Selector d'idiomes dinàmic (Espanyol / Català) i selector de tema (Clar / Fosc) sincronitzats en tot el lloc web a través de `localStorage`.
  * Efectes de so dinàmics en el joc generats mitjançant la **Web Audio API**.

---

### 📂 Estructura del Projecte

* **`/` (Arrel)**:
  * `index.html`: Landing page informativa i exploradora del corpus en temps real.
  * `palindromos_es_enriquecidos.json`: Corpus estructurat i verificat en espanyol.
  * `palindromos_cat_enriquecidos.json`: Corpus estructurat i verificat en català.
  * Scripts de processament de dades: `enriquecer.js`, `validar_enlaces.js`.
* **`/constructor-de-palindromos`**:
  * `index.html`: Estructura HTML de la interfície del Constructor de Palíndroms.
  * `style.css`: Estils visuals del joc (suport d'animacions, temes clars i foscos).
  * `game.js`: Lògica interactiva del joc (moviment de fitxes, so Web Audio API, progressió intel·ligent de nivells).

---

---

### 🚀 Com executar localment

A causa de que el navegador restringeix la lectura d'arxius JSON locals (`fetch` a arxius `.json` locals) per polítiques de seguretat (CORS), **es requereix iniciar un servidor web local** al directori arrel del projecte.

#### Utilitzant Python (Recomanat)

1. Obre la terminal o consola de comandes.
2. Navega fins a la carpeta arrel del projecte (`todos-los-palindromos`):
   ```bash
   cd todos-los-palindromos
   ```
3. Executa el servidor integrat de Python:
   ```bash
   python -m http.server 8000
   ```
4. Obre el teu navegador de preferència i accedeix a:
   * **Lloc Principal i Explorador**: [http://localhost:8000](http://localhost:8000)
   * **Constructor de Palíndroms (Joc)**: [http://localhost:8000/constructor-de-palindromos/](http://localhost:8000/constructor-de-palindromos/)

---

### ⚙️ Tecnologies Utilitzades

* **HTML5**: Estructura semàntica del lloc web.
* **Vanilla CSS**: Estils premium responsius, gradients dinàmics, glassmorphism i variables CSS per al canvi de temes.
* **Vanilla JavaScript (ES6+)**: Lògica d'interacció, cerca en temps real, traducció instantània sense dependències, efectes sonors i algorismes del joc.
* **Web Audio API**: Motor de so procedimental al navegador.

---

### 📄 Autor i Llicència

* **Desenvolupador**: [Pablo G. Guízar](https://www.linkedin.com/in/pablogguizar/)
* **Llicència**: Codi obert sota la llicència MIT.
