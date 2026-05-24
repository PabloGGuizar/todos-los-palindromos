const fs = require('fs');

const MAX_CONCURRENCY = 10;

async function checkUrl(url) {
    if (!url) return false;
    
    // Validar diccionario catalán (dlc.iec.cat)
    if (url.includes('dlc.iec.cat')) {
        try {
            const response = await fetch(url, { method: 'GET' });
            if (response.status === 404) return false;
            const text = await response.text();
            // Si el texto incluye el mensaje de que no se encontró entrada, es inválido.
            if (text.includes("No s'ha trobat cap entrada")) {
                return false;
            }
            return true;
        } catch (e) {
            console.log(`Failed to fetch ${url}: ${e.message}`);
            return false;
        }
    }
    
    // Validar Wiktionary u otros enlaces
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.status === 404) {
            return false;
        }
        return true;
    } catch (e) {
        // If HEAD fails, try GET just in case
        try {
            const response = await fetch(url, { method: 'GET' });
            if (response.status === 404) {
                return false;
            }
            return true;
        } catch (e2) {
            console.log(`Failed to fetch ${url}: ${e2.message}`);
            return false;
        }
    }
}

async function processFile(filename) {
    console.log(`Processing ${filename}...`);
    const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    
    let activePromises = [];
    let count = 0;
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        
        const processItem = async () => {
            if (item.enlace_diccionario) {
                item.enlace_diccionario_valido = await checkUrl(item.enlace_diccionario);
            }
            if (item.enlace_wiktionary) {
                item.enlace_wiktionary_valido = await checkUrl(item.enlace_wiktionary);
            }
        };

        const p = processItem().then(() => {
            activePromises.splice(activePromises.indexOf(p), 1);
            count++;
            if (count % 10 === 0) {
                console.log(`Processed ${count} / ${data.length}`);
            }
        });
        
        activePromises.push(p);

        if (activePromises.length >= MAX_CONCURRENCY) {
            await Promise.race(activePromises);
        }
    }

    await Promise.all(activePromises);
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Finished processing ${filename}`);
}

async function main() {
    const lang = process.argv[2];
    if (lang !== 'es' && lang !== 'ca') {
        console.log("Por favor, especifica el idioma: node validar_enlaces.js [es|ca]");
        return;
    }

    const file = lang === 'es' ? 'palindromos_es_enriquecidos.json' : 'palindromos_cat_enriquecidos.json';

    if (fs.existsSync(file)) {
        await processFile(file);
    } else {
        console.log(`File not found: ${file}`);
    }
}

main().catch(console.error);
