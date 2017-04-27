
var assert   = require('assert'),
    config   = require('../config/Config'),
    models   = require('../models'),
    proxy    = require('../proxy'),
    // async    = require('async'),
    Restaurant= models.Restaurant,
    ObjectId = require('mongoose').Types.ObjectId;

describe('Restaurant Model', function() {

    beforeEach( function (done) {
        done();
    });

    it('validate model definition', function (done) {
        var query = {group: 1};
        models.Editor.listChineseEditors(query, function(err, result) {

            console.log(result);
            done();
        });
    });

    it('new and save one auditing', function (done) {
        var one = {
            // editorname: "mojixiang",
            item_id: "516a3519f8a6461636000002",
            status : '2',
            en_info: {
                // status : '2',
                // editorname: 'mojixiang',
                // auditorname: 'sdf'
            }
        }
        proxy.Auditing.update(one, function(err, result) {
            if(err){
                console.log(err);
            }else{
                console.log(result);
            }
            done();
        })
    })

    it('get city by id', function (done) {
        var query = {_id : '516a34f958e3511036000001'};
        proxy.City.findCity(query, function (err, result) {
            console.log(result);
            done();
        })
    })

    it.only('get area by cityname', function(done) {
        var query = {
            area_name: '联合广场'
        }
        proxy.Area.getAreasByQuery(query, function(err, result) {
            console.log(result);
            done();
        })
    })
});
