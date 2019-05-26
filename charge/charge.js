module.exports = function (RED) {
    function ChargeNode(config) {
        RED.nodes.createNode(this, config);
        this.queryTimeRange = config.querytimerange;
        var node = this;
        node.on('input', function (msg) {
            const scotify = require('../scotify.js');

            var currentTimestamp = Date.now() * 1000;

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "battery",
                "where": {
                    "TS": {
                        ">": scotify.calcTimeDiff(currentTimestamp, node.queryTimeRange)
                    }
                }
            }

            scotify.execQuery(query, node, msg, {
                did: 0,
                time: 1,
                chargeState: 5
            });

        });
    }
    RED.nodes.registerType("charge", ChargeNode);
}