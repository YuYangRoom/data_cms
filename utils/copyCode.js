/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-8-25
 * Time: 下午12:17
 * To change this template use File | Settings | File Templates.
 */
var InviteCodeProvider = require("../config/InviteCodeProvider").InviteCodeProvider;
var inviteCodeProvider = new InviteCodeProvider();
var EmailProvider = require("../config/EmailProvider").EmailProvider;
var emailProvider = new EmailProvider();
var ObjectID = require('mongodb').ObjectID;

emailProvider.find({'email':{$exists:true},secondSend:0},{_id:1},function(err,result){
    if(err) throw err;
    if(result){
        console.log(result.length);
        copyCode(result,0,result.length,function(){
              process.exit(0);
        });
    }
});
function copyCode(emailArray,current,count,callback){
     if(current>=count){
         callback();
     }else{
         doCopy(emailArray[current]._id,function(){
             copyCode(emailArray,current+1,emailArray.length,callback);
         })
     }
}

function doCopy(currentEmail,callback){
    inviteCodeProvider.findOne({'useFlag':1},{},function(err1,result){
        emailProvider.update({_id:new ObjectID(currentEmail+'')},{$set:{'inviteCode':result.code}}, function (err2) {
            if(err2) throw err2;
            inviteCodeProvider.update({'_id':new ObjectID(result._id+'')},{$set:{'useFlag':0}},function(err2){
                if(err2) throw err2;
                callback();
            });
        });
    });
}