var Task = require('../proxy').Task;
var Taskquestion = require('../proxy').Taskquestion;
var Auditing = require('../proxy').Auditing;
var Util = require('./util');
var ObjectID = require('mongodb').ObjectID;
var EventProxy = require('eventproxy');
var Attraction = require('./attractions');
var Life = require('./life');

//-------------------------task----------------------------
exports.getTask = function(req,res){
	Task.getTask(new ObjectID(req.params.taskId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getTaskByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var editor_id = req.session.user._id;
    var query = {editor_id:editor_id};
    Task.count(query,function (err, count) {
        Task.getTasksByLimit(skip,req.params.pageLimit,query, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
    });
};

exports.getAllTasksByPage = function(req, res){
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Task.count({},function (err, count) {
        Task.getTasksByLimit(skip,req.params.pageLimit,{}, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
    });
};

exports.getMyToDoTasks = function(req,res){
    var userId = req.session.user._id;
    Task.getTasksByQuery({editor_id:userId,status:10},function(err,tasks){
        if(err)
            res.send({status:false,err:err});
        else{
            res.send({status:true,results:tasks});
        }
    });
};

exports.removeTask = function(req, res){
    Task.getTask(req.params.taskId, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
			if(result){
                Auditing.deleteByQuery({task_id:req.params.taskId},function(){
                    result.remove();
                    res.send({_id:req.params.taskId});
                });
			}else{
                res.send({_id:req.params.taskId});
            }
			
        }
    });
};

exports.addNewTask = function(req, res){
    var task = req.body;
    Task.newAndSave(task, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateTask = function(req, res){
    var json = req.body;
    Task.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

exports.statistic = function(req,res){
    var taskId = req.params.taskId;
    var ep = new EventProxy();
    ep.all('task','att_done', 'att_ask','res_done','res_ask','shop_done','shop_ask',
         function (task,att_done, att_ask,res_done,res_ask,shop_done,shop_ask) {
            res.send({status:true,
                task:task,
                att_done:att_done,
                att_ask:att_ask,
                res_done:res_done,
                res_ask:res_ask,
                shop_done:shop_done,
                shop_ask:shop_ask
            });
    });
    ep.bind('error', function (err) {
        ep.unbind();
        res.send({status:false,err:err});
    });
    Auditing.count({task_id:taskId,status:50,type:'0'},ep.done('att_done'));
    Auditing.count({task_id:taskId,status:{$in:[10,40]},type:'0'},ep.done('att_ask'));
    Auditing.count({task_id:taskId,status:50,type:'1'},ep.done('res_done'));
    Auditing.count({task_id:taskId,status:{$in:[10,40]},type:'1'},ep.done('res_ask'));
    Auditing.count({task_id:taskId,status:50,type:'2'},ep.done('shop_done'));
    Auditing.count({task_id:taskId,status:{$in:[10,40]},type:'2'},ep.done('shop_ask'));
    Task.getTask(taskId,ep.done('task'));
};

//-------------------------Auditing----------------------------
exports.getAuditing = function(req,res){
    Auditing.getAuditing(new ObjectID(req.params.taskId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getAuditingByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var editor_id = req.session.user._id;
    var query = {editor_id:editor_id};
    Auditing.count(query,function (err, count) {
        Auditing.getAuditingsByLimit(skip,req.params.pageLimit,query, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
    });
};

exports.getMyToDoAuditings = function(req,res){
    var userId = req.session.user._id;
    Auditing.getAuditingsByQuery({editor_id:userId,status:10},function(err,auditings){
        if(err)
            res.send({status:false,err:err});
        else{
            res.send({status:true,results:auditings});
        }
    });
};

exports.removeAuditing = function(req, res){
    Auditing.getAuditing(new ObjectID(req.params.auditingId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
            }
            res.send({_id:req.params.auditingId});
        }
    });
};

exports.addNewAuditing = function(req, res){
    var auditing = req.body;
    Auditing.newAndSave(auditing, function (err, result) {
        if (err) {
            res.send({isSuccess:false, info:err});
        } else {
            res.send({isSuccess:true, _id:result._id});
        }
    });
};

exports.updateAuditing = function(req, res){
    var json = req.body;
    Auditing.update(json,function(err,new_one){
        if (err) {
            res.send({err:err});
        } else {
            res.send({isSuccess:true});
        }
    });
};

exports.askApproval = function(req,res){
    var editor_id = req.session.user._id;
    var curr_user = req.session.user.username;
    if(editor_id){
        var auditingId = req.params.auditingId;
        Auditing.getAuditing(auditingId,function(err,one){
            if(one){
                if(one.editor_id.toString()==editor_id.toString()||curr_user=='admin'){
                    one.status = 10;
                    one.save(function(err){
                        if(err)
                            res.send({status:false,err:err});
                        else{
                            res.send({status:true,result:one});
                        }
                    });
                }else{
                    res.send({status:false,err:err+' or not found!'});
                }
            }else{
                res.send({status:false,err:err+' or not found!'});
            }
        });
    }else{
        res.send({status:false,err:'please login!'});
    }
};

exports.getApprovalAuditings = function(req,res){
    var query = {task_id:req.params.taskId,status:10};
    Auditing.getAuditingsByQuery(query,function(err,ones){
        if(err)
            res.send({status:false,err:err});
        else
            res.send({status:true,results:ones});
    });
};

exports.approvalAuditings = function(req,res){
    var pass = req.body.pass;
    var refuse = req.body.refuse;
    var taskId = req.body.taskId;

    var ep = new EventProxy();
    ep.all('pass','refuse',function (pass,refuse) {
        Task.updateFinishRate(taskId,function(err,task){
            res.send({status:true});
        });
    });
    ep.bind('error', function (err) {
        ep.unbind();
        res.send({status:false,err:err});
    });
    if(pass && pass.length>0){
        ep.after('savePass',pass.length,function(){
            ep.emit('pass');
        });
        for(var i=0;i<pass.length;i++){
            (function(k){
                //Auditing.updateStatus(pass[k],50,ep.done('savePass'));
                passAuditing(pass[k],ep.done('savePass'));
            })(i);
        }
    }
    else
        ep.emit('pass');

    if(refuse && refuse.length>0){
        ep.after('saveRefuse',refuse.length,function(){
            ep.emit('refuse');
        });
        for(var i=0;i<refuse.length;i++){
            (function(k){
                Auditing.updateStatus(refuse[k],40,ep.done('saveRefuse'));
            })(i);
        }
    }
    else
        ep.emit('refuse');

};

function passAuditing(_id,callback){
    Auditing.updateStatus(_id,50,function(err,one){
        if(one){
            if(one.type=='0'){
                Attraction.publishAttraction(one.item_id,callback);
            }else if(one.type=='1'){
                Life.publishRestaurant(one.item_id,callback);
            }else if(one.type == '2'){
                Life.publishShopping(one.item_id,callback);
            }else if(one.type == '3'){
                Life.publishEntertainment(one.item_id,callback);
            }else{
                callback('type is error');
            }
        }else{
            callback(err,one);
        }
    });
}

//-------------------------taskquestion----------------------------
exports.getTaskquestion = function(req,res){
    Taskquestion.getTaskquestion(new ObjectID(req.params.taskquestionId+''), function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            res.send(result);
        }
    });
};
exports.getTaskquestionByPage = function (req, res) {
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    var answer_id = req.session.user._id;
    var query = {answer_id:answer_id};
    Taskquestion.count(query,function (err, count) {
        Taskquestion.getTaskquestionsByLimit(skip,req.params.pageLimit,query, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
    });
};

exports.getAllTaskquestionsByPage = function(req, res){
    var skip = req.params.pageLimit * (req.params.pageIndex - 1);
    Taskquestion.count({},function (err, count) {
        Taskquestion.getTaskquestionsByLimit(skip,req.params.pageLimit,{}, function (err, result) {
            if (err) {
                res.send({status:false,err:err});
            } else {
                res.send({status:true,results:result, count:count});
            }
        });
    });
};

exports.getMyToDoTaskquestions = function(req,res){
    var userId = req.session.user._id;
    Taskquestion.getTaskquestionsByQuery({answer_id:userId,is_closed:false},function(err,taskquestions){
        if(err)
            res.send({status:false,err:err});
        else{
            res.send({status:true,results:taskquestions});
        }
    });
};

exports.removeTaskquestion = function(req, res){
    Taskquestion.getTaskquestion(req.params.taskquestionId, function (err, result) {
        if (err) {
            res.send({err:err});
        } else {
            if(result){
                result.remove();
                res.send({status:true,_id:req.params.taskquestionId});
            }else{
                res.send({status:false,_id:req.params.taskquestionId});
            }
            
        }
    });
};

exports.addNewTaskquestion = function(req, res){
    var taskquestion = req.body;
    Taskquestion.newAndSave(taskquestion, function (err, result) {
        if (err) {
            res.send({status:false, info:err});
        } else {
            res.send({status:true, _id:result._id});
        }
    });
};

exports.updateTaskquestion = function(req, res){
    var json = req.body;
    Taskquestion.update(json,function(err,new_one){
        if (err) {
            res.send({status:false,err:err});
        } else {
            res.send({status:true});
        }
    });
};

exports.closeTaskquestion = function(req, res){
    var taskquestionId = req.params.taskquestionId;
    Taskquestion.closeTaskquestion(taskquestionId,function(err,new_one){
        if (err) {
            res.send({status:false,err:err});
        } else {
            res.send({status:true});
        }
    });
};

