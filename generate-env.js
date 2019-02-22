const fs = require('fs');

const envsPath = "src/environments";

const args = process.argv;

var wstream = fs.createWriteStream(envsPath + '/environment.ts');
wstream.write('export const environment = {\n');
wstream.write('\tproduction: false,\n');
wstream.write('\tapi_url: "' + args[2] + '",\n');
wstream.write('};\n');
wstream.end();

var wstream = fs.createWriteStream(envsPath + '/environment.prod.ts');
wstream.write('export const environment = {\n');
wstream.write('\tproduction: true,\n');
wstream.write('\tapi_url: "' + args[3] + '",\n');
wstream.write('};\n');
wstream.end();
