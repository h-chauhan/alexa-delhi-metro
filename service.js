const rp = require('request-promise');
const cheerio = require('cheerio');

const FARE_URL = 'https://delhimetrorail.info/';
const GET_STATION_OPTIONS = {
    uri: "https://delhimetrorail.info/delhi-metro-fare",
    transform: function (body) {
        return cheerio.load(body);
    }
};

getStations = function () {
    return new Promise((resolve, reject) => {
        rp(GET_STATION_OPTIONS).then(($) => {
            // REQUEST SUCCEEDED: DO SOMETHING
            // Get station list
            let stations = [];
            $('select').find('option').each((i, item) => stations.push([$(item).val(), $(item).text()]));
            console.log(stations.length + " loaded!!!");
            resolve(stations);
        }).catch(function (err) {
            // REQUEST FAILED: ERROR OF SOME KIND
            console.error(err);
            reject(err);
        });
    });
};

var checkIfStationExist = function (station) {
    return new Promise((resolve) => {
        getStations().then(stations => {
            for (pair of stations) {
                if (pair[1].toLowerCase().indexOf(station.toLowerCase()) != -1) {
                    resolve(pair);
                }
            }
            resolve(undefined);
        });
    });
};

var getFareOptions = function (fromStation, toStation) {
    return {
        uri: FARE_URL + fromStation[0] + '-to-' + toStation[0],
        transform: body => {
            return cheerio.load(body)
        }
    }
}

var getFare = function (fromStation, toStation) {
    let options = getFareOptions(fromStation, toStation);
    return new Promise((resolve) => {
        rp(options).then($ => {
            resolve($($($('body').find('table')[1]).find('td')[1]).text());
        });
    });
};

var getRoute = function (fromStation, toStation) {
    let options = getFareOptions(fromStation, toStation);
    return new Promise((resolve) => {
        rp(options).then($ => {
            let interchange = [];
            $('html').find('.IW').each((i, iw) => {
                interchange.push($($($($(iw).parent()).next()).children('.left')).text());
            });
            resolve(interchange);
        });
    });
}

module.exports = {
    "checkIfStationExist": checkIfStationExist,
    "getFare": getFare,
    "getRoute": getRoute
}


// TEST
// let fromStation, toStation;

// checkIfStationExist('Sarojini Nagar').then(res => {
//     fromStation = res;
//     checkIfStationExist('Rajiv Chowk').then(res => {
//         toStation = res;
//         getFare(fromStation, toStation).then(console.log);
//         getRoute(fromStation, toStation).then(console.log);
//     });
// });