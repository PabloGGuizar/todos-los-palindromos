const words = require('an-array-of-catalan-words');
const fs = require('fs');

function getNormalized(word) {
  // Descomponemos y eliminamos marcas de acento pero preservamos la cejilla (\u0327)
  let normalized = word.normalize('NFD');
  normalized = normalized.replace(/[\u0300-\u0326\u0328-\u036f]/g, "");
  return normalized.normalize('NFC').toLowerCase();
}

const palindromes = [];
const seen = new Set();

for (const word of words) {
  const normalized = getNormalized(word);
  
  // Tomar desde 3 letras
  if (normalized.length < 3) {
    continue;
  }
  
  const reversed = normalized.split('').reverse().join('');
  
  if (normalized === reversed) {
    // Evitar duplicados por acentos
    if (!seen.has(normalized)) {
      seen.add(normalized);
      palindromes.push(word);
    }
  }
}

fs.writeFileSync('palindromos_cat.json', JSON.stringify(palindromes, null, 2), 'utf-8');
console.log(`Encontrados ${palindromes.length} palíndromos en catalán únicos.`);
