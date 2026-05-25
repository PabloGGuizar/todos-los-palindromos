document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    let palindromos = [];
    let currentPuzzle = null;
    let timer = null;
    let seconds = 0;
    let moves = 0;
    let gridState = []; // Mapea índice de cuadrícula a objeto tile (o null si está vacío)
    let emptySpaces = []; // Array de índices vacíos
    let cols = 0;
    let rows = 0;
    let audioCtx = null;

    // Efectos de Sonido (Web Audio API)
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSlideSound() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playVictorySound() {
        if (!audioCtx) return;
        // Acorde mayor (C5, E5, G5) + C6
        const freqs = [523.25, 659.25, 783.99, 1046.50]; 
        freqs.forEach((freq, index) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const startTime = audioCtx.currentTime + index * 0.1;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + 1.5);
        });
    }

    // Elementos del DOM
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen')
    };
    const modal = document.getElementById('victory-modal');
    const container = document.getElementById('puzzle-container');
    const diffSelect = document.getElementById('difficulty-select');
    const timeDisplay = document.getElementById('time-display');
    const movesDisplay = document.getElementById('moves-display');
    const levelDisplay = document.getElementById('level-display');
    const langSelect = document.getElementById('language-select');

    // Diccionario de traducciones
    const i18n = {
        es: {
            title: "Constructor de palíndromos",
            subtitle: "Ordena las letras para revelar la palabra oculta.",
            lblLang: "Idioma:",
            lblDifficulty: "Dificultad (Longitud de la palabra):",
            diffAuto: "Progresivo (Empezar por 3 letras)",
            diffRandom: "Aleatorio (¡Sorpréndeme!)",
            startBtn: "Comenzar a Jugar",
            backBtn: "Salir",
            solveBtn: "Solución",
            level: "Nivel: ",
            completed: "¡Completado!",
            time: "Tiempo: ",
            moves: "Movimientos: ",
            lemma: "Lema: ",
            nextBtn: "Siguiente Nivel",
            againBtn: "Jugar Otra Vez",
            dict: "Diccionario",
            alertNoWords: "No hay palíndromos disponibles para esta dificultad.",
            alertMaxLen: "¡Felicidades! Has concluido el juego. Ya no hay más niveles disponibles.",
            alertError: "Hubo un error cargando los datos del juego.",
            gameOverTitle: "¡Felicidades!",
            gameOverMessage: "Has concluido el juego. Ya no hay más niveles disponibles.",
            gameOverBtn: "Volver al Inicio",
            footerHTML: "Constructor de palíndromos — Desarrollado por <a href='https://www.linkedin.com/in/pablogguizar/' target='_blank'>Pablo G. Guízar</a>. Código abierto bajo licencia MIT disponible en <a href='https://github.com/PabloGGuizar/todos-los-palindromos' target='_blank'>GitHub</a>.",
            infoTitle: "Instrucciones",
            infoP1: "El objetivo del juego es ordenar las letras para formar un palíndromo oculto.",
            infoP2: "Las fichas punteadas son vacías y pueden moverse libremente. El objetivo es colocar las letras en orden (de izquierda a derecha, de arriba a abajo) y dejar las fichas vacías al final.",
            infoP3: "¡Intenta hacerlo en la menor cantidad de movimientos y tiempo posible!",
            closeInfo: "Entendido"
        },
        cat: {
            title: "Constructor de palíndroms",
            subtitle: "Ordena les lletres per revelar la paraula oculta.",
            lblLang: "Idioma:",
            lblDifficulty: "Dificultat (Longitud de la paraula):",
            diffAuto: "Progressiu (Començar per 3 lletres)",
            diffRandom: "Aleatori (Sorprèn-me!)",
            startBtn: "Començar a Jugar",
            backBtn: "Sortir",
            solveBtn: "Solució",
            level: "Nivell: ",
            completed: "Completat!",
            time: "Temps: ",
            moves: "Moviments: ",
            lemma: "Lema: ",
            nextBtn: "Següent Nivell",
            againBtn: "Jugar Una Altra Vegada",
            dict: "Diccionari",
            alertNoWords: "No hi ha palíndroms disponibles per a aquesta dificultat.",
            alertMaxLen: "Felicitats! Has completat el joc. Ja no hi ha més nivells disponibles.",
            alertError: "S'ha produït un error en carregar les dades del joc.",
            gameOverTitle: "Felicitats!",
            gameOverMessage: "Has completat el joc. Ja no hi ha més nivells disponibles.",
            gameOverBtn: "Tornar a l'Inici",
            footerHTML: "Constructor de palíndroms — Desenvolupat per <a href='https://www.linkedin.com/in/pablogguizar/' target='_blank'>Pablo G. Guízar</a>. Codi obert sota llicència MIT disponible a <a href='https://github.com/PabloGGuizar/todos-los-palindromos' target='_blank'>GitHub</a>.",
            infoTitle: "Instruccions",
            infoP1: "L'objectiu del joc és ordenar les lletres per formar un palíndrom ocult.",
            infoP2: "Les fitxes puntejades són buides i es poden moure lliurement. L'objectiu és col·locar les lletres en ordre (d'esquerra a dreta, de dalt a baix) i deixar les fitxes buides al final.",
            infoP3: "Intenta fer-ho en la menor quantitat de moviments i temps possible!",
            closeInfo: "Entès"
        }
    };

    // Inicialización
    async function init() {
        // Inicializar tema
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-theme');
            document.getElementById('icon-sun').style.display = 'none';
            document.getElementById('icon-moon').style.display = 'block';
        }

        try {
            // Cargar los JSON
            const [resEs, resCat] = await Promise.all([
                fetch('../palindromos_es_enriquecidos.json').then(r => r.json()).catch(() => []),
                fetch('../palindromos_cat_enriquecidos.json').then(r => r.json()).catch(() => [])
            ]);
            
            // Combinar y filtrar válidos
            const esWords = resEs.map(p => ({...p, lang: 'es'}));
            const catWords = resCat.map(p => ({...p, lang: 'cat'}));
            const all = [...esWords, ...catWords].filter(p => p.enlace_diccionario_valido || p.enlace_wiktionary_valido);
            
            // Normalizar y enriquecer
            palindromos = all.map(p => {
                const word = p.palabra.toUpperCase()
                    .replace(/[ÁÀÂÄ]/g, 'A')
                    .replace(/[ÉÈÊË]/g, 'E')
                    .replace(/[ÍÌÎÏ]/g, 'I')
                    .replace(/[ÓÒÔÖ]/g, 'O')
                    .replace(/[ÚÙÛÜ]/g, 'U');
                return { ...p, word, length: word.length };
            }).filter(p => p.length >= 3); // Solo 3 letras o más
            
            // Habilitar botón de inicio y selector de idioma UI
            document.getElementById('start-btn').addEventListener('click', startGame);
            langSelect.addEventListener('change', updateUILanguage);
            updateUILanguage(); // Inicializar textos
        } catch (e) {
            console.error("Error cargando los palíndromos:", e);
            alert(i18n[langSelect.value].alertError);
        }
    }

    function updateUILanguage() {
        const lang = langSelect.value;
        const t = i18n[lang];
        
        document.querySelector('#start-screen h1').textContent = t.title;
        document.querySelector('#start-screen .subtitle').textContent = t.subtitle;
        document.getElementById('lbl-lang').textContent = t.lblLang;
        document.querySelector('label[for="difficulty-select"]').textContent = t.lblDifficulty;
        document.querySelector('#difficulty-select option[value="auto"]').textContent = t.diffAuto;
        document.querySelector('#difficulty-select option[value="random"]').textContent = t.diffRandom;
        document.getElementById('start-btn').textContent = t.startBtn;
        document.getElementById('back-text').textContent = t.backBtn;
        document.getElementById('solve-text').textContent = t.solveBtn;
        document.querySelector('.level-indicator').childNodes[0].nodeValue = t.level;
        document.querySelector('#victory-modal h2').textContent = t.completed;
        document.querySelector('.victory-stats p:nth-child(1)').childNodes[0].nodeValue = t.time;
        document.querySelector('.victory-stats p:nth-child(2)').childNodes[0].nodeValue = t.moves;
        document.getElementById('link-dle').textContent = t.dict;
        document.getElementById('next-level-btn').textContent = t.nextBtn;
        document.getElementById('play-again-btn').textContent = t.againBtn;
        
        // Info modal
        document.getElementById('info-title').textContent = t.infoTitle;
        document.getElementById('info-p1').textContent = t.infoP1;
        document.getElementById('info-p2').textContent = t.infoP2;
        document.getElementById('info-p3').textContent = t.infoP3;
        document.getElementById('close-info-btn').textContent = t.closeInfo;

        // Fin de juego modal
        document.getElementById('game-over-title').textContent = t.gameOverTitle;
        document.getElementById('game-over-message').textContent = t.gameOverMessage;
        document.getElementById('game-over-btn').textContent = t.gameOverBtn;
        
        // Traducir el footer en todas las pantallas del juego
        document.querySelectorAll('.game-footer-text').forEach(el => {
            el.innerHTML = `&copy; 2026 ${t.footerHTML}`;
        });
    }

    // Navegación de pantallas
    function showScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    // Iniciar juego
    function startGame() {
        initAudio(); // Inicializar audio al primer clic del usuario

        const diff = document.querySelector('#difficulty-select') ? document.querySelector('#difficulty-select').value : 'auto';
        let selectedWord = null;

        if (diff === 'auto') {
            // Progresivo: Empezar con la longitud mínima disponible en el pool (normalmente 3)
            const lang = document.getElementById('language-select').value;
            let pool = palindromos;
            if (lang !== 'both') {
                pool = palindromos.filter(p => p.lang === lang);
            }
            const minLen = pool.length > 0 ? Math.min(...pool.map(p => p.length)) : 3;
            levelDisplay.textContent = minLen;
            selectedWord = getRandomWord(minLen);
        } else if (diff === 'random') {
            const randomLen = Math.floor(Math.random() * 8) + 3; // 3 a 10
            levelDisplay.textContent = "?";
            selectedWord = getRandomWord(randomLen, true);
        } else {
            const len = parseInt(diff);
            levelDisplay.textContent = len;
            selectedWord = getRandomWord(len);
        }

        if (!selectedWord) {
            alert(i18n[langSelect.value].alertNoWords);
            return;
        }

        currentPuzzle = selectedWord;
        setupPuzzle(currentPuzzle.word);
        showScreen('game');
        startTimer();
        moves = 0;
        updateStats();
    }

    // Obtener palabra aleatoria
    function getRandomWord(len, fallback = false) {
        const lang = document.getElementById('language-select').value;
        let pool = palindromos;
        if (lang !== 'both') {
            pool = palindromos.filter(p => p.lang === lang);
        }

        let candidates = pool.filter(p => p.length === len);
        if (candidates.length === 0 && fallback) {
            candidates = pool;
        }
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // Configurar el puzzle
    function setupPuzzle(word) {
        const L = word.length;
        // Determinar tamaño de cuadrícula
        const spec = getGridSpec(L);
        cols = spec.w;
        rows = spec.h;
        const totalCells = cols * rows;

        container.innerHTML = '';
        container.setAttribute('data-size', Math.max(cols, rows));
        
        // Inicializar estado
        gridState = new Array(totalCells).fill(null);
        
        // Exactamente 1 espacio vacío real (el agujero)
        emptySpaces = [totalCells - 1]; 

        // Crear array de letras
        let letters = word.split('');
        
        // Colocar letras en posiciones iniciales
        for (let i = 0; i < L; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = letters[i];
            tile.dataset.id = i; 
            container.appendChild(tile);
            
            gridState[i] = {
                element: tile,
                id: i,
                letter: letters[i]
            };
        }

        // Fichas vacías (padding) que actúan como piezas móviles
        for (let i = L; i < totalCells - 1; i++) {
            const blankTile = document.createElement('div');
            blankTile.className = 'tile blank';
            container.appendChild(blankTile);
            
            gridState[i] = {
                element: blankTile,
                id: 'blank',
                letter: ''
            };
        }

        renderGrid();
        
        // Mezclar haciendo movimientos válidos
        shufflePuzzle(150);
        
        // Añadir event listeners
        document.querySelectorAll('.tile').forEach(tile => {
            tile.addEventListener('click', () => handleTileClick(tile));
        });
    }

    // Calcular tamaño de cuadrícula
    function getGridSpec(L) {
        const sizes = [
            {w: 2, h: 2}, // 4 espacios (L=3)
            {w: 3, h: 2}, // 6 espacios (L=4..5)
            {w: 3, h: 3}, // 9 espacios (L=6..8)
            {w: 4, h: 3}, // 12 espacios (L=9..11)
            {w: 4, h: 4}, // 16 espacios (L=12..15)
            {w: 5, h: 4}, // 20 espacios
            {w: 5, h: 5}, // 25 espacios
            {w: 6, h: 5}, // 30 espacios
            {w: 6, h: 6}, // 36 espacios
        ];
        return sizes.find(s => s.w * s.h >= L + 1) || {w: 7, h: 7};
    }

    // Renderizar posiciones
    function renderGrid() {
        for (let i = 0; i < gridState.length; i++) {
            const tileObj = gridState[i];
            if (tileObj) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                tileObj.element.style.width = `${100 / cols}%`;
                tileObj.element.style.height = `${100 / rows}%`;
                tileObj.element.style.left = `${col * (100 / cols)}%`;
                tileObj.element.style.top = `${row * (100 / rows)}%`;
            }
        }
    }

    // Mezclar puzzle
    function shufflePuzzle(moves) {
        for (let i = 0; i < moves; i++) {
            // Elegir un espacio vacío aleatorio
            const emptyIdx = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
            const neighbors = getNeighbors(emptyIdx);
            // Filtrar vecinos que tienen una baldosa
            const validNeighbors = neighbors.filter(n => gridState[n] !== null);
            if (validNeighbors.length > 0) {
                const swapIdx = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
                // Intercambiar en gridState
                gridState[emptyIdx] = gridState[swapIdx];
                gridState[swapIdx] = null;
                // Actualizar emptySpaces
                emptySpaces[emptySpaces.indexOf(emptyIdx)] = swapIdx;
            }
        }
        renderGrid();
    }

    function getNeighbors(idx) {
        const neighbors = [];
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        if (row > 0) neighbors.push(idx - cols); // arriba
        if (row < rows - 1) neighbors.push(idx + cols); // abajo
        if (col > 0) neighbors.push(idx - 1); // izquierda
        if (col < cols - 1) neighbors.push(idx + 1); // derecha
        return neighbors;
    }

    function handleTileClick(tileEl) {
        // Encontrar índice actual de la baldosa
        const currentIdx = gridState.findIndex(t => t && t.element === tileEl);
        if (currentIdx === -1) return;

        const neighbors = getNeighbors(currentIdx);
        // Buscar si algún vecino es el espacio vacío
        const emptyNeighbor = neighbors.find(n => emptySpaces.includes(n));

        if (emptyNeighbor !== undefined) {
            // Mover
            gridState[emptyNeighbor] = gridState[currentIdx];
            gridState[currentIdx] = null;
            
            // Actualizar espacios vacíos
            emptySpaces[emptySpaces.indexOf(emptyNeighbor)] = currentIdx;
            
            playSlideSound();
            moves++;
            updateStats();
            renderGrid();
            checkVictory();
        }
    }

    function checkVictory() {
        const L = currentPuzzle.length;
        let isCorrect = true;
        for (let i = 0; i < L; i++) {
            // Verificar que la letra actual coincida con la letra de la palabra original
            if (!gridState[i] || gridState[i].letter !== currentPuzzle.word[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            clearInterval(timer);
            setTimeout(showVictory, 300); // Pequeña pausa para ver la última animación
        }
    }

    // Interfaz y utilidades
    function startTimer() {
        clearInterval(timer);
        seconds = 0;
        timer = setInterval(() => {
            seconds++;
            updateStats();
        }, 1000);
    }

    function updateStats() {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        timeDisplay.textContent = `${m}:${s}`;
        movesDisplay.textContent = moves;
    }

    function showVictory() {
        playVictorySound();
        document.getElementById('victory-time').textContent = timeDisplay.textContent;
        document.getElementById('victory-moves').textContent = moves;
        
        document.getElementById('palindrome-word').textContent = currentPuzzle.word;
        const t = i18n[langSelect.value];
        document.getElementById('palindrome-lemma').innerHTML = `${t.lemma}<span>${currentPuzzle.lema || currentPuzzle.palabra}</span>`;
        
        const linkDle = document.getElementById('link-dle');
        if (currentPuzzle.enlace_diccionario_valido && currentPuzzle.enlace_diccionario) {
            linkDle.href = currentPuzzle.enlace_diccionario;
            linkDle.classList.remove('hidden');
        } else {
            linkDle.classList.add('hidden');
        }

        const linkWiki = document.getElementById('link-wiki');
        if (currentPuzzle.enlace_wiktionary_valido && currentPuzzle.enlace_wiktionary) {
            linkWiki.href = currentPuzzle.enlace_wiktionary;
            linkWiki.classList.remove('hidden');
        } else {
            linkWiki.classList.add('hidden');
        }

        modal.classList.add('active');
    }

    // Botones
    document.getElementById('back-btn').addEventListener('click', () => {
        clearInterval(timer);
        showScreen('start');
    });

    document.getElementById('solve-btn').addEventListener('click', () => {
        const L = currentPuzzle.length;
        const totalCells = cols * rows;
        
        const letterTiles = [];
        const blankTiles = [];
        
        for (let i = 0; i < gridState.length; i++) {
            if (gridState[i]) {
                if (gridState[i].id === 'blank') {
                    blankTiles.push(gridState[i]);
                } else {
                    letterTiles.push(gridState[i]);
                }
            }
        }
        
        letterTiles.sort((a, b) => a.id - b.id);
        
        gridState = new Array(totalCells).fill(null);
        
        for (let i = 0; i < L; i++) {
            gridState[i] = letterTiles[i];
        }
        
        for (let i = 0; i < blankTiles.length; i++) {
            gridState[L + i] = blankTiles[i];
        }
        
        emptySpaces = [totalCells - 1];
        
        renderGrid();
        checkVictory();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
        modal.classList.remove('active');
        startGame(); // Misma dificultad
    });

    document.getElementById('next-level-btn').addEventListener('click', () => {
        modal.classList.remove('active');
        // Aumentar dificultad si estábamos en modo progresivo o número
        if (diffSelect.value === 'auto' || !isNaN(parseInt(diffSelect.value))) {
            const currentLevel = parseInt(levelDisplay.textContent) || currentPuzzle.length;
            
            // Obtener el pool de palabras para el idioma actual
            const lang = langSelect.value;
            let pool = palindromos;
            if (lang !== 'both') {
                pool = palindromos.filter(p => p.lang === lang);
            }
            
            // Buscar palabras con longitud estrictamente mayor que el nivel actual
            const candidatesWithGreaterLen = pool.filter(p => p.length > currentLevel);
            
            if (candidatesWithGreaterLen.length === 0) {
                // No hay más niveles de longitud superior, juego finalizado
                document.getElementById('game-over-modal').classList.add('active');
                return;
            }
            
            // Encontrar la menor longitud disponible entre las superiores
            const nextLen = Math.min(...candidatesWithGreaterLen.map(p => p.length));
            const nextWordCandidates = candidatesWithGreaterLen.filter(p => p.length === nextLen);
            const nextWord = nextWordCandidates[Math.floor(Math.random() * nextWordCandidates.length)];
            
            levelDisplay.textContent = nextLen;
            currentPuzzle = nextWord;
            setupPuzzle(currentPuzzle.word);
            showScreen('game');
            startTimer();
            moves = 0;
            updateStats();
        } else {
            startGame(); // Random
        }
    });

    // Botones Globales
    document.getElementById('info-btn').addEventListener('click', () => {
        document.getElementById('info-modal').classList.add('active');
    });

    document.getElementById('close-info-btn').addEventListener('click', () => {
        document.getElementById('info-modal').classList.remove('active');
    });

    document.getElementById('game-over-btn').addEventListener('click', () => {
        document.getElementById('game-over-modal').classList.remove('active');
        showScreen('start');
    });

    document.getElementById('theme-btn').addEventListener('click', () => {
        const body = document.body;
        const iconSun = document.getElementById('icon-sun');
        const iconMoon = document.getElementById('icon-moon');
        
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            iconSun.style.display = 'block';
            iconMoon.style.display = 'none';
        } else {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            iconSun.style.display = 'none';
            iconMoon.style.display = 'block';
        }
    });

    // Arrancar
    init();
});
