const freeTextAPI = require('free-text-api');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const version = require('./package.json').version;

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Free texting app listening on port ${port}!`));

const textService = freeTextAPI({
    carrierLookup: {
        method: process.env.LOOKUPMETHOD,
        apiKey: process.env.LOOKUPKEY,
        defaultCountry: process.env.LOOKUPCOUNTRY
    },
    mailOptions: {
        from: process.env.FROM
    },
    transport: {
        service: process.env.TRANSPORTMETHOD,
        auth: {
            api_key: process.env.TRANSPORTAPIKEY
        }
    }
});

app.post('/text', (req, res) => {
    const {number, message, carrier, from} = req.body;
    textService.sendText({
        number: number,
        message: message,
        carrier: carrier,
        from: from
    }).then((result) => {
        res.send(result);
    });
});

app.get('/version', (req, res) => {
    res.send(version);
});

app.get('/', (req, res) => {
    res.send(`Free text service is up and running`);
})
