/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var RecommendRuleModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/recommendRule'
});
var RecommendRuleCollection = Backbone.Collection.extend({
    url: '/recommendRules/' + this.pageLimit + '/' + this.currentPage,
    model: RecommendRuleModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.recommendRules;
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
        this.url = '/recommendRules/' + limit + '/' + pageIndex + '/' + type;
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
    getrecommendRuleInfo: function(cityname,areaname,type,successCallback){
        this.url ='/getrecommendRulessByName/?cityname=' + cityname + '&areaname=' + areaname+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});
//-----------------------------------end model,collection---------------------------------------------------
//-----------------------------------begin view--------------------------------------------------------------
var RecommendRuleView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendRuleDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#recommendRuleDetailView').html());
    },
    events: {
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'click #addRecommendRule': 'addRecommendRule',
        'click #save': 'saveRecommendRule',
        'click .del': 'delInfo',
        //'click #addRecomment_Time': 'addRecomment_Time',
        'focus #addTimetagValue': 'autogetTimetag',
        'click #addTimetag': 'addTimetag',
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
    addRecommendRule: function () {
        var $newlabel = $('<div class="control-group recomments-group"><label class="control-label"  for="label2"><font  color="green">新增推送内容</font></label><div class="controls">' +
            'type:<input class="input-xlarge focused " style="width:2%"  name="type" type="text"  >' +
            'POI的ID:<input class="input-xlarge focused "style="width:12%" name="id"  type="text" >' +
            'title:<input class="input-xlarge focused " name="title" style="width:12%"   type="text" >' +
            'recom_title:<input class="input-xlarge focused " name="recom_title" style="width:12%"   type="text"   >' +
            'Recom_desc:&nbsp;<textarea class="input-xlarge focused " name="recom_desc" style="width: 300px"  ></textarea>' +
            '<input type="button" value="删除" class="del"></div></div>');
        $('.comments-group').last().after($newlabel);
    },
    delInfo: function (e) {
        $(e.target).parents('.recomments-groupTime').remove();//删除
        $(e.target).parent().remove();
    },
    addTimetag: function () {
        var label = $('#addTimetagValue').val();
        var itemId = $('#addTimetagValue').attr('data-value');
        var name = $('#addTimetagValue').attr('data-value2');
        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused timetags" readonly style="width:100px" name="timetags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '"  data-value2="' + name + '"> <input type="button" value="删除" class="del"><li>');
            $('#time_rules-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
    },
    autogetTimetag: function (e) {
        var _this = this;
        //var key = $('#addTimetagValue').val().replace(/\s/g,"");
        $("#addTimetagValue").autocomplete({
            source: function (request, response) {
                var key = $('#cityname').val().replace(/\s/g,"");
                if (key == "")key = "";
                $.ajax({
                    url: "/getrecommendTimesByType/" + key ,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.title,
                                        start_time: item.start_time,
                                        end_time: item.end_time

                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addTimetagValue").attr('value', ui.item.label);
                $("#addTimetagValue").attr('data-value', ui.item.start_time);
                $("#addTimetagValue").attr('data-value2', ui.item.end_time);

            }
        });
    },
/*    addRecomment_Time: function () {
        var $newlabel = $('<div class="control-group recomments-groupTime"><label class="control-label"  for="label2"><font  color="green">时间段信息（新）</font></label><div class="controls">' +
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
            ' 名称:<input class="input-xlarge focused "style="width:20%"  name="time_title"  type="text" >' +
            '<input type="button" value="删除" class="del"></div></div>');
        $('.comments-groupTime').last().after($newlabel);
    },*/
    saveRecommendRule: function (e) {
        var time_rules=[];
        for (var i = 0; i < $('.timetags').length; i++) {
            var item = {};
            item.start_time = $('.timetags').eq(i).attr('data-value');
            item.end_time = $('.timetags').eq(i).attr('data-value2');
            item.title = $('.timetags').eq(i).attr('value');
            //alert(item.title+"###"+ item.start_time+"##"+ item.title );
            time_rules.push(item);
        }

        var poi_tags = [];
        var group = $(".recomments-group");
        for (var i = 0; i < group.length; i++) {
            var Element = group.eq(i);
            var type = Element.find("input[name=type]").val().replace(/\s+/g, '');
            var id = Element.find("input[name=id]").val().replace(/\s+/g, '');
            var title = Element.find("input[name=title]").val();
            var recom_title = Element.find("input[name=recom_title]").val() ;
            var recom_desc = Element.find("textarea[name=recom_desc]").val();
            if (typeof(type) == 'undefined' || typeof(id) == 'undefined' || typeof(recom_title) == 'undefined' || typeof(recom_desc) == 'undefined') {
                continue;
            }
            if (type == 2|| type == 1|| type == 0|| type ==3|| type == 4|| type ==5|| type ==6) {
                poi_tags.push({
                    type: type,
                    id: id,
                    title: title,
                    recom_title: recom_title,
                    recom_desc: recom_desc
                });
            }
            else {
                alert('poi类型只能是0、1、2、3,4,5,6或者为空！' + '\n你输入的是:' + type);
                return false;
            }
        }
        var one=this.$('#one').prop("checked");
        var two=this.$('#two').prop("checked");
        var three=this.$('#three').prop("checked");
        var four=this.$('#four').prop("checked");
        var five=this.$('#five').prop("checked");
        var six=this.$('#six').prop("checked");
        var seven=this.$('#seven').prop("checked");
        var eight=this.$('#eight').prop("checked");
        var week = [];
        if(one==true){
            week.push(1);
        }
        if(two==true){
            week.push(2);
        }
        if(three==true){
            week.push(3);
        }
        if(four==true){
            week.push(4);
        }
        if(five==true){
            week.push(5);
        }
        if(six==true){
            week.push(6);
        }
        if(seven==true){
            week.push(7);
        }
        if(eight==true){
            week.push(8);
        }
        var city_json={};
        if(this.getTextInputValue('cityname')==''){
            alert("城市不能为空！");
            return false;
        }
        city_json.cityname= this.getTextInputValue('cityname');
        city_json._id= this.getTextInputValue('city_select');
        var isValid=this.$("#isValid").prop("checked");
        var type=this.getTextInputValue('recommendRule-property-type');
        var title=this.getTextInputValue('recommendRule-title');
        var desc=this.getTextInputValue('recommendRule-desc');
        var longitude=this.getTextInputValue('recommendRule-longitude');
        var latitude=this.getTextInputValue('recommendRule-latitude');
        var range=this.getTextInputValue('recommendRule-range');
        var startDate = this.getTextInputValue('recommendRule-startDate');
        var endDate = this.getTextInputValue('recommendRule-endDate');
        var recommendRuleDetails = {
            one:one,
            two:two,
            three:three,
            four:four,
            five:five,
            six:six,
            seven:seven,
            eight:eight,
            isValid: isValid,
            city: city_json,
            type:type,
            title:title ,
            longitude:longitude ,
            latitude:latitude ,
            range:range ,
            desc:desc ,
            recom_content: poi_tags,
            startDate: startDate,
            endDate: endDate,
            week: week,
            time_rules: time_rules
        }
        if (this.model == null || this.model.get('_id') == null) {
            this.model = new RecommendRuleModel(recommendRuleDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(recommendRuleDetails, {
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

var RecommendRuleListView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendRule-list-view').html()),
    events: {
        'click #recommendRule-list-prev-page': 'showPrevPage',
        'click #recommendRule-list-next-page': 'showNextPage',
        'click #search-recommendRule-button': 'recommendRuleButton',
        'change #recommendRule_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new RecommendRuleCollection();
        this.collection.on('all', function () {
            $('#recommendRule-list-current-page').html(that.collection.currentPage);
            $('#recommendRule-list-total').html(that.collection.total);
            $('#recommendRule-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    recommendRuleButton: function () {
        var cityname = $('#search-cityname-cityname').val();
        var name = $('#search-name-name').val();
        var type = $('#recommendRule_type').val();
        var that = this;
        this.collection.getrecommendRuleInfo(cityname,name,type, function (collection)  {
            that.showRecommendRuleList(collection);
        })
    },
    selectType: function () {
        var type = $('#recommendRule_type').val();
        self.location = '#recommendRules/1/' + type;
    },
    showRecommendRuleList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var recommendRuleListItemView = new RecommendRuleListItemView({model: model});
            recommendRuleListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showRecommendRuleList(collection);
        })
    },
    showPrevPage: function () {
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('recommendRules/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('recommendRules/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showRecommendRuleList(collection);
        });
    },
    render: function () {
        var that = this;
        this.$el.html(that.template({
            type: this.type
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});

var RecommendRuleListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendRule-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #recommendRule-list-item-edit': 'editRecommendRule',
        'click #recommendRule-list-item-remove': 'removeRecommendRule',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editRecommendRule: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeRecommendRule: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});