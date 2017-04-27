/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 下午5:08
 * To change this template use File | Settings | File Templates.
 */
require('../config/Config');
var DBRef = require('mongodb').DBRef;
var LabelProvider = require("../config/LabelProvider").LabelProvider;
var labelProvider = new LabelProvider();
var ObjectID = require('mongodb').ObjectID;
var Util = require('./util');
fs = require('fs');

exports.saveLabel = function (req, res) {
    var data = req.body;
    labelProvider.findOne({'label':data.label},{},function(err,result){
         if(err){
             res.send({isSuccess:false, info:err});
         }else{
             if(result){
                     res.send({isSuccess:true,_id:result._id});
             }else{
                 labelProvider.insert(data, {safe:true}, function (err, result) {
                     if (err) {
                         res.send({isSuccess:false, info:err});
                     } else {
                         res.send({isSuccess:true, _id:result[0]._id});
                     }
                 });
             }
         }
    });
};



exports.getAllLabel = function (req, res) {

    labelProvider.find({}, {sort:{'level':-1}}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};

exports.getLabelByPage = function (req, res) {

    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    labelProvider.find({}, {sort:{'level':1},skip:skip, limit:req.params.pageLimit}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({label:result});
        }
    });
};

exports.getLabelByLabelID = function (req, res) {
    //console.log(req.params.key+'#####');
    var key=req.params.key;
    var query="";
    key=Util.trim(key);
    if(key==''||typeof(key)=='undefined' ){
        query={'level':'2'};
    }
    else{
        var tmp="/"+key+"/";
        tmp=eval(tmp);
        query={"level":"2",label:tmp};
    }
    labelProvider.find(query, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({label:result});
        }
    });
/*    labelProvider.findOne({'_id':new ObjectID(req.params.labelID)}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                console.log(result.subLabel);
                if(result.subLabel&&result.subLabel.length){
                    var sblabel = [];
                    startTask(result.subLabel,sblabel,0,result.subLabel.length,function(sblabel){
                        result.subLabel = sblabel;
                        console.log(sblabel);
                        res.send({label:result.subLabel});
                    });
                }else{
                    res.send({label:''});
                }
            }else{
                res.send({label:''});
            }

        }
    });*/
};
exports.getLabelByID = function (req, res) {
    labelProvider.findOne({'_id':new ObjectID(req.params.id)}, {label:1,subLabel:1}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                if(result.subLabel&&result.subLabel.length){
                    var sblabel = [];
                    startTask(result.subLabel,sblabel,0,result.subLabel.length,function(sblabel){
                        result.subLabel = sblabel;
                        res.send(result);
                    });
                }else{
                    res.send(result);
                }
            }else{
                res.send(null);
            }

        }
    });
};

exports.getLabelByLevel = function (req, res) {
    labelProvider.find({'level':req.params.num}, {}, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send({label:result});
        }
    });
};
 function getSubLabel(label,sblabel,callback){
     var _id = label;
     labelProvider.findOne({'_id':new ObjectID(_id)},{'label':1},function(err,re){
         if(err){
             console.log(err);
         }else{
             if(re){
                 sblabel.push({'label':re.label,'_id':re._id});
                 callback(sblabel);
             }else{
                 callback(sblabel);
             }
         }

     });
 }
 function startTask(paramsArray,sblabel,current,count,callBack){
     if(current>=count){
         callBack(sblabel);
     }else{
         getSubLabel(paramsArray[current],sblabel,function(sblabel){
             startTask(paramsArray,sblabel,current+1,count,callBack);
         });
     }
 }
 exports.getLabelByLabId = function (req, res){
    var id = req.params.id;
    labelProvider.findOne({_id: new ObjectID(id)}, function(err, result) {
        if(err){
            res.send({err: err});
        } else {
            res.send(result);
        }
    })
 }
exports.getLabel = function (req, res) {
    if (req.params.labelID) {
        labelProvider.findOne({_id:new ObjectID(req.params.labelID)}, {}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                var sblabel = [];
                if(result.subLabel&&result.subLabel.length){
                    startTask(result.subLabel,sblabel,0,result.subLabel.length,function(sblabel){
                        result.subLabel = sblabel;
                        res.send(result);
                    });
                }else{
                    res.send(result);
                }
            }
        });
    } else {
        labelProvider.find({}, {}, function (err, result) {
            if (err) {
                res.send({err:err});
            } else {
                res.send(result);
            }
        });
    }
};
exports.addLabel = function (req, res) {
    var data = req.body;
     if(data.subLabel.length>0){
         var sub = [];
         for(var i=0;i<data.subLabel.length;i++){
             sub.push(data.subLabel[i]);
         }
     }
    data.subLabel = sub;
    data.createFlag = '0';
    labelProvider.insert(data, {safe:true}, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result[0]._id});
        }
    });
};
exports.updateLabel = function (req, res) {
    var data = req.body;
    if(data.subLabel.length>0){
        var sub = [];
        for(var i=0;i<data.subLabel.length;i++){
            console.log(data.subLabel[i]);
            sub.push(data.subLabel[i]);
        }
    }
    data.subLabel = sub;
    var setJson = {label:data.label,level:data.level,subLabel:data.subLabel,classname:data.classname,createFlag:'0'};
    labelProvider.update({_id:new ObjectID(req.params.labelID)}, {$set:setJson}, {safe:true}, function (err, result) {
        if (err) {
            console.log("userProvider.update err: ", err);
            res.send({err:err});
        } else {
            console.log("userProvider.update result: ", result);
            res.send({isSuccess:true});
        }
    });
};

exports.deleteLabel = function (req, res) {
    labelProvider.remove({_id:new ObjectID(req.params.labelID)}, {}, function (err, result) {
        if (err) {
            console.log("userProvider.remove err: ", err);
            res.send({err:err});
        } else {
            console.log("userProvider.remove result: ", result);
            res.send({_id:req.params.labelID});
        }
    });
};

