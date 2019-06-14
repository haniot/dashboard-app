const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const envsPath = "./src/environments";

/*Create the env dir if it doesn't exist */
if (!fs.existsSync(envsPath)) {
    fs.mkdirSync(envsPath)
}

const api_url = process.env.API_GATEWAY_SERVICE;
const node_env = process.env.NODE_ENV;

var wstream = fs.createWriteStream(envsPath + '/environment.ts');
wstream.write('export const environment = {\n');
wstream.write(`\tproduction: ${node_env === 'production'},\n`);
wstream.write('\tapi_url: "' + api_url + '",\n');
wstream.write('};\n');
wstream.end();

var wstream = fs.createWriteStream(envsPath + '/environment.prod.ts');
wstream.write('export const environment = {\n');
wstream.write(`\tproduction: ${node_env === 'production'},\n`);
wstream.write('\tapi_url: "' + api_url + '",\n');
wstream.write('};\n');
wstream.end();
