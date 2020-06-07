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

const comf = require('./lib/comfortmodels.js').comf;
const limits = require('./lib/global.js').envVarLimits;

module.exports = function (RED) {
    'use strict';

    function ComfortNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        node.name = n.name;
        node.tempField = n.tempField || 'payload.temperature';
        node.tempFieldType = n.tempFieldType || 'msg';
        node.mrtField = n.mrtField || node.tempField;
        node.mrtFieldType = n.mrtFieldType || 'operative';
        node.humidityField = n.humidityField || 'payload.humidity';
        node.humidityFieldType = n.humidityFieldType || 'msg';
        node.airspeedField = n.airspeedField || 0;
        node.airspeedFieldType = n.airspeedFieldType || 'num';
        node.metabolicRateField = n.metabolicRateField || 1;
        node.metabolicRateFieldType = n.metabolicRateFieldType || 'num';
        node.clothingLevelField = n.clothingLevelField || 0.5;
        node.clothingLevelFieldType = n.clothingLevelFieldType || 'num';
        node.comfortField = n.comfortField || 'payload.comfort';
        node.comfortFieldType = n.comfortFieldType || 'msg';
        node.sensationField = n.sensationField || 'payload.sensation';
        node.sensationFieldType = n.sensationFieldType || 'msg';
        node.on('input', function (msg) {
            var errorStr = '';

            var temp = RED.util.evaluateNodeProperty(node.tempField, node.tempFieldType, node, msg) * 1.0;
            errorStr += validateBounds('Temperature', temp, limits.ta.si);

            var mrt;
            if (node.mrtFieldType == 'operative') {
                mrt = temp;
            } else {
                mrt = RED.util.evaluateNodeProperty(node.mrtField, node.mrtFieldType, node, msg) * 1.0;
            }
            errorStr += validateBounds('Mean Radiant Temp', mrt, limits.tr.si);

            var airspeed = RED.util.evaluateNodeProperty(node.airspeedField, node.airspeedFieldType, node, msg) * 1.0;
            errorStr += validateBounds('Air Speed', airspeed, limits.vel.si);

            var humidity = RED.util.evaluateNodeProperty(node.humidityField, node.humidityFieldType, node, msg) * 1.0;
            errorStr += validateBounds('Humidity', humidity, limits.rh);

            var metabolicRate = RED.util.evaluateNodeProperty(node.metabolicRateField, node.metabolicRateFieldType, node, msg) * 1.0;
            errorStr += validateBounds('Metabolic Rate', metabolicRate, limits.met);

            var clothingLevel = RED.util.evaluateNodeProperty(node.clothingLevelField, node.clothingLevelFieldType, node, msg) * 1.0;
            errorStr += validateBounds('Clothing Level', clothingLevel, limits.clo);

            if (errorStr.length > 0) {
                return node.error(errorStr, msg);
            }

            var comfort;
            if (node.airspeed <= 0.2) {
                comfort = comf.pmv(temp, mrt, airspeed, humidity, metabolicRate, clothingLevel, 0);
            } else {
                comfort = comf.pmvElevatedAirspeed(temp, mrt, airspeed, humidity, metabolicRate, clothingLevel, 0);
            }

            var sensation;
            if (comfort.pmv < -2.5) { sensation = 'cold'; }
            else if (comfort.pmv < -1.5) { sensation = 'cool'; }
            else if (comfort.pmv < -0.5) { sensation = 'slightly cool'; }
            else if (comfort.pmv < 0.5) { sensation = 'neutral'; }
            else if (comfort.pmv < 1.5) { sensation = 'slightly warm'; }
            else if (comfort.pmv < 2.5) { sensation = 'warm'; }
            else { sensation = 'hot'; }

            if (node.comfortFieldType === 'msg') {
                RED.util.setMessageProperty(msg, node.comfortField, comfort.pmv);
            } else if (node.comfortFieldType === 'flow') {
                node.context().flow.set(node.comfortField, comfort.pmv);
            } else if (node.comfortFieldType === 'global') {
                node.context().global.set(node.comfortField, comfort.pmv);
            }

            if (node.sensationFieldType === 'msg') {
                RED.util.setMessageProperty(msg, node.sensationField, sensation);
            } else if (node.sensationFieldType === 'flow') {
                node.context().flow.set(node.sensationField, sensation);
            } else if (node.sensationFieldType === 'global') {
                node.context().global.set(node.sensationField, sensation);
            }

            node.send(msg);
        });

        function validateBounds(propName, value, bounds) {
            if (value < bounds.min || value > bounds.max) {
                return `Invalid ${propName} value '${value}' (allowed: [${bounds.min}, ${bounds.max}]). `;
            }
            return '';
        }
    }

    RED.nodes.registerType('comfort', ComfortNode);
};
