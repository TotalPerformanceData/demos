/* 
Node.js example of Runner Status Feed usage
*/

const WebSocket = require('ws')

const VENDOR_KEY = process.env('VENDOR_KEY') ?? '';
const CLIENT_KEY = process.env('CLIENT_KEY') ?? VENDOR_KEY ?? '';

async function main() {

    try {
        const response = await fetch('https://stg.tpd.zone/json-rpc/v2/status/?date=today');
        if (response.status == 200) {
            const json = response.json();
            console.log(json); // Races sharecode to info

            const ws = new WebSocket('wss://stream.tpd.zone/realtime_1.4');
            ws
                .on('error', console.error)
                .on('open', () => console.info('opened'))
                .on('message', (data) => {
                    console.debug('%s', data);
                    try {
                        const msg = JSON.parse(data);
                        if (msg.status == 'connected' && msg.open_markets) {
                            ws.send(JSON.stringify({
                                "vendorKey": VENDOR_KEY,
                                "clientKey": CLIENT_KEY,
                                "sc": msg.open_markets,
                                "inc": [
                                    "RS"
                                ],
                            }));
                        } else if (msg.C) {
                            // Use msg.RS
                        }
                    } catch (err) {
                        console.error(err);
                    }
                });
        } else {
            console.error(response.statusText);
        }
    } catch (err) {
        console.error(err);
    }

}


main();
