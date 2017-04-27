
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var AttractionSchema = new Schema({
    attractions_sortType            : String,
    address            : String,
    activity           : String,
    place_id           : String,
    am                 : Boolean,
    pm                 : Boolean,
    ev                 : Boolean, //evening
    attractions        : String,
    attractions_en     : String,
    checkFlag          : String,
    cityid             : String,
    city_id            : ObjectId,
    cityname           : String,
    coverImageName     : String,
    createFlag         : String,  // who create it ?   0 : administrator(weego) , 1 : editor
    createPreson       : String,
    created            : {type : Date, default : Date.now},
    dayornight         : String,
    image              : Array,
    periods            : Array,
    comments_from     : {type: String},
    comments           : Array,
    activities       : { type: Array },
    //comments_from     : {type: String},
    imgFlag            : Boolean,
    introduce          : String,
    comments_url       : String,
    latitude           : String,
    likecount          : Number,
    longitude          : String,
    loc                  :Array,
    masterLabel        : String,
    opentime           : Array,
    open_time           : Array,
    masterLabelNew     : Array,
    price              : String,
    random             : String,  // ? ? ? ?
    recommand_duration : String,
    recommand_reason : String,
    recommand_flag     : String,  // 1 : recommended as 'hot' , 0 : else
    short_introduce    : String,
    show_flag          : Number,  //whethere it is visible to end user
    subLabel           : Array,
    spot               : Array,
    telno              : String,
    website            : String,
    traffic_info       : String,
    yelp_rating        : Number,
    yelp_review_count  : Number,
    yelp_update_time   : Number,
    status             : String,
    editorname         : String,
    editdate           : String,
    auditorname        : String,
    auditdate          : String,
    en_info: {
        opentime       : String,
        traffic_info   : String,
        short_introduce: String,
        introduce      : String,
        tips           : String
    }
}, {
    collection : 'latestattractions'
});
/**@namespace*/
AttractionSchema.statics = {
    /**
     * find recommended Attractions.
     * ```
     * Attraction.listRecommends(function (err, arr) {});
     *     
     * Attraction.listRecommends({limit : 5, offset : 2}, function (err, arr) {});
     * ```
     * @param {Function} cb - callback (err, result)
     * @param {Any} opt - optional options
     */
    listRecommends : function (opt, cb) {
        var criteria = {createFlag: '0', show_flag: '1'};
            // order    = {attractions: 1, coverImageId: 1, coverImageExtention: 1}; //TODO order recommends by what ?

        if (!cb && opt instanceof Function) {
            cb = opt;
        }
        this.find(criteria)
            .skip(opt.offset || 0)
            .limit(opt.limit || global.recommendLimit || 10)
            .exec(cb);
    }
};

mongoose.model('Attraction', AttractionSchema);
