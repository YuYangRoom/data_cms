/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-8-22
 * Time: 下午8:00
 * To change this template use File | Settings | File Templates.
 */
var crypto = require('crypto');
var InviteCodeProvider = require("../config/InviteCodeProvider").InviteCodeProvider;
var inviteCodeProvider = new InviteCodeProvider();
var i=0;

generate(0,2000,function(){
    process.exit(0);
});
function generate(current,sumno,callback){
    if(current>=sumno){
      callback();
    }else{
        doGenarate(current,function(nextNo){
            generate(nextNo,sumno,callback);
        })
    }
}

function doGenarate(current,callback){
    crypto.randomBytes(3, function(ex, buf) {
        var token = buf.toString('hex');
//        console.log(token);
        inviteCodeProvider.insert({'code':token},{},function(err,result){
            if(err) throw err;
            callback(current+1);
        });
    });
}




