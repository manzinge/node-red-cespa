module.exports = function (RED) {
    function PressureNode(config) {
        RED.nodes.createNode(this, config);
        this.queryTimeRange = config.querytimerange;
        var node = this;
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

            scotify.execQuery(query, node, msg, {
                did: 0,
                pressure: 6
            });
        });
    }
    RED.nodes.registerType("pressure", PressureNode);
}