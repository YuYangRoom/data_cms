/**
 * User: lb
 */

//---------------------------------model and collection-------------------------------------------------

var RestaurantModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/restaurant'
});
var ShoppingModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/shopping'
});
var EntertainmentModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/entertainment'
});
var LifeCollection = Backbone.Collection.extend({
    url: '/restaurants/' + this.pageLimit + '/' + this.currentPage,
    baseUrl: '/restaurants/',
    model: RestaurantModel,
    currentPage: 1,
    pageLimit: 10,
    query: '',
    type: '1',
    initialize: function (data) {
        //console.log(data);
        var type = '1';
        if (data && data.type)
            type = data.type;
        if (data.cityname) {
            this.query += "cityname=" + data.cityname + "&";
        }
        if (data.areaname) {
            this.query += "areaname=" + data.areaname + "&";
        }
        if (data.lifename) {
            this.query += "lifename=" + data.lifename + "&";
        }
        if (data.tags) {
            this.query += data.tags;
        }
        // if(data.isMostPopular){
        //      this.query += "most_popular="+data.isMostPopular+"&";
        // }
        // if(data.isBestDinnerchoics){
        //      this.query += "best_dinnerchoics="+data.isBestDinnerchoics+"&";
        // }
        // if(data.isMichilinFlag){
        //      this.query += "michilin_flag="+data.isMichilinFlag+"&";
        // }
        // if(data.isLocalFlag){
        //     this.query += "local_flag="+data.isLocalFlag+"&";
        // }

        if (type == '1') {
            this.type = '1';
            this.model = RestaurantModel;
            this.baseUrl = '/restaurants/';
        } else if (type == '2') {
            this.type = '2';
            this.model = ShoppingModel;
            this.baseUrl = '/shoppings/';
        } else {
            this.type = '3';
            this.model = EntertainmentModel;
            this.baseUrl = '/entertainments/';
        }
        //后台url
        this.url = this.baseUrl + this.pageLimit + '/' + this.currentPage + '?' + this.query;
    },
    parse: function (response) {
        this.total = response.count;
        return response.results;
    },
    hasPage: function (page) {
        if (((page * this.pageLimit) - this.total) > this.pageLimit)
            return false;
        if (page == 0)
            return false;
        return true;
    },
    getByPage: function (limit, pageIndex, successCallback) {
        this.url = this.baseUrl + limit + '/' + pageIndex + '?' + this.query;
        this.fetch({success: successCallback});
    },
    getFirstPage: function (callback) {
        this.getByPage(this.pageLimit, 1, callback);
    },
    getNextPage: function (successCallback) {
        if (!this.hasPage(this.currentPage + 1))
            return;
        this.getByPage(this.pageLimit, ++this.currentPage, successCallback);
    },
    getPrevPage: function (successCallback) {
        if (!this.hasPage(this.currentPage - 1))
            return;
        this.getByPage(this.pageLimit, --this.currentPage, successCallback);
    },
    getPage: function (page, successCallback) {
        this.currentPage = page;
        this.getByPage(this.pageLimit, this.currentPage, successCallback);
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var LifeView = Backbone.View.extend({
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#lifeDetailView').html());

    },
    events: {
        'change #property-type': 'selectType',
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'change #area_select': 'selectArea',
        'change #big_select': 'selectBigShopping',
        'click #is_big': 'checkBig',
        'click review': 'review',
        'click #save': 'saveLife',
        'click #top_save': 'saveLife',
        'click #cancel': 'back',
        'click #back': 'back',
        'focus #addCategoryValue': 'autogetCategory',
        'click #addCategoryValue': 'autogetCategory',
        'click #addCategory': 'addCategory',
        'focus #addLifetagValue': 'autogetLifetag',
        'focus #addBrandtagValue': 'autogetBrandtag',
        'focus #addNews_cmstagValue': 'autogetNews_cmstag',
        'focus #addActivitytagValue': 'autogetActivitytag',
        'focus #addShoptagValue': 'autogetShoptag',
        'focus #addRestagValue': 'autogetRestag',
        'click #addBrandtag': 'addBrandtag',
        'click #addNews_cmstag': 'addNews_cmstag',
        'click #addActivitytag': 'addActivitytag',
        'click #addShoptag': 'addShoptag',
        'click #addRestag': 'addRestag',
        'click #addLifetag': 'addLifetag',
        'click #addOpentime': 'addOpentime',
        'click .del': 'dellabel',
        'click #addComment': 'addComment',
        'click .li-del': 'delLi',
        'click #allday': 'selectAllDay',
        'click .tagsbtn': 'choosetag'
    },
    choosetag: function (e) {
        $el = $(e.currentTarget);
        var flag = $el.hasClass('active');
        if (flag) {
            $el.removeClass('active');
        } else {
            $el.addClass('active');
        }
    },
    render: function () {
        if (weego_user.globalUser.type == 1) {
            this.model.set('_show_flag', true);
        } else {
            this.model.set('_show_flag', false);
        }

        this.model.set('user', weego_user.globalUser);
        this.$el.html(this.template(this.model.toJSON()));
        this.initSelect();
        return this;
    },
    initSelect: function () {
        var cityid = this.model.get('city_id');
        var in_big_id = this.model.get('in_big_id');
        var is_big = this.model.get('is_big');
        var area_id = this.model.get('area_id');
        if (cityid) {
            $.ajax({
                url: "/getAreasByCityId/" + cityid,
                success: function (data) {
                    if (data.status) {
                        var areas = data.results;
                        var option = '';
                        for (var i = 0; i < areas.length; i++) {
                            var area = areas[i];
                            var selected = "";
                            if (area_id && area._id.toString() == (area_id + ''))
                                selected = "selected";
                            option += '<option value="' + area._id + '" ' + selected + '>' + area.name + '</option>';
                        }
                        $('#area_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });

            $.ajax({
                url: "/getBigShoppingByCityId/" + cityid,
                success: function (data) {
                    if (data.status) {
                        var bigShoppings = data.results;
                        var option = '';
                        for (var i = 0; i < bigShoppings.length; i++) {
                            var big = bigShoppings[i];
                            var selected = "";
                            if (!is_big && in_big_id && big._id.toString() == (in_big_id + ''))
                                selected = "selected";
                            option += '<option value="' + big._id + '" ' + selected + '>' + big.name + '</option>';
                        }
                        $('#big_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });
        }

        $.ajax({
            url: "/getMyToDoTasks",
            success: function (data) {
                if (data.status) {
                    var results = data.results;
                    var option = '';
                    for (var i = 0; i < results.length; i++) {
                        var one = results[i];
                        option += '<option value="' + one._id + '" >' + one.name + '</option>';
                    }
                    $('#task_select').html(option);
                } else {
                    alert('数据库异常！');
                }
            }
        });
    },
    selectAllDay: function (e) {
        e.preventDefault();
        $('#am').attr('checked', 'checked');
        $('#pm').attr('checked', 'checked');
        $('#ev').attr('checked', 'checked');
    },
    selectType: function () {
        var type = $('#property-type').val();
        if (type == '1') {
            $('.services').css('display', 'block');
            $('#big-shopping-show').css('display', 'none');
            $('#belong-to-shopping-show').css('display', 'none');
            $('#rating_food_trust_span').css('display', 'block');
        }
        else if (type == '2') {
            $('.services').css('display', 'none');
            $('#big-shopping-show').css('display', 'block');
            $('#belong-to-shopping-show').css('display', 'block');
            $('#rating_food_trust_span').css('display', 'block');
        } else {
            $('.services').css('display', 'none');
            $('#big-shopping-show').css('display', 'none');
            $('#belong-to-shopping-show').css('display', 'none');
            $('#rating_food_trust_span').css('display', 'none');
        }

    },
    selectContinent: function () {
        var continentCode = $("#continents_select").val();
        $.ajax({
            url: "/getCountriesByContinent/" + continentCode,
            success: function (data) {
                if (data.status) {
                    //console.log(data);
                    var countries = data.countries;
                    var option = '';
                    for (var i = 0; i < countries.length; i++) {
                        var country = countries[i];
                        option += '<option value="' + country.code + '">' + country.cn_name + '</option>';
                    }
                    $('#country_select').html(option);
                } else {
                    alert('数据库异常！');
                }
            }

        });
    },
    selectCountry: function () {
        //console.log('selectCountry');
        var countryCode = $("#country_select").val();
        $.ajax({
            url: "/getCityByCountry/" + countryCode,
            success: function (data) {
                if (data.status) {
                    //console.log(data);
                    var cities = data.cities;
                    var option = '<option value=""></option>';
                    for (var i = 0; i < cities.length; i++) {
                        var city = cities[i];
                        option += '<option value="' + city._id + '">' + city.cityname + '</option>';
                    }
                    $('#city_select').html(option);
                } else {
                    alert('数据库异常！');
                }
            }
        });
    },
    selectCity: function () {
        var cityname = $("#city_select").find("option:selected").text();
        var cityid = $("#city_select").val();
        $("#city").val(cityname);
        if (cityid != '') {
            $.ajax({
                url: "/getAreasByCityId/" + cityid,
                success: function (data) {
                    //console.log(data);
                    if (data.status) {
                        var areas = data.results;
                        var option = '';
                        for (var i = 0; i < areas.length; i++) {
                            var area = areas[i];
                            option += '<option value="' + area._id + '">' + area.area_name + '</option>';
                        }
                        $('#area_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });

            $.ajax({
                url: "/getBigShoppingByCityId/" + cityid,
                success: function (data) {
                    if (data.status) {
                        var bigShoppings = data.results;
                        var option = '';
                        for (var i = 0; i < bigShoppings.length; i++) {
                            var big = bigShoppings[i];
                            option += '<option value="' + big._id + '">' + big.name + '</option>';
                        }
                        $('#big_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });
        }
    },
    selectArea: function () {
        var areaname = $("#area_select").find("option:selected").text();
        $("#area_name").val(areaname);
    },
    selectBigShopping: function () {
        var name = $("#big_select").find("option:selected").text();
        $("#in_big_name").val(name);
    },

    checkBig: function () {
        var is_big = $('#is_big').prop('checked');
        if (is_big) {
            $('#belong-to-shopping-show').css('display', 'none');
        } else {
            $('#belong-to-shopping-show').css('display', 'block');
        }
    },
    autogetCategory: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        var name = $('#addCategoryValue').val();
        //console.log(type, name);
        $("#addCategoryValue").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/getCategorysByQuery/" + type + "/" + $('#addCategoryValue').val(),
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        //console.log(data);
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.name,
                                        value: item.name,
                                        _id: item._id
                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addCategoryValue").attr('value', ui.item.label);
                $("#addCategoryValue").attr('data-value', ui.item._id);
            }
        });
    },
    addCategory: function () {
        var itemName = $('#addCategoryValue').val();
        var itemId = $('#addCategoryValue').attr('data-value');
        if (itemId && itemName) {
            var $newitem = $('<li><input class="input-xlarge focused categorys" readonly style="width:100px" name="categorys" ' +
                'type="text" value="' + itemName + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#category-list').last().after($newitem);
        } else {
            alert('请不要手动输入！');
        }

    },
    addOpentime: function () {
        var open_day = $('#open-day').val();
        var open_time_begin = $('#open-time-begin').val();
        var open_time_end = $('#open-time-end').val();
        // if(open_time_begin!='allday' && open_time_begin!='close' &&
        //     open_time_end!='allday' && open_time_end!='close' &&
        //     open_time_end < open_time_begin){
        //     alert('请正确选择！');
        //     return false;
        // }
        var open_time = {
            desc: $('#open-day').find("option:selected").text() + ' ' + this.getOpenTimeDesc(),
            value: open_day + '-' + open_time_begin + '-' + open_time_end
        };
        var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" ' +
            'type="text" value="' + open_time.desc + '" data-value="' + open_time.value + '"> <input type="button" value="删除" class="li-del"><li>');
        $('#opentime-list').last().after($newitem);
    },
    dellabel: function (e) {
        $(e.target).parents('.comments-group').remove();//评论标签的删除
    },
    addComment: function () {//增加餐厅comments_top
        //alert('Table2');
        var $newlabel = $('<div class="control-group comments-group"><label class="control-label"  for="label2"><font  color="green">新增评论</font></label><div class="controls">' +
            'title:<input class="input-xlarge focused " style="width: 8%" name="title" type="text"  >' +
            '&nbsp;rating:&nbsp;<input class="input-xlarge focused " style="width: 8px" name="rating" maxlength="1" type="text" >' +
            '&nbsp; text: <textarea class="input-xlarge focused comments" name="text"  style="width:30%" ></textarea>' +
            '&nbsp;nickname:&nbsp;<input class="input-xlarge focused " name="nickname" style="width: 6%" type="text"   >' +
            ' date:&nbsp;<input class="input-xlarge focused " name="date" style="width:8%" type="text" onfocus="setday(this)"  readonly="readonly"  >' +
            '<input type="button" value="删除" class="recdel"></div></div>');
        $('.comments-group').last().after($newlabel);

    },
    getOpenTimeDesc: function () {
        var open_time_begin = $('#open-time-begin').val();
        var open_time_end = $('#open-time-end').val();
        if (open_time_begin == 'allday' || open_time_end == 'allday')
            return '全天';
        else if (open_time_begin == 'close' || open_time_end == 'close')
            return '关门';
        else
            return $('#open-time-begin').find("option:selected").text() + '-' + $('#open-time-end').find("option:selected").text();
    },
    autogetBrandtag: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        var key = $('#addBrandtagValue').val();
        if (key == "")key = "all";
        $("#addBrandtagValue").autocomplete({
            source: function (request, response) {
                key = $('#addBrandtagValue').val();
                if (key == "")key = "all";
                $.ajax({
                    url: "/getBrandtagsByType/" + type + "/" + key,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.title,
                                        value: item.title,
                                        _id: item._id,
                                        cover_image: item.cover_image,
                                        desc: item.desc
                                    }
                                }));
                    }
                });
            },

            select: function (event, ui) {
                $("#addBrandtagValue").attr('value', ui.item.label);
                $("#addBrandtagValue").attr('data-value', ui.item._id);
                $("#addBrandtagValue").attr('data-value1', ui.item.cover_image);
                $("#addBrandtagValue").attr('data-value2', ui.item.desc);
            }
        });
    },
    autogetNews_cmstag: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        var key = $('#addNews_cmstagValue').val();
        if (key == "")key = "all";
        $("#addNews_cmstagValue").autocomplete({
            source: function (request, response) {
                key = $('#addNews_cmstagValue').val();
                if (key == "")key = "all";
                $.ajax({
                    url: "/getNews_cmstagsByType/" + type + "/" + key,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.title,
                                        value: item.title,
                                        _id: item._id,
                                        cover_image: item.cover_image,
                                        desc: item.desc
                                    }
                                }));
                    }
                });
            },

            select: function (event, ui) {
                $("#addNews_cmstagValue").attr('value', ui.item.label);
                $("#addNews_cmstagValue").attr('data-value', ui.item._id);
                $("#addNews_cmstagValue").attr('data-value1', ui.item.cover_image);
                $("#addNews_cmstagValue").attr('data-value2', ui.item.desc);
            }
        });
    },
    autogetActivitytag: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        var key = $('#addActivitytagValue').val();
        if (key == "")key = "all";
        $("#addActivitytagValue").autocomplete({
            source: function (request, response) {
                key = $('#addActivitytagValue').val();
                if (key == "")key = "all";
                $.ajax({
                    url: "/getActivitytagsByType/" + type + "/" + key,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.title,
                                        value: item.title,
                                        _id: item._id,
                                        cover_image: item.cover_image,
                                        desc: item.desc
                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addActivitytagValue").attr('value', ui.item.label);
                $("#addActivitytagValue").attr('data-value', ui.item._id);
                $("#addActivitytagValue").attr('data-value1', ui.item.cover_image);
                $("#addActivitytagValue").attr('data-value2', ui.item.desc);
            }
        });

    },
    autogetShoptag: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        var key = $('#addShoptagValue').val();

        $("#addShoptagValue").autocomplete({
            source: function (request, response) {
                key = $('#addShoptagValue').val();
                $.ajax({
                    url: "/getShoptagsByType/" + 3 + "/" + key,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.name,
                                        value: item.name,
                                        _id: item._id,
                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addShoptagValue").attr('value', ui.item.label);
                $("#addShoptagValue").attr('data-value', ui.item._id);
            }
        });

    },
    autogetRestag: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        var key = $('#addRestagValue').val();

        $("#addRestagValue").autocomplete({
            source: function (request, response) {
                key = $('#addRestagValue').val();
                $.ajax({
                    url: "/getRestagsByType/" + 4 + "/" + key,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.name,
                                        value: item.name,
                                        _id: item._id,
                                        en_name: item.en_name
                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addRestagValue").attr('value', ui.item.label);
                $("#addRestagValue").attr('data-value', ui.item._id);
                $("#addRestagValue").attr('data-enname', ui.item.en_name);
            }
        });

    },
    autogetLifetag: function (e) {
        var _this = this;
        var type = $('#property-type').val();
        $("#addLifetagValue").autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "/getLifetagsByType/" + type,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.name,
                                        value: item.name,
                                        _id: item._id
                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addLifetagValue").attr('value', ui.item.label);
                $("#addLifetagValue").attr('data-value', ui.item._id);
            }
        });
    },
    addBrandtag: function () {
        var label = $('#addBrandtagValue').val();
        var itemId = $('#addBrandtagValue').attr('data-value');
        var cover_image = $('#addBrandtagValue').attr('data-value1');
        var desc = $('#addBrandtagValue').attr('data-value2');
        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused brandtags" readonly style="width:100px" name="Brandtags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '" data-value1="' + cover_image + '" data-value2="' + desc + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#brandtag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
    },
    addNews_cmstag: function () {
        var label = $('#addNews_cmstagValue').val();
        var itemId = $('#addNews_cmstagValue').attr('data-value');
        var cover_image = $('#addNews_cmstagValue').attr('data-value1');
        var desc = $('#addNews_cmstagValue').attr('data-value2');
        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused news_cmstags" readonly style="width:100px" name="News_cmstags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '" data-value1="' + cover_image + '" data-value2="' + desc + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#news_cmstag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
    },
    addActivitytag: function () {
        var label = $('#addActivitytagValue').val();
        var itemId = $('#addActivitytagValue').attr('data-value');
        var cover_image = $('#addActivitytagValue').attr('data-value1');
        var desc = $('#addActivitytagValue').attr('data-value2');
        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused activitytags" readonly style="width:100px" name="Activitytags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '" data-value1="' + cover_image + '" data-value2="' + desc + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#activitytag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
    },
    addShoptag: function () {
        var label = $('#addShoptagValue').val();
        var itemId = $('#addShoptagValue').attr('data-value');
        var cover_image = $('#addShoptagValue').attr('data-value1');
        var desc = $('#addShoptagValue').attr('data-value2');
        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused shoptags" readonly style="width:100px" name="Shoptags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '" > <input type="button" value="删除" class="li-del"><li>');
            $('#shoptag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
    },
    addRestag: function () {
        var label = $('#addRestagValue').val();
        var itemId = $('#addRestagValue').attr('data-value');
        //var cover_image = $('#addRestagValue').attr('data-value1');
        //var desc = $('#addRestagValue').attr('data-value2');
        var en_name = $('#addRestagValue').attr('data-enname');
        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused restags" readonly style="width:100px" name="Restags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '" data-enname="' + en_name + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#restag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
    },
    addLifetag: function () {
        var itemName = $('#addLifetagValue').val();
        var itemId = $('#addLifetagValue').attr('data-value');
        if (itemId && itemName) {
            var $newitem = $('<li><input class="input-xlarge focused lifetags" readonly style="width:100px" name="lifetags" ' +
                'type="text" value="' + itemName + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#lifetag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }

    },
    review: function () {

    },
    delLi: function (e) {
        $(e.target).parent().remove();
    },
    back: function (e) {
        e.preventDefault();
        window.history.back();
    },
    getTextInputValue: function (id) {
        return this.$el.find('#' + id).val();
    },
    saveLife: function (e) {
        //alert('Hello World!');
        e.preventDefault();
        var type = $('#property-type').val();
        var categorys = [];
        //var categories = [];
        for (var i = 0; i < $('.categorys').length; i++) {
            var item = {};
            item._id = $('.categorys').eq(i).attr('data-value');
            item.name = $('.categorys').eq(i).attr('value');
            //categories.push(item._id);
            categorys.push(item);
        }
        var lifetags = [];
        for (var i = 0; i < $('.lifetags').length; i++) {
            var item = {};
            item._id = $('.lifetags').eq(i).attr('data-value');
            item.name = $('.lifetags').eq(i).attr('value');
            lifetags.push(item);
        }
        var brandtags1 = [];
        for (var i = 0; i < $('.brandtags').length; i++) {
            var item = {};
            item._id = $('.brandtags').eq(i).attr('data-value');

            item.title = $('.brandtags').eq(i).attr('value');
            item.cover_image = $('.brandtags').eq(i).attr('data-value1');
            item.desc = $('.brandtags').eq(i).attr('data-value2');
            //alert( item._id+'##'+item.title +'##'+item.cover_image+'###'+item.desc);
            brandtags1.push(item);
        }
        var activities1 = [];
        for (var i = 0; i < $('.activitytags').length; i++) {
            var item = {};
            item._id = $('.activitytags').eq(i).attr('data-value');
            item.title = $('.activitytags').eq(i).attr('value');
            activities1.push(item);
        }
        var shops1 = [];
        for (var i = 0; i < $('.shoptags').length; i++) {
            var item = {};
            item._id = $('.shoptags').eq(i).attr('data-value');
            item.title = $('.shoptags').eq(i).attr('value');
            //alert(  item._id+'###'+item.title);
            shops1.push(item);
        }
        /*
         * 餐厅一级标签
         * */
        var tagsElements = $('.tagsbtn.active');
        var tags_zh = [];
        var tags = [];
        for (var i = 0; i < tagsElements.length; i++) {
            var aTag = tagsElements.eq(i).attr('data-value');
           tags.push(tagsElements.eq(i).attr('data-value'));
            if (aTag == 'localflag') {
                tags_zh.push('本地特色');
            } else if (aTag == 'michilin') {
                tags_zh.push('米其林推荐');
            } else if (aTag == 'bestfordinner') {
                tags_zh.push('城市精选');
            } else if (aTag == 'popular') {
                tags_zh.push('人气热门');
            }
        }
        var res1 = [];
        for (var i = 0; i < $('.restags').length; i++) {
            var item = {};
            var enname = $('.restags').eq(i).attr('data-enname');
            item._id = $('.restags').eq(i).attr('data-value');
            item.en_name = enname;
            item.title = $('.restags').eq(i).attr('value');
            tags.push(enname);
            tags_zh.push(item.title );
            //alert(item.title + '###' + enname + '##' + 'Test##' + tags + '##' + tags_zh);
            res1.push(item);
        }
        //return false;
        var opentimes = [];
        for (var i = 0; i < $('.opentimes').length; i++) {
            var item = {};
            item.value = $('.opentimes').eq(i).attr('data-value');
            item.desc = $('.opentimes').eq(i).attr('value');
            opentimes.push(item);
        }

        var group = $(".comments-group");
        var array_text = [];
        for (var i = 0; i < group.length; i++) {//置顶评论操作
            var Element = group.eq(i);
            var title_T = Element.find("input[name=title]").val();
            //title_T=title_T.trim();
            var rating_T = Element.find("input[name=rating]").val();
            var text_T = Element.find("textarea[name=text]").val();
            var date_T = Element.find("input[name=date]").val();
            var nickname_T = Element.find("input[name=nickname]").val();
            //alert(title_T+'#'+rating_T+'#'+text_T+'#'+date_T+'#'+nickname_T);
            if (typeof(title_T) == 'undefined' || typeof(rating_T) == 'undefined' || typeof(text_T) == 'undefined' || typeof(date_T) == 'undefined' || typeof(nickname_T) == 'undefined') {
                continue;
            } else if (title_T == '' || text_T == '' || date_T == '' || nickname_T == '' || rating_T == '') {
                alert('评论列表信息不能为空，请重新输入！');
                return false;
            }
            if (isNaN(rating_T)) {
                alert("rating值必须1-5之间的整数！");
                return false;
            } else if (!(rating_T >= 1 && rating_T <= 5)) {
                alert("rating值必须1-5之间的整数！");
                return false;
            }
            array_text.push({title: title_T, rating: rating_T, text: text_T, date: date_T, nickname: nickname_T});
        }
        if ($("#latitude").val() < -90 || $("#latitude").val() > 90 || $("#longitude").val() < -180 || $("#longitude").val() > 180) {
            alert('经纬度输入有误,请重新输入!\n经度的范围：-180-180、纬度的范围：-90-90');
            return false;
        }
        var place_id = $('#placeId').val().trim();
        //poi_sortType
        alert( $('#poi_sortType').val());
        var item = {
            name: $('#name').val(),
            poi_sortType: $('#poi_sortType').val(),
            address: $('#address').val(),
            tel: $('#tel').val(),
            city_name: $('#city_select').find("option:selected").text(),
            city_id: $('#city_select').val(),
            latitude: $('#latitude').val(),
            longitude: $('#longitude').val(),
            postal_code: $('#postal_code').val(),
            brief_introduce: $('#brief_introduce').val(),
            introduce: $('#introduce').val(),
            tips: $('#tips').val(),
            placeId:place_id,
            show_flag: $('#show_flag').prop('checked'),
            recommand_flag: $('#recommand_flag').prop('checked'),
            recommand_duration: $('#recommand_duration').val(),
            index_flag: $('#index_flag').prop('checked'),
            tags: tags,//排名标签
            tags_zh: tags_zh,
            ranking: $('#ranking').val(),
            rating: $('#rating').val(),
            reviews: $('#reviews').val(),
            price_level: $('#price_level').val(),
            price_desc: $('#price_desc').val(),
            url: $('#url').val(),
            website: $('#website').val(),
            comments: $('#comments').val(),
            comments_url: $('#comments_url').val(),
            openTable_url: $('#openTable_url').val(),
            comments_top: array_text,
            category: categorys,
            //categories: categories,
            lifetag: lifetags,
            brand: brandtags1,
            shoptags: shops1,
            restags: res1,
            activities: activities1,
            open_time: opentimes,
            area_id: $('#area_select').val(),
            area_name: $('#area_select').find("option:selected").text(),
            am: $('#am').prop('checked'),
            pm: $('#pm').prop('checked'),
            ev: $('#ev').prop('checked')
        };
        if (type == '1') {
            var info = {
                wifi: $('#wifi').prop('checked'),
                yu_ding: $('#yu_ding').prop('checked'),
                delivery: $('#delivery').prop('checked'),
                take_out: $('#take_out').prop('checked'),
                card: $('#card').prop('checked'),
                g_f_kid: $('#g_f_kid').prop('checked'),
                g_f_group: $('#g_f_group').prop('checked'),
                out_seat: $('#out_seat').prop('checked'),
                tv: $('#tv').prop('checked'),
                waiter: $('#waiter').prop('checked'),
                g_for: $('#g_for').val(),
                noise: $('#noise').val(),
                alcohol: $('#alcohol').val()
            };
            item.info = info;
        } else if (type == '2') {
            item.is_big = $('#is_big').prop('checked');
            if (!item.is_big) {
                item.in_big_id = $('#big_select').val();
            }
        }
        if (item.name == '' || item.name == null || item.name == undefined) {
            alert('名称不能为空！');
            $('#name').focus();
            return false;
        }
        if($('#name_en').val()==''||$('#name_en').val()==null){
        var conm = confirm('新增POI时需要进行抓数据的操作\n确定要开始抓数据了吗？');
        if (conm == true) {
            alert('那就要耐心等待。。。。');
            //return false;
        } else {
            alert('此次操作失败、请重新填写！');
            return false;
        }
        }
        if (!isInt(item.price_level)) {
            alert('价格level必须是1,2,3,4,5');
            $('#price_level').focus();
            return false;
        }
        if (item.recommand_duration != '' && !isInt(item.recommand_duration)) {
            alert('推荐时间必须是整数！');
            $('#recommand_duration').focus();
            return false;
        }

        if (item.city_id == '' || item.city_id == null || item.city_id == undefined) {
            alert('城市不能为空！');
            $('#city_select').focus();
            return true;
        }

        if (this.model == null || this.model.get('_id') == null) {
            if (type == '1')
                this.model = new RestaurantModel(item);
            else if (type == '2')
                this.model = new ShoppingModel(item);
            else
                this.model = new EntertainmentModel(item);

            this.model.save({}, {
                success: function (model, res) {
                    if (res.isSuccess) {
                        var auditingModel = new weego.AuditingModel({
                            city_id: $("#city_select").val(),
                            city_name: $("#city_select").find("option:selected").text(),
                            task_id: $("#task_select").val(),
                            task_name: $("#task_select").find("option:selected").text(),
                            item_id: res._id,
                            editor_id: res.user_id,
                            type: type,
                            log_type: '0',
                            name: $('#name').val()
                        });
                        auditingModel.save(null, {
                            success: function (model, res) {
                                if (!res.isSuccess) {
                                    alert('保存信息成功，但auditing保存失败!!!！');
                                } else
                                    alert('保存成功');
                                // self.location = '/#lifes/1/'+type;
                            },
                            error: function () {
                                alert('保存信息成功，请通过编辑补充未抓取到的数据!!!\n同时auditing保存失败！');
                            }
                        });

                    } else {
                        alert('保存失败' + res.info);
                    }

                }
            });
        }
        else {
            this.model.save(item, {
                success: function (model, res) {
                    if (res.isSuccess) {
                        var auditingModel = new weego.AuditingModel({
                            city_id: $("#city_select").val(),
                            city_name: $("#city_select").find("option:selected").text(),
                            task_id: $("#task_select").val(),
                            task_name: $("#task_select").find("option:selected").text(),
                            item_id: res._id,
                            editor_id: res.user_id,
                            type: type,
                            log_type: '0',
                            name: $('#name').val()
                        });
                        auditingModel.save(null, {
                            success: function (model, res) {
                                if (!res.isSuccess) {
                                    alert('保存信息成功，但auditing保存失败！');
                                } else
                                    alert('修改成功');
                                window.history.back();
                                // self.location = '/#lifes/1/'+type;
                            },
                            error: function () {
                                //alert(JSON.stringify(auditingModel));
                                //alert(auditingModel.name_en);
                                alert('修改信息成功，但auditing保存失败！');
                                window.history.back();
                            }
                        });
                    } else {
                        alert('修改失败' + res.info);
                    }

                }
            });
        }
    }
});

var LifeListView = Backbone.View.extend({
    template: Handlebars.compile($('#life-list-view').html()),
    events: {
        'click #life-list-prev-page': 'showPrevPage',
        'click #life-list-next-page': 'showNextPage',
        'change #life_type': 'selectType',
        'click #search-button': 'serach',
        'click #search-areabtn': 'getAreasByCityId'
    },
    initialize: function (data) {
        var that = this;
        this.type = data.type;
        this.cityname = isNull(data.cityname) ? '' : data.cityname;
        this.areaname = isNull(data.areaname) ? '' : data.areaname;
        this.lifename = isNull(data.lifename) ? '' : data.lifename;
        // this.isLocalFlag = isNull(data.isLocalFlag)?"":data.isLocalFlag;
        // this.isMichilinFlag = isNull(data.isMichilinFlag)?"":data.isMichilinFlag;
        // this.isBestDinnerchoics = isNull(data.isBestDinnerchoics)?"":data.isBestDinnerchoics;
        // this.isMostPopular = isNull(data.isMostPopular)?"":data.isMostPopular;
        this.collection = new LifeCollection(data);

        this.collection.on('all', function () {
            $('#life-list-current-page').html(that.collection.currentPage);
            $('#life-list-total').html(that.collection.total);
            $('#life-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });

    },
    getAreasByCityId: function () {
        var cityname = $("#search-life-cityname").val();
        //console.log(cityname);
        if (cityname != '') {
            $.ajax({
                url: "/getAreasByCityName/" + cityname,
                success: function (data) {
                    //console.log(data);
                    if (data.status) {
                        var areas = data.results;
                        var option = '';
                        for (var i = 0; i < areas.length; i++) {
                            var area = areas[i];
                            option += '<option>' + area.area_name + '</option>';
                        }
                        $('#shopping-areas').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });
        }
    },
    serach: function () {
        var type = $('#life_type').val();
        var cityname = $('#search-life-cityname').val();
        var lifename = $('#search-life-name').val();
        var areaname = $('#shopping-areas').val();
        var isLocalFlag = $('#local_flag').prop('checked'),
            isMichilinFlag = $('#michilin_flag').prop('checked'),
            isBestDinnerchoics = $('#best_dinnerchoics').prop('checked'),
            isMostPopular = $('#most_popular').prop('checked');

        if (isLocalFlag || isMichilinFlag || isBestDinnerchoics || isMostPopular) {
            var substr = '';
            substr += '/tags=' + (isLocalFlag ? "localflag" : "");
            substr += (isMichilinFlag ? ',michilin' : '');
            substr += (isBestDinnerchoics ? ',bestfordinner' : '');
            substr += (isMostPopular ? ',popular' : '');
            // self.location = '/#lifes/query';
            // console.log(self.location);
            self.location = '/#lifes/1/' + type + '/q_' + cityname + '/q_' + encodeURIComponent(lifename) + substr;
        } else if (areaname != null) {
            self.location = '/#lifes/1/' + type + '/q_' + cityname + '/q_' + areaname + '/q_' + encodeURIComponent(lifename);
        } else {
            self.location = '/#lifes/1/' + type + '/q_' + cityname + '/q_' + encodeURIComponent(lifename);
        }
    },
    selectType: function () {
        var type = $('#life_type').val();
        var cityname = $.trim($('#search-life-cityname').val());
        self.location = '#lifes/1/' + type + '/q_' + cityname;
    },
    showLifeList: function (type, collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            model.set('type', type);
            var lifeListItemView = new LifeListItemView({model: model});
            lifeListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        });
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            //console.log(collection);
            that.showLifeList(that.type, collection);
        });
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showRestaurantList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1)) {
            return;
        } else {
            if (this.collection.query.indexOf('tags') >= 0) {
                var query = this.collection.query;
                query = query.split('tags')[1];
                Backbone.history.navigate('lifes/' + (--this.collection.currentPage) + '/' + this.type + '/q_' + this.cityname + '/q_' + encodeURIComponent(this.lifename) + '/tags' + query, {trigger: true});
            } else {
                Backbone.history.navigate('lifes/' + (--this.collection.currentPage) + '/' + this.type + '/q_' + this.cityname + '/q_' + encodeURIComponent(this.lifename), {trigger: true});
            }
        }
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showRestaurantList(collection);
//        });

        //console.log(query);
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false) {
            return;
        } else {
            if (this.collection.query.indexOf('tags') >= 0) {
                var query = this.collection.query;
                query = query.split('tags')[1];
                Backbone.history.navigate('lifes/' + (++this.collection.currentPage) + '/' + this.type + '/q_' + this.cityname + '/q_' + encodeURIComponent(this.lifename) + '/tags' + query, {trigger: true});
            } else {
                Backbone.history.navigate('lifes/' + (++this.collection.currentPage) + '/' + this.type + '/q_' + this.cityname + '/q_' + encodeURIComponent(this.lifename), {trigger: true});
            }
        }
    },
    showByPage: function (page) {
        var that = this;
        this.collection.getPage(page, function (collection) {
            that.showLifeList(that.type, collection);
        });
    },
    render: function () {
        var that = this;
        this.$el.html(that.template({
//            currentPage: that.collection.currentPage,
//            pageCount: (that.collection.total/that.collection.pageLimit) + 1,
//            total: that.collection.total
            user: weego_user.globalUser,
            type: this.type,
            search_cityname: this.cityname,
            search_lifename: isNull(this.lifename) ? this.lifename : decodeURIComponent(this.lifename)
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});


var LifeListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#life-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #life-list-item-edit': 'editLife',
        'click #life-list-item-remove': 'removeLife',
        'click #life-list-item-img': 'manageimg',
        'click #life-list-item-menu': 'managemenu'
    },
    render: function () {
        this.model.set('user', weego_user.globalUser);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    manageimg: function (e) {
        var manageImageView = new ManageImageViewTest();
        manageImageView.model = this.model;
        manageImageView.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageImageView.unloadPic();
    },
    manageact: function (e) {
        var manageImageView = new ManageImageViewTest();
        manageImageView.model = this.model;
        manageImageView.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageImageView.unloadPic();
    },
    managemenu: function (e) {
        var manageMenuViewTest = new ManageMenuViewTest();
        manageMenuViewTest.model = this.model;
        manageMenuViewTest.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageMenuViewTest.unloadPic();
    },
    editLife: function (e) {
        e.preventDefault();
        var type = $('#life_type').val();
        var item_id = $(e.currentTarget).attr('item_id');
        self.location = '/#life/' + item_id + '/' + type;
        // $('#app').off();
        // $('#app').empty();
        // (new RestaurantView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeLife: function () {
        //console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});
var ManageMenuViewTest = Backbone.View.extend({
    tagName: "div",
    className: "modal hide fade",
    "id": "manageMenuDialog",
    initialize: function () {
        _.bindAll(this, 'render');
    },
    render: function () {
        var _this = this;
        this.$el.css({
            width: "100%",
            height: "100%",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            position: 'relative'
        });
        var template = Handlebars.compile($('#manageTempView').html());
        $(template()).appendTo(_this.$el);
        var type = _this.model.get('type');
        _this.$('#zxx_id_Temp').val(_this.model.get('_id'));
        _this.$('#_type_Temp').val(type);
        var imgForlder = 'restaurant';
        if (type == '1')
            imgForlder = 'restaurant';
        else if (type == '2')
            imgForlder = 'shopping';
        else
            imgForlder = 'entertainment';
        var menu = _this.model.get('menu');
        if (menu && menu.length > 0) {
            for (var i = 0; i < menu.length; i++) {
                var uploadMenuView = new UploadMenuViewLife();
                uploadMenuView.model = {
                    _id: menu[i].cover_image,
                    desc: menu[i].desc,
                    advice: menu[i].advice,
                    imgForlder: imgForlder,
                    type: 'menu',
                    num: i
                };
                uploadMenuView.render().$el.appendTo(_this.$("#TempuploadedName"));
            }
        }

        return this;
    },
    unloadPic: function () {
        this.initZXXTEMP();
    },
    initZXXTEMP: function () {
        var params = {
            fileInput: $("#fileTemp").get(0),
            dragDrop: $("#fileDragArea").get(0),
            menuButton: $("#TempSubmit").get(0),
            url: '/postLifeMenu',
            type: 'menu',
            filter: function (files) {
                var arrFiles = [];
                for (var i = 0, file; file = files[i]; i++) {
                    if (file.type.indexOf("image") == 0 || (!file.type && /\.(?:jpg|png|gif)$/.test(file.name) /* for IE10 */)) {
                        if (file.size >= 30720000) {
                            alert('您这张"' + file.name + '"图片大小过大，应小于30M');
                        } else {
                            arrFiles.push(file);
                        }
                    } else {
                        alert('文件"' + file.name + '"不是图片。');
                    }
                }
                return arrFiles;
            },
            onSelect: function (files) {
                var html = '', i = 0;
                $("#Temppreview").html('<div class="upload_loading"></div>');
                var funAppendImage = function () {
                    file = files[i];
                    if (file) {
                        var reader = new FileReader()
                        reader.onload = function (e) {
                            html = html + '<div id="uploadList_' + i + '" class="upload_append_list"><p><strong>' + file.name + '</strong>' +
                                '<a href="javascript:" class="upload_delete" title="删除" data-index="' + i + '">删除</a><br />' +

                                '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" /></p>' +
                                '<p><strong>此处添加推荐&nbsp;&nbsp;<font color="red">非必填，参考如下：主厨推荐，人气最佳等，控制在5个字！</font></strong></p><textarea id="uploadAdvice_' + i + '" class="upload_advice_list" style="height:50px;width:500px"></textarea>' +
                                '<p><strong>食物名称</strong></p><textarea id="uploadDesc_' + i + '" class="upload_desc_list" style="height:200px;width:500px"></textarea>' +
                                '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
                                '</div>';
                            i++;
                            funAppendImage();
                        }
                        reader.readAsDataURL(file);
                    } else {
                        $("#Temppreview").html(html);
                        if (html) {
                            //删除方法
                            $(".upload_delete").click(function () {
                                ZXXTEMP.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                                return false;
                            });
                            //提交按钮显示
                            $("#TempSubmit").show();
                        } else {
                            //提交按钮隐藏
                            $("#TempSubmit").hide();
                        }
                    }
                };
                funAppendImage();
            },
            onDelete: function (file) {
                $("#uploadList_" + file.index).fadeOut();
            },
            onDragOver: function () {
                $(this).addClass("upload_drag_hover");
            },
            onDragLeave: function () {
                $(this).removeClass("upload_drag_hover");
            },
            onProgress: function (file, loaded, total) {
                var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
                eleProgress.show().html(percent);
            },
            onSuccess: function (file, response) {
                $("#TempuploadInf").append("<p>图片" + file.name + "上传成功!</p>");
            },
            onFailure: function (file) {
                $("#TempuploadInf").append("<p>图片" + file.name + "上传失败！</p>");
                $("#uploadImage_" + file.index).css("opacity", 0.2);
            },
            onComplete: function () {
                //提交按钮隐藏
                $("#TempSubmit").hide();
                //file控件value置空
                $("#fileTemp").val("");
                $("#TempuploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
            }
        };
        ZXXTEMP = $.extend(ZXXTEMP, params);
        ZXXTEMP.init();
    }
});
var ManageImageViewTest = Backbone.View.extend({
    tagName: "div",
    className: "modal hide fade",
    "id": "manageImageDialog",
    initialize: function () {
        _.bindAll(this, 'render');
    },
    render: function () {
        var _this = this;
        this.$el.css({
            width: "100%",
            height: "100%",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 'auto',
            position: 'relative'
        });
        var template = Handlebars.compile($('#manageImageView').html());
        $(template()).appendTo(_this.$el);
        var type = _this.model.get('type');
        _this.$('#zxx_id').val(_this.model.get('_id'));
        _this.$('#_type').val(type);
        var imgForlder = 'restaurant';
        if (type == '1')
            imgForlder = 'restaurant';
        else if (type == '2')
            imgForlder = 'shopping';
        else
            imgForlder = 'entertainment';
        var image = _this.model.get('image');
        if (image && image.length > 0) {
            for (var i = 0; i < image.length; i++) {
                var uploadImageView = new UploadImageViewLife();
                uploadImageView.model = {_id: image[i], imgForlder: imgForlder, type: type};
                uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
            }
        }
        var coverImageName = _this.model.get('cover_image');
        if (coverImageName) {
            _this.$('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/' + imgForlder + '/origin/' + coverImageName + '?rev=' + Math.random() + '">'));
        }

        return this;
    },
    unloadPic: function () {
        this.initZXXFILE();
    },
    initZXXFILE: function () {
        var params = {
            fileInput: $("#fileImage").get(0),
            dragDrop: $("#fileDragArea").get(0),
            upButton: $("#fileSubmit").get(0),
            url: '/postLifeImage',
            filter: function (files) {
                var arrFiles = [];
                for (var i = 0, file; file = files[i]; i++) {
                    if (file.type.indexOf("image") == 0 || (!file.type && /\.(?:jpg|png|gif)$/.test(file.name) /* for IE10 */)) {
                        if (file.size >= 30720000) {
                            alert('您这张"' + file.name + '"图片大小过大，应小于30M');
                        } else {
                            arrFiles.push(file);
                        }
                    } else {
                        alert('文件"' + file.name + '"不是图片。');
                    }
                }
                return arrFiles;
            },
            onSelect: function (files) {
                var html = '', i = 0;
                $("#preview").html('<div class="upload_loading"></div>');
                var funAppendImage = function () {
                    file = files[i];
                    if (file) {
                        var reader = new FileReader()
                        reader.onload = function (e) {
                            html = html + '<div id="uploadList_' + i + '" class="upload_append_list"><p><strong>' + file.name + '</strong>' +
                                '<a href="javascript:" class="upload_delete" title="删除" data-index="' + i + '">删除</a><br />' +
                                '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" /></p>' +
                                '<span id="uploadProgress_' + i + '" class="upload_progress"></span>' +
                                '</div>';

                            i++;
                            funAppendImage();
                        }
                        reader.readAsDataURL(file);
                    } else {
                        $("#preview").html(html);
                        if (html) {
                            //删除方法
                            $(".upload_delete").click(function () {
                                ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                                return false;
                            });
                            //提交按钮显示
                            $("#fileSubmit").show();
                        } else {
                            //提交按钮隐藏
                            $("#fileSubmit").hide();
                        }
                    }
                };
                funAppendImage();
            },
            onDelete: function (file) {
                $("#uploadList_" + file.index).fadeOut();
            },
            onDragOver: function () {
                $(this).addClass("upload_drag_hover");
            },
            onDragLeave: function () {
                $(this).removeClass("upload_drag_hover");
            },
            onProgress: function (file, loaded, total) {
                var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
                eleProgress.show().html(percent);
            },
            onSuccess: function (file, response) {
                $("#uploadInf").append("<p>图片" + file.name + "上传成功!</p>");
            },
            onFailure: function (file) {
                $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");
                $("#uploadImage_" + file.index).css("opacity", 0.2);
            },
            onComplete: function () {
                //提交按钮隐藏
                $("#fileSubmit").hide();
                //file控件value置空
                $("#fileImage").val("");
                $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
            }
        };
        ZXXFILE = $.extend(ZXXFILE, params);
        ZXXFILE.init();
    }
});

var UploadImageViewLife = Backbone.View.extend({
    tagName: 'li',
    initialize: function () {
        _.bindAll(this, 'render', 'remove', 'setCoverImg');
    },
    render: function () {
        var _this = this;
        var template = Handlebars.compile($('#uploadImageView').html());
        $(template(_this.model)).appendTo(_this.$el);
        return this;
    },
    events: {
        'click .btn-remove': 'remove',
        'click .setCoverImg': 'setCoverImg'
    },
    setCoverImg: function () {
        var _this = this;
        var _id = $('#zxx_id').val();
        $.ajax({
            url: '/setCoverImgLife/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data) {
                    $('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/' + _this.model.imgForlder + '/origin/' + data + '?rev=' + Math.random() + '">'));
                }
            }
        });
    },
    remove: function (e) {
        var _this = this;
        var _id = $('#zxx_id').val();
        $.ajax({
            url: '/delUploadImageLife/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});
var UploadMenuViewLife = Backbone.View.extend({
    tagName: 'li',
    "id": "uploaditem",
    initialize: function () {
        _.bindAll(this, 'render', 'remove', 'save');
    },
    render: function () {
        var _this = this;
        var template = Handlebars.compile($('#uploadTempView').html());
        $(template(_this.model)).appendTo(_this.$el);
        return this;
    },
    events: {
        'click .btn-remove': 'remove',
        'click .btn-save': 'save'
    },
    save: function (e) {
        var _this = this;
        var num = _this.model.num;
        var _id = $('#zxx_id_Temp').val();
        var desc = $('.txt-desc' + num).val();
        var advice = $('.txt-advice' + num).val();
        $.ajax({
            type: 'POST',
            url: '/UpdateUploadMenu',
            data: {'_id': _id, 'name': _this.model._id, 'desc': desc, 'advice': advice},
            success: function (data) {
                if (data.status == 'success') {
                    alert("save success!");
                }
            }
        })
    },
    remove: function (e) {
        if(confirm('是否删除？')!=true){
            return false;
        }
        var _this = this;
        var _id = $('#zxx_id_Temp').val();
        $.ajax({
            url: '/delUploadMenuLife/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

