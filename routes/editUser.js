/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var DBRef = require('mongodb').DBRef;
var EditUserProvider = require("../config/EditUserProvider").EditUserProvider;
var editUserProvider = new EditUserProvider();
var ObjectID = require('mongodb').ObjectID;
var Editor = require('../models').Editor;
var async = require('async');
fs = require('fs');

exports.login = function(req,res){
    var data = req.body;
//    37ab6a3e8026001dccebe9547e79dd7f type:0普通用户，1管理员
//    editUserProvider.insert({username:'jiangli',password:'37ab6a3e8026001dccebe9547e79dd7f',type:1},{safe:true}, function (err, result) {
//        if (err) {
//            console.log(err);
//        } else {
//            console.log('llllllllllllllllllllllll');
//        }
//
//    });

    editUserProvider.findOne({username:data.username,password:data.password},{password:0},function(err,result){
        if(err) throw err;
        if(result){
            result.login = true;
            res.locals.session.user = result;
            res.send(result);
        }else{
            var data ={};
            data.login = true;
            res.send(result);
        }
    });
};
exports.saveUser = function(req,res){
    var data = req.body;
    console.log(data);
    editUserProvider.insert({username:data.username,password:data.password,type:data.type,group:data.group},{safe:true}, function (err, result) {
        if (err) {
            res.send({isSuccess:false});
            throw err;
        } else {
            res.send({isSuccess:true, _id:result[0]._id});
        }

    });
};
exports.updateUser = function(req,res){
    var data = req.body;
    editUserProvider.update({_id:new ObjectID(req.params.userID)},{$set:{password:data.password,type:data.type,group:data.group}},{}, function (err) {
        if (err) {
            res.send({isSuccess:false});
            throw err;
        } else {
            res.send({isSuccess:true});
        }

    });
};
exports.deleteUser = function(req,res){
    editUserProvider.remove({_id:new ObjectID(req.params.userID)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({_id:req.params.attractionsID});
        }
    });
};

exports.getUserByPage = function(req,res){
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    editUserProvider.count({}, function (err, count) {
        editUserProvider.find({}, {sort:{'hot_flag':-1}, skip:skip, limit:req.params.pageLimit}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send({user:result, count:count});
            }
        });
    });
};

exports.getAllEditor = function(req,res){
    editUserProvider.find({type:0}, {sort:{'username':-1}}, function (err, result) {
        if (err) {
            res.send({status:false,err:err});
        } else {
            res.send({status:true,results:result});
        }
    });
};

exports.showEditors = function(req, res) {
    res.render('editor');
}
exports.getEditors = function(req, res) {
    async.auto({
        adminstrator : function(cb) {
            Editor.getAdmin({type : 0}, cb);
        },
        chineseeditors : function(cb) {
            Editor.listChineseEditors({group: 0, type: 1}, cb);
        },
        englisheditors : function(cb) {
            Editor.listEnglishEditors({group: 1, type: 1}, cb);
        }
    }, function(err, result) {
        res.send(result);
    })
}
