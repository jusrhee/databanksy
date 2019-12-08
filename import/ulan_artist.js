const fs = require("fs");
const path = require("path");
const helpers = require('./sql/helpers.js');

const data1 = JSON.parse(fs.readFileSync('./data/ULAN1.json', 'utf8'));
const data2 = JSON.parse(fs.readFileSync('./data/ULAN2.json', 'utf8'));
const data3 = JSON.parse(fs.readFileSync('./data/ULAN3.json', 'utf8'));
const data4 = JSON.parse(fs.readFileSync('./data/ULAN4.json', 'utf8'));


async function loadData() {
    try {
        await helpers.bulk_add_verified_ulan_artist(data1);
        console.log('finishing writing ulan 1', data1.length);
    } catch (e) {
        console.log('error', e);
    }

    try {
        await helpers.bulk_add_verified_ulan_artist(data2);
        console.log('finishing writing ulan 2', data2.length);
    } catch (e) {
        console.log('error', e);
    }

    try {
        await helpers.bulk_add_verified_ulan_artist(data3);
        console.log('finishing writing ulan 3', data3.length);
    } catch (e) {
        console.log('error', e);
    }

    try {
        await helpers.bulk_add_verified_ulan_artist(data4);
        console.log('finishing writing ulan 4', data4.length);
    } catch (e) {
        console.log('error', e);
    }
}

loadData();
