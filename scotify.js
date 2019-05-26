const fs = require('fs'),
    path = require('path'),
    urlencode = require('urlencode'),
    request = require('request'),
    certFile = path.resolve(__dirname, 'ssl/RESTTEST_cert.pem'),
    keyFile = path.resolve(__dirname, 'ssl/RESTTEST_key.pem');

var _array = require('lodash/array');
var _lang = require('lodash/lang');
var _collection = require('lodash/collection');

// Set our values that are needed to connect to the RESTapi via SSL/TLS
cert = fs.readFileSync(certFile);
key = fs.readFileSync(keyFile);

// Decodes the given JSON query object to an base64 string and concatinates it with our url
getApiUrl = (queryObject) => "https://ctpwyd.conti.de:443/data?q=" + urlencode(new Buffer.from(JSON.stringify(queryObject)).toString("base64"));

// Returns the request options object with the respective tls credentials for the cert and key
getOptions = (query) => {
    return {
        url: getApiUrl(query),
        cert: cert,
        key: key
    }
}

getResponseData = (data, requestedColumns) => {
    return data.map(function (item) {
        var results = [];

        Object.keys(requestedColumns).forEach(function (key) {
            results.push([
                key,
                item[requestedColumns[key]]
            ])

        });
        return _array.fromPairs(results);
    });
};

// Returns the difference of our current timestamp and the query timestamp as an integer
exports.calcTimeDiff = (currentTimestamp, queryTimestamp) => {
    return parseInt(currentTimestamp - (queryTimestamp * 100000));
}
// Execute the final query and fetches the data from the REST API + handles error cases and dataItems "overflow"
function queryImplementation(query, node, msg, requestedColumns, requestDataHead) {
    var requestDataHead = requestDataHead || {
        "items": [],
        "itemsCount": 0
    };

    request.get(getOptions(query), function (error, response, body) {
        node.status({
            fill: "blue",
            shape: "dot",
            text: "send request"
        });


        if (response.statusCode == 200) {
            body = JSON.parse(body);
            var receivedItems = _lang.toArray(getResponseData(body.result.data, requestedColumns));

            // Filtering out all unwanted device id's
            if (receivedItems.length > 0)
                receivedItems = _collection.filter(receivedItems, function (row) {
                    return row.did === "181812101806072401603";
                    // return row.did === "181812101807312401616";
                });

            // Merging of all items
            requestDataHead.items = requestDataHead.items.concat(receivedItems);
            requestDataHead.itemsCount = body.result["items-left"];

            node.status({
                fill: "blue",
                shape: "dot",
                text: "still " + requestDataHead.itemsCount + " items more to fetch"
            });

            if (requestDataHead.itemsCount > 0) {
                query["next-item"] = body.result["next-item"];
                return queryImplementation(query, node, msg, requestedColumns, requestDataHead, false);
            }

            node.status({
                fill: "green",
                shape: "dot",
                text: "fetched all data"
            });

            requestDataHead.itemsCount = Object.keys(requestDataHead.items).length;
            msg.payload = requestDataHead;
            node.send(msg);
        } else {
            node.status({
                fill: "red",
                shape: "dot",
                text: "error " + error
            });

            node.error("error", body.error);
        }
    });
}

exports.execQuery = (query, node, msg, requestedColumns, requestDataHead) => queryImplementation(query, node, msg, requestedColumns, requestDataHead)