const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: '1707b7c231884c38825a4b81438b109c',
    formatter:null
};
const geocoder = NodeGeocoder(options);

module.exports = geocoder;