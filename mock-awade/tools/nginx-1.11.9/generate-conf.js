if (process.argv.length < 4) {
    throw new Error('invalid param! usage: node generate-conf.js rdkPort=5812 loginPlugin=mock');
}

const param = {rdkPort: 0, loginPlugin: 'invalid'};
for (let i = 2; i < process.argv.length; i++) {
    const argv = process.argv[i].split(/=/);
    param[argv[0].trim()] = argv[1].trim();
}

param.rdkPort = parseInt(param.rdkPort);
if (isNaN(param.rdkPort) || param.rdkPort <= 0) {
    throw new Error('invalid rdk port!');
}

if (param.loginPlugin !== 'ict' && param.loginPlugin !== 'mock' && param.loginPlugin !== 'uac') {
    throw new Error('invalid login plugin, it should be one of "ict" / "mock" / "uac"!');
}

const fs = require('fs');
const vmaxConf = fs.readFileSync(`${__dirname}/../../app/ui-designer/build/awade_vmax.conf`).toString()
    .replace(/\b10001\b/g, param.rdkPort)
    .replace(/\/home\/awade-runtime\//g, "../../")
    .replace(/\/ict\//, `/${param.loginPlugin}/`);
fs.writeFileSync(`${__dirname}/conf/auto-generated-from-awade_vmax.conf`, vmaxConf);

