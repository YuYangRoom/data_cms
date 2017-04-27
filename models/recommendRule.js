var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
//城市推荐时间分段表
var RecommendRuleSchema = new Schema({
    isValid:Boolean,//规则是否有效
    city: {
        _id: String,
        cityname: String
    },//城市
    type:String,//1:时间推送、2：是地理位置推送
    title:String,//规则名称
    desc:String,//规则描述
    longitude:String,//经度
    latitude:String,//维度
    range:String,//推送范围
    recom_content:Array,//推送内容,type,id,title,recom_title,recom_desc
    //以下字段只有时间规则才有用
    startDate:String,//开始日期
    endDate:String,//结束日期
    week:Array,//周一至周日、全周
    time_rules:Array,//适合的时间规则
    //week使用
    one:Boolean,
    two:Boolean,
    three:Boolean,
    four:Boolean,
    five:Boolean,
    six:Boolean,
    seven:Boolean,
    eight:Boolean
}, {
    collection: 'recommendRules'
});

mongoose.model('RecommendRule', RecommendRuleSchema);
