/**
 * Copyright 2017 Dean Cording <dean@cording.id.au>
 *
 *    This program is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; either version 2 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 **/

const util = require('util');
const comf = require('./comfortmodels.js').comf;

module.exports = function(RED) {
    "use strict";

    function ComfortNode(n) {
        RED.nodes.createNode(this,n);
        var node = this;

        node.name = n.name;
        node.tempField = n.tempField || "payload.temperature";
        node.tempFieldType = n.tempFieldType || "msg";
        node.humidityField = n.humidityField || "payload.humidity";
        node.humidityFieldType = n.humidityFieldType || "msg";
        node.airspeedField = n.airspeedField || 0;
        node.airspeedFieldType = n.airspeedFieldType || "num";
        node.metabolicRateField = n.metabolicRateField || 1;
        node.metabolicRateFieldType = n.metabolicRateFieldType || "num";
        node.clothingLevelField = n.clothingLevelField || 0.5;
        node.clothingLevelFieldType = n.clothingLevelFieldType || "num";
        node.comfortField = n.comfortField  || "payload.comfort";
        node.comfortFieldType = n.comfortFieldType || "msg";
        node.on("input", function(msg) {

            var temp = RED.util.evaluateNodeProperty(node.tempField,node.tempFieldType,node,msg);
            var humidity = RED.util.evaluateNodeProperty(node.humidityField,node.humidityFieldType,node,msg);
            var airspeed = RED.util.evaluateNodeProperty(node.airspeedField,node.airspeedFieldType,node,msg);
            var metabolicRate = RED.util.evaluateNodeProperty(node.metabolicRateField,node.metabolicRateFieldType,node,msg);
            var clothingLevel = RED.util.evaluateNodeProperty(node.clothingLevelField,node.clothingLevelFieldType,node,msg);

            var comfort;

            if (node.airspeed <= 0.2) {
                comfort = comf.pmv(temp, temp, airspeed, humidity, metabolicRate, clothingLevel, 0)
            } else {
                comfort = comf.pmvElevatedAirspeed(temp, temp, airspeed, humidity, metabolicRate, clothingLevel, 0)
            }

            if (node.comfortFieldType === 'msg') {
                RED.util.setMessageProperty(msg,node.comfortField,comfort.pmv);
            } else if (node.comfortFieldType === 'flow') {
                node.context().flow.set(node.comfortField,comfort.pmv);
            } else if (node.comfortFieldType === 'global') {
                node.context().global.set(node.comfortField,comfort.pmv);
            }

            node.send(msg);

        });
    }

    RED.nodes.registerType("comfort", ComfortNode);
}

