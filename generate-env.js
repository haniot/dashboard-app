const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config()

const envsPath = './src/environments'

/*Create the env dir if it doesn't exist */
if (!fs.existsSync(envsPath)) {
    fs.mkdirSync(envsPath)
}

const api_url = process.env.API_GATEWAY_SERVICE
const node_env = process.env.NODE_ENV
const ls_secret_key = process.env.LS_SECRET_KEY
const reCaptcha_siteKey = process.env.RECAPTCHA_KEY

var wstream = fs.createWriteStream(envsPath + '/environment.ts')
wstream.write('export const environment = {\n')
wstream.write(`\tproduction: ${node_env === 'production'},\n`)
wstream.write('\tapi_url: "' + api_url + '",\n')
wstream.write('\tls_secret_key: "' + ls_secret_key + '",\n')
wstream.write('\treCaptcha_siteKey: "' + reCaptcha_siteKey + '",\n')
wstream.write('};\n')
wstream.end()

var wstream = fs.createWriteStream(envsPath + '/environment.prod.ts')
wstream.write('export const environment = {\n')
wstream.write(`\tproduction: ${node_env === 'production'},\n`)
wstream.write('\tapi_url: "' + api_url + '",\n')
wstream.write('\tls_secret_key: "' + ls_secret_key + '",\n')
wstream.write('\treCaptcha_siteKey: "' + reCaptcha_siteKey + '",\n')
wstream.write('};\n')
wstream.end()
