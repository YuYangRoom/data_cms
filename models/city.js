var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var CitySchema = new Schema({
    backgroundimage     : Array,
    timezone     : {},
    cityname            : String,
    city_rank            : String,//城市排名字段
    imgforapp            : String,
    cityname_en         : String,
    cityname_py         : String,
    continents          : String,
    countryname         : String,
    coverImageName      : String,
    createFlag          : String,
    created             : Number,
    hot_flag            : String,
    image               : Array,
    imgFlag             : Boolean,
    timezone             : {},
    introduce           : [{
        intrItemTitle   : String, 
        intrItemContent : String
    }],                         
    latitude            : String,
    likecount           : Number,
    longitude           : String,
    masterLabel         : String,
    recommand_day       : String,
    recommand_intensity : String,
    short_introduce     : String,
    show_flag           : String,
    subLabel            : Array,
    activity_labels     : Array,
    shoplabels          : Array,
    reslabels           : Array,
    attrlabels           : Array,
    labels           : Array,
    tips                : [{
        tipItemTitle    : String,
        tipItemContent  : String
    }],                      
    traffic             : [{
        traItemTitle    : String,
        traItemContent  : String
    }],                      
    continentscode      : String,
    countrycode         : String,
    recommand_center    : {
        name            : String,
        latitude        : String,
        longitude       : String,
        _id             : String
    },
    restaurant_overview : String, // overview of restaurants in city
    shopping_overview   : String, // overview of shoppings in city
    attraction_overview : String, // overview of attractions in city
    weoid               : String, //yahoo weather api ID
    status              : String,
    attractionscount    : String,
    restaurantscount    : String,
    shopareacount       : String,
    shoppingscount      : String,
    editorname          : String,
    editdate            : String,
    auditorname         : String,
    auditdate           : String,
    en_info: {
        short_introduce: String,
        attraction_overview: String,
        restaurant_overview: String,
        shopping_overview: String,
        introduce      : [{
            intrItemTitle   : String, 
            intrItemContent : String
        }],
        tips                : [{
            tipItemTitle    : String,
            tipItemContent  : String
        }],
        traffic             : [{
            traItemTitle    : String,
            traItemContent  : String
        }],
        status         : String,
        editorname     : String,
        editdate       : String,
        auditorname    : String,
        auditdate      : String
    }

}, {
    collection : 'latestcity'
});

CitySchema.statics = {

    load : function (id, cb) {
        this.findOne({_id: id})
            .exec(cb);
    }
}

CitySchema.methods = {

    /**
     * find restaurants in **this** city
     * city_id is automatically set : `opt.city_id = this.city_id`
     * 
     */
    listRestaurants : function (opt, cb) {
        opt.city_id = this.city_id;
        mongoose.model('Restaurant').listByCity(opt, cb);
    },


}

mongoose.model('City', CitySchema);
