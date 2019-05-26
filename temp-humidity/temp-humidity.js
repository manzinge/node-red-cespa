module.exports = function (RED) {
    function TempHumidityNode(config) {
        RED.nodes.createNode(this, config);
        this.requestedinfo = config.requestedinfo;
        this.queryTimeRange = config.querytimerange;
        var node = this;
        var array = require('lodash/array');

        node.on('input', function (msg) {
            const scotify = require('../scotify.js');

            var currentTimestamp = Date.now() * 1000;

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "ruuvidata",
                "where": {
                    "TS": {
                        ">": scotify.calcTimeDiff(currentTimestamp, node.queryTimeRange)
                    }
                }
            }

            var columns = [];
            columns.push(["did", 0]);

            if (node.requestedinfo == 3) {
                columns.push(["hum", node.requestedinfo]);
            } else {
                columns.push(["temp", node.requestedinfo]);
            }

            scotify.execQuery(query, node, msg, array.fromPairs(columns));

        });
    }
    RED.nodes.registerType("temp-humidity", TempHumidityNode);
}