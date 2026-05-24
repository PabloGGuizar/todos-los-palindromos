const fs = require('fs');
async function test() {
    const urlInvalid = 'https://dlc.iec.cat/Results?EntradaText=zxczxczxc';
    const r = await fetch(urlInvalid);
    const t = await r.text();
    fs.writeFileSync('invalid.html', t);
}
test();
