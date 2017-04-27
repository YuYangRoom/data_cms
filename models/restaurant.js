var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
 //餐馆
var RestaurantSchema = new Schema({
    name              : { type: String },
    poi_sortType      : { type: String },
    type              : { type: String,default:'1'},
    city_name         : { type: String },
    city_id           : { type: ObjectId ,index: true },
    latitude          : { type: String },
    longitude         : { type: String },
    loc                : { type: Array},
    address           : { type: String },
    place_id           : { type: String },
    postal_code       : { type: String },
    brief_introduce   :{type:String},
    introduce         : { type: String },  // summary/description of restaurant
    tel               : { type: String },
    category          : { type: Array },
    //categories          :{type : Array},
    lifetag           : { type: Array },
    //tags              : { type: Array , default: []}, // 4 available tags : 'michilin', 'bestfordinner', 'popular', 'localflag'.   e.g.  ['michilin', 'popular']
    //tags_zh           : { type: Array , default: []},
    tags              : { type: Array},
    periods              : { type: Array},
    tags_zh           : { type: Array },
    open_time         : { type: Array },
    image             : { type: Array },
    cover_image       : { type: String },
    show_flag         : { type: Boolean,default:false},
    create_at         : { type: Date, default: Date.now },
    recommand_flag    : { type: Boolean, default:false },
    recommand_duration: { type: String },
    // local_flag        : { type: Boolean, default:false },
    // best_dinnerchoics : { type: Boolean },
    // michilin_flag     : { type: Boolean },
    // most_popular      : { type: Boolean },
    ranking           : { type: Number },
    area_id           : { type: ObjectId},
    area_name         : { type: String},
    rating            : { type: Number ,default: 3},
    ranking            : { type: Number ,default: 3},
    rating_service    : { type: Number ,default: 3},
    rating_env        : { type: Number ,default: 3},
    rating_food       : { type: Number ,default: 3},
    score             : { type: Number ,default: 60},
    reviews           : { type: Number ,default: 0},
    comments          : { type: Array },
    menu              : [{
        cover_image     : String,
        desc            : String,
        advice          : String
    }],
    comments_top      : { type: Array },
    restags      : { type: Array },
    comments_from     : {type: String},
    comments_url      : {type: String},
    openTable_url      : {type: String},
    price_level       : { type: Number ,default: 3},
    price_desc        : { type: String ,default: '一般'},
    website           : { type: String },
    url               : { type: String },
    tips              : { type: String },  // another summary/description of restaurant
    index_flag        : { type: Boolean },
    am                : { type: Boolean },
    pm                : { type: Boolean },
    ev                : { type: Boolean }, //evening
    info: {              
        wifi          : { type: Boolean ,default: false},
        yu_ding       : { type: Boolean,default:false},
        delivery      : { type: Boolean,default:false},
        take_out      : { type: Boolean,default:false},
        card          : { type: Boolean,default:false},
        g_for         : { type: String },
        g_f_kid       : { type: Boolean,default:false},
        g_f_group     : { type: Boolean,default:false},
        noise         : { type: String },
        alcohol       : { type: String },
        out_seat      : { type: Boolean,default:false},
        tv            : { type: Boolean,default:false},
        waiter        : { type: Boolean,default:false}
    },
    status             : String,
    editorname         : String,
    editdate           : String,
    auditorname        : String,
    auditdate          : String,
    en_info: {
        introduce      : String,
        tips           : String,
        comments       : String,
        status         : String,
        editorname     : String,
        editdate       : String,
        auditorname    : String,
        auditdate      : String
    }
});

/**
 * Validations
 * 
 */
/*用于验证是否有效
RestaurantSchema.path('tags').validate(function (val) {
    if (val) return val.length <= 4 && val.every(function (tag) {
        return ['michilin', 'bestfordinner', 'popular', 'localflag'].indexOf(tag) >= 0;
    });
}, 'at most 4 tags are allowed and must be picked from restricted set'); */


/**
 * Static methods
 * 
 */
RestaurantSchema.statics = {

    /**
     * find recommended Restaurants.
     * ```
     * Restaurant.listRecommends(function (err, arr) {}); // no parameter , default settings
     *     
     * Restaurant.listRecommends({limit : 5, offset : 2}, function (err, arr) {});
     * ```
     * @param {Function} cb - callback (err, result)
     * @param {Any} opt - optional options
     */
    listRecommends : function (opt, cb) {
        var criteria = {show_flag: true};
            // order    = {coverImageId: 1, coverImageExtention: 1}; //TODO order recommends by what ?

        if (!cb && opt instanceof Function) {
            cb = opt;
        }

        this.find(criteria)
            .skip(opt.offset || 0)
            .limit(opt.limit || global.recommendLimit || 10)
            .exec(cb);
    },

    /**
     * find restaurants in a city
     * ```
     * Restaurant.listByCity({city_id : 123, limit : 10, offset: 0}, function (err, arr) {});
     * // criteria : mongodb standard query object
     * Restaurant.listByCity({criteria : {city_id : 123}, limit : 10, offset: 0}, function (err, arr) {});
     * ```
     * @param {Object}   opt - options
     * @param {Function} cb  - callback (err, arr)
     */
    listByCity : function (opt, cb) {

        var c = opt.criteria || {};
        c.city_id = c.city_id || opt.city_id;
        if (opt.tags) {
            c.tags = {$all : tags};
        }

        this.find(c)
            .skip(opt.offset || 0)
            .limit(opt.limit || 10)
            .exec(cb);
    },

    load : function (id, cb) {
        this.findOne({_id : id})
            .exec(cb);
    }
};

/**
 * Instance methods
 */
RestaurantSchema.methods = {

    addTag : function (tag, cb) {
        if (!this.tags) this.tags = [];
        var that = this,
            arr  = tag instanceof Array ? tag : [tag];
        arr.forEach(function (t) {
            that.tags.indexOf(t) < 0 && that.tags.push(t);
        });
        
        that.save(cb);
    },

    removeTag : function (tag, cb) {
        if (!this.tags) this.tags = [];

        var that = this,
            arr = tag instanceof Array ? tag : [tag];
        arr.forEach(function (t) {
            var idx = that.tags.indexOf(t);
            idx >= 0 && that.tags.splice(idx, 1);
        });

        that.save(cb);
    }
};

mongoose.model('Restaurant', RestaurantSchema);

