const words = require('an-array-of-spanish-words');
const fs = require('fs');

function isPalindrome(word) {
  // Normalize string to remove accents/diacritics
  const normalized = word.normalize('NFC').toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u');
  
  // Ignore single-letter words as trivial
  if (normalized.length < 2) {
    return false;
  }
  
  const reversed = normalized.split('').reverse().join('');
  return normalized === reversed;
}

const palindromes = words.filter(isPalindrome);

fs.writeFileSync('palindromos_es.json', JSON.stringify(palindromes, null, 2), 'utf-8');
console.log(`Encontrados ${palindromes.length} palíndromos.`);
