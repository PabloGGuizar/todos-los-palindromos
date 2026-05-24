const fs = require('fs');
const https = require('https');

function fetchWiktionary(lang, word) {
  return new Promise((resolve) => {
    const url = `https://${lang}.wiktionary.org/w/api.php?action=query&prop=revisions&rvprop=content&titles=${encodeURIComponent(word)}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'NodeJS-Game-Script/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function extractLemma(content, lang, word) {
  if (lang === 'es') {
    // {{forma verbo|abatatar}} o {{forma adjetivo|soso|...}} o {{f.v|abatatar}}
    const match = content.match(/{{(?:forma\s+[a-z\s]+|f\.[vas]|forma)\|([^|}]+)/i);
    if (match) {
      let lema = match[1].trim();
      if (lema.includes('=')) {
        // e.g. {{forma verbo|leng=es|abatatar}}
        const parts = match[0].split('|'); // wait, better match whole template
        const fullTemplateMatch = content.match(/{{(?:forma\s+[a-z\s]+|f\.[vas]|forma)\|([^}]+)}}/i);
        if (fullTemplateMatch) {
            const params = fullTemplateMatch[1].split('|');
            const realLemma = params.find(p => !p.includes('='));
            if (realLemma) return realLemma.trim();
        }
      } else {
        return lema;
      }
    }
  } else if (lang === 'ca') {
    // {{ca-forma-conj|anar|...}} o {{ca-forma-subst|...}}
    const match = content.match(/{{ca-forma-[a-z]+\|([^|}]+)/i);
    if (match) {
      return match[1].trim();
    }
  }
  return word; // Fallback
}

async function getLemma(lang, word) {
  const data = await fetchWiktionary(lang, word);
  if (!data || !data.query || !data.query.pages) return word;
  
  const page = Object.values(data.query.pages)[0];
  if (page.missing || !page.revisions) return word;
  
  const content = page.revisions[0]['*'];
  return extractLemma(content, lang, word);
}

// Helper to run in chunks to avoid overwhelming the API
async function processArrayInChunks(array, lang, chunkSize = 10) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const chunkPromises = chunk.map(async (word) => {
      const lema = await getLemma(lang, word);
      return {
        palabra: word,
        lema: lema,
        enlace_diccionario: lang === 'es' ? `https://dle.rae.es/${lema}` : `https://dlc.iec.cat/Results?EntradaText=${lema}`,
        enlace_wiktionary: `https://${lang}.wiktionary.org/wiki/${word}`
      };
    });
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
    // slight delay
    await new Promise(r => setTimeout(r, 100));
  }
  return results;
}

async function run() {
  const lang = process.argv[2];
  if (lang !== 'es' && lang !== 'ca') {
    console.log("Por favor, especifica el idioma: node enriquecer.js [es|ca]");
    return;
  }

  if (lang === 'es') {
    console.log("Procesando palíndromos en español...");
    const palindromosEs = JSON.parse(fs.readFileSync('palindromos_es.json', 'utf8'));
    const enrichedEs = await processArrayInChunks(palindromosEs, 'es', 20);
    fs.writeFileSync('palindromos_es_enriquecidos.json', JSON.stringify(enrichedEs, null, 2), 'utf-8');
    console.log(`Guardados ${enrichedEs.length} palíndromos en español.`);
  } else if (lang === 'ca') {
    console.log("Procesando palíndromos en catalán...");
    const palindromosCa = JSON.parse(fs.readFileSync('palindromos_cat.json', 'utf8'));
    const enrichedCa = await processArrayInChunks(palindromosCa, 'ca', 20);
    fs.writeFileSync('palindromos_cat_enriquecidos.json', JSON.stringify(enrichedCa, null, 2), 'utf-8');
    console.log(`Guardados ${enrichedCa.length} palíndromos en catalán.`);
  }
}

run();
