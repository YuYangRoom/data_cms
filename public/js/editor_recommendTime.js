/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var RecommendTimeModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/recommendTime'
});
var RecommendTimeCollection = Backbone.Collection.extend({
    url: '/recommendTimes/' + this.pageLimit + '/' + this.currentPage,
    model: RecommendTimeModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.recommendTimes;
    },
    hasPage: function (page) {
        if (((page * this.pageLimit) - this.total) > this.pageLimit)
            return false;
        if (page == 0)
            return false;
        return true;
    },
    getByPage: function (limit, pageIndex, type, successCallback) {
        if (type == null || type == undefined || type == '')
            type = '1';
        this.url = '/recommendTimes/' + limit + '/' + pageIndex + '/' + type;
        this.fetch({success: successCallback});
    },
    getFirstPage: function (callback) {
        this.getByPage(this.pageLimit, 1, '1', callback);
    },
    getNextPage: function (type, successCallback) {
        if (!this.hasPage(this.currentPage + 1))
            return;
        this.getByPage(this.pageLimit, ++this.currentPage, type, successCallback);
    },
    getPrevPage: function (type, successCallback) {
        if (!this.hasPage(this.currentPage - 1))
            return;
        this.getByPage(this.pageLimit, --this.currentPage, type, successCallback);
    },
    getPage: function (page, type, successCallback) {
        this.currentPage = page;
        this.getByPage(this.pageLimit, this.currentPage, type, successCallback);
    },
    getrecommendTimeInfo: function(cityname,areaname,type,successCallback){
        this.url ='/getrecommendTimessByName/?cityname=' + cityname + '&areaname=' + areaname+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var RecommendTimeView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendTimeDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#recommendTimeDetailView').html());
    },
    events: {
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'click #save': 'saveRecommendTime',
        'click #addRecomment_Time': 'addRecomment_Time',
        'click .del': 'delInfo',
        'click #cancel': 'back'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    back: function () {
        console.log('back!');
        window.history.back();
    },
    getTextInputValue: function (id) {
        return this.$el.find('#' + id).val();
    },
    selectContinent: function () {
        var continentCode = $("#continents_select").val();
        $.ajax({
            url: "/getCountriesByContinent/" + continentCode,
            success: function (data) {
                if (data.status) {
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
        var countryCode = $("#country_select").val();

        $.ajax({
            url: "/getCityByCountry/" + countryCode,
            success: function (data) {
                if (data.status) {

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
        $("#cityname").val(cityname);
    },
    delInfo: function (e) {
        $(e.target).parents('.recomments-group').remove();//POI删除
        $(e.target).parent().remove();
    },
    addRecomment_Time: function () {
        var $newlabel = $('<div class="control-group recomments-group"><label class="control-label"  for="label2"><font  color="green">时间段信息（新）</font></label><div class="controls">' +
            '开始时间: <select class="input-xlarge focused " name="start_time"  style="width:6%" >'+
         ' <option value="00">00</option>'+
          '<option value="01">01</option>'+
          '<option value="02">02</option>'+
          '<option value="03">03</option>'+
          '<option value="04">04</option>'+
          '<option value="05">05</option>'+
          '<option value="06">06</option>'+
          '<option value="07">07</option>'+
          '<option value="08">08</option>'+
          '<option value="09">09</option>'+
          '<option value="10">10</option>'+
          '<option value="11">11</option>'+
          '<option value="12">12</option>'+
          '<option value="13">13</option>'+
          '<option value="14">14</option>'+
          '<option value="15">15</option>'+
          '<option value="16">16</option>'+
          '<option value="17">17</option>'+
          '<option value="18">18</option>'+
          '<option value="19">19</option>'+
          '<option value="20">20</option>'+
          '<option value="21">21</option>'+
          '<option value="22">22</option>'+
          '<option value="23">23</option>'+
        '  </select> ' +
           ' 结束时间:<select class="input-xlarge focused " name="end_time"  style="width:6%" >'+
            ' <option value="00">00</option>'+
            '<option value="01">01</option>'+
            '<option value="02">02</option>'+
            '<option value="03">03</option>'+
            '<option value="04">04</option>'+
            '<option value="05">05</option>'+
            '<option value="06">06</option>'+
            '<option value="07">07</option>'+
            '<option value="08">08</option>'+
            '<option value="09">09</option>'+
            '<option value="10">10</option>'+
            '<option value="11">11</option>'+
            '<option value="12">12</option>'+
            '<option value="13">13</option>'+
            '<option value="14">14</option>'+
            '<option value="15">15</option>'+
            '<option value="16">16</option>'+
            '<option value="17">17</option>'+
            '<option value="18">18</option>'+
            '<option value="19">19</option>'+
            '<option value="20">20</option>'+
            '<option value="21">21</option>'+
            '<option value="22">22</option>'+
            '<option value="23">23</option>'+
            '  </select> ' +
           ' 名称:<input class="input-xlarge focused "style="width:20%"  name="title"  type="text" >' +
            '<input type="button" value="删除" class="del"></div></div>');
        $('.comments-group').last().after($newlabel);
    },
    saveRecommendTime: function (e) {
        var poi_tags = [];
        var group = $(".recomments-group");
        for (var i = 0; i < group.length; i++) {
            var Element = group.eq(i);
            //this.getTextInputValue('recommend_end_time')
            var start_time = Element.find("select[name=start_time]").val();
            var end_time = Element.find("select[name=end_time]").val();
            var title = Element.find("input[name=title]").val();
            if (typeof(start_time) == 'undefined' || typeof(end_time) == 'undefined' || typeof(title) == 'undefined') {
                continue;
            }
            if(start_time>end_time){
                alert("开始时间不能大于结束时间");
                return false;
            }
                poi_tags.push({
                    start_time: start_time,
                    end_time: end_time,
                    title: title,
                })
        }
        if(this.getTextInputValue('city_select')==''){
            alert("城市不能为空！");
            return false;
        }
    var city_json={};
        city_json.cityname= this.getTextInputValue('cityname');
        city_json._id= this.getTextInputValue('city_select');
        //alert(city_json.cityname);
        //return false;
        var recommendTimeDetails = {
            city: city_json,
            time_interval:poi_tags

            }
        if (this.model == null || this.model.get('_id') == null) {
            this.model = new RecommendTimeModel(recommendTimeDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(recommendTimeDetails, {
                success: function () {
                    alert('修改成功');
                    window.history.back();
                }
            });
        }

        e.preventDefault();
        return false;
    }
});

var RecommendTimeListView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendTime-list-view').html()),
    events: {
        'click #RecommendTime-list-prev-page': 'showPrevPage',
        'click #recommendTime-list-next-page': 'showNextPage',
        'click #search-recommendTime-button': 'recommendTimeButton',
        'change #recommendTime_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new RecommendTimeCollection();
        this.collection.on('all', function () {
            $('#recommendTime-list-current-page').html(that.collection.currentPage);
            $('#recommendTime-list-total').html(that.collection.total);
            $('#recommendTime-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    recommendTimeButton: function () {
        var cityname = $('#search-cityname-cityname').val();
        var name = $('#search-name-name').val();
        var type = $('#recommendTime_type').val();
        var that = this;
        this.collection.getrecommendTimeInfo(cityname,name,type, function (collection)  {
            that.showRecommendTimeList(collection);
        })
    },
    selectType: function () {
        var type = $('#recommendTime_type').val();
        self.location = '#recommendTimes/1/' + type;
    },
    showRecommendTimeList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var recommendTimeListItemView = new RecommendTimeListItemView({model: model});
            recommendTimeListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showRecommendTimeList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('recommendTimes/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('recommendTimes/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showRecommendTimeList(collection);
        });
    },
    render: function () {
        var that = this;
        this.$el.html(that.template({
//            currentPage: that.collection.currentPage,
//            pageCount: (that.collection.total/that.collection.pageLimit) + 1,
//            total: that.collection.total
            type: this.type
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});


var RecommendTimeListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendTime-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #recommendTime-list-item-edit': 'editRecommendTime',
        'click #recommendTime-list-item-remove': 'removeRecommendTime',
        'click #recommendTime-list-item-image':'manageImage'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editRecommendTime: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeRecommendTime: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    },
    manageImage:function(){
        var manageRecommendTimeImageViewTest=new ManageRecommendTimeImageViewTest();
        manageRecommendTimeImageViewTest.model = this.model;
        manageRecommendTimeImageViewTest.render().$el.new_modal({
            "show":true,
            "z_index": weego.z_index++
        });
        manageRecommendTimeImageViewTest.unloadPic();
    }
});