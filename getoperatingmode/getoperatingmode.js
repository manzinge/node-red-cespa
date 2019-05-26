module.exports = function (RED) {
    function GetoperatingmodeNode(config) {
        RED.nodes.createNode(this, config);
        this.queryTimeRange = config.querytimerange;
        var node = this;
        node.on('input', function (msg) {
            const scotify = require('../scotify.js');

            var currentTimestamp = Date.now() * 1000;

            const query = {
                "db": "tires",
                "schema": "hackaton",
                "table": "vehicle",
                "where": {
                    "AND": [
                        //         // {
                        //         //     "DID": {
                        //         //         "=": "181812101806072401603"
                        //         //     }
                        //         // },
                        {
                            "TS": {
                                ">": scotify.calcTimeDiff(currentTimestamp, node.queryTimeRange)
                            }
                        }
                    ]
                }
            }

            scotify.execQuery(query, node, msg, {    
                did: 0,
                em_opm: 13
            });

        });
    }
    RED.nodes.registerType("getoperatingmode", GetoperatingmodeNode);
}