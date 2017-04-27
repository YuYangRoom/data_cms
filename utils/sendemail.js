/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-2-25
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
 */
var EmailProvider = require("../config/EmailProvider").EmailProvider;
var emailProvider = new EmailProvider();
var ObjectID = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');
fs = require('fs');
var ejs = require('ejs')



emailProvider.find({'firstSend':0,inviteCode:{$exists:true}},{'email':1,'inviteCode':1},function (err, docs){
    if(err){
        console.log(err);
    }else{
        startTasks(docs,0,docs.length);
    }

});

function startTasks(paramsArray,current,count){
    if(current>=count){
        process.exit(0);
    }else{
        inviteEmail(paramsArray, current,function(next) {
            startTasks(paramsArray, next, count);
        });
    }
}


function inviteEmail(paramsArray, current, taskCallback) {
    var item = paramsArray[current];
    var emailaddress = item.email;
    var inviteCode = item.inviteCode;
    var objectid= item._id;
    console.log(objectid);
    var transport = nodemailer.createTransport("SMTP", {
        host:"smtpout.secureserver.net",
        port:25,
        auth:{
            user:"support@weego.me",
            pass:"Weego201313"
        }
    });

    var mailOptions = {
        from:"Weego Team<support@weego.me>", // sender address
        to:emailaddress, // list of receivers
        subject:"欢迎来到 Weego，请点击链接完成注册", // Subject line
        text:"欢迎来到 Weego，请点击链接完成注册", // plaintext body
        generateTextFromHTML:true,
        html:ejs.render(fs.readFileSync(__dirname + '/../template/invite_email.html', 'utf8'), {email:emailaddress,code:inviteCode})
    }
    transport.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        emailProvider.update({_id:new ObjectID(objectid.toString())},{$set: {'firstSend':1,'secondSend':1}},{safe:true}, function (err, doc){
            if(err){
                console.log(err);
            }else{
                taskCallback(current+1);
            }
        });
    });

};


