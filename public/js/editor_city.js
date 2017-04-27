/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego_city = {
    init:function () {

    }
};
$(weego_city.init());
(function (weego_city) {
    weego_city.currentPage = 1;
    weego_city.limit = 20;
    weego_city.sumpages = 1;
    weego_city.count = 0;
//    weego_city.GlobalRouter = Backbone.Router.extend({
//        routes:{
//            "city/:pageno":"city", //
//            "*actions":"index"
//        },
//        city:function (pageno) {
//            weego_city.currentPage = pageno;
//            weego_city.defaultView = new weego_city.AppView();
//            weego_city.defaultView.getData(weego_city.currentPage)
//        },
//        index:function () {
//            weego_city.currentPage = 1;
//            weego_city.defaultView = new weego_city.AppView();
//            weego_city.defaultView.getData(weego_city.currentPage)
//        }
//    });

    weego_city.CityModel = Backbone.Model.extend({
        urlRoot:'/city',
        idAttribute:"_id"
    });
    weego_city.CityCollection = Backbone.Collection.extend({
        model:weego_city.CityModel
    });
    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    weego_city.AddCityDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function (that) {
            this.that = that;
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#add_city_template").html());
            $(template(_this.model)).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'click #addlabel':'addlabel',
            'click #addTip':'addTip',
            'click #addIntr':'addIntr',
            'click #addTra':'addTra',
            'focus .labels':'autogetMasterLabel',
            'focus #masterLabel':'autogetMasterLabel',
            'click .del':'dellabel',
            'click .delTip':'delTip',
            'click .delIntr':'delIntr',
            'click .delTra':'delTra',
            'change #continents':'selectCountry'
        },

        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        delTip:function (e) {
            $(e.target).parents('.tip-control').remove();
        },
        delTra:function (e) {
            $(e.target).parents('.tra-control').remove();
        },
        delIntr:function (e) {
            $(e.target).parents('.intr-control').remove();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        addTip:function () {
            var $newtip = $('<div class="controls tip-control"><input class="input-xlarge focused tipItemTitle"  name="tipItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delTip"><textarea class="tipItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.tip-control').last().after($newtip);
        },
        addTra:function () {
            var $newtra = $('<div class="controls tra-control"><input class="input-xlarge focused traItemTitle"  name="traItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delTra"><textarea class="traItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.tra-control').last().after($newtra);
        },
        addIntr:function () {
            var $newintr = $('<div class="controls intr-control"><input class="input-xlarge focused intrItemTitle"  name="intrItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delIntr"><textarea class="intrItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.intr-control').last().after($newintr);
        },
        autogetMasterLabel:function (e) {
            if ($(e.target).attr('id') == 'masterLabel') {
                $("#masterLabel").autocomplete({
                    source:function (request, response) {
                        $.ajax({
                            url:"/getLabelByLevel/1",
                            dataType:"json",
                            data:request,
                            success:function (data) {
                                response(
                                    $.map(
                                        data.label, function (item) {
                                            return {
                                                label:item.label,
                                                value:item.label,
                                                masterLbale_id:item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select:function (event, ui) {
                        $(e.target).attr('data-value', ui.item.masterLbale_id);
                    }
                });
            } else {
                $(".labels").autocomplete({
                    source:function (request, response) {
                        $.ajax({
                            url:"/getLabelByLevel/1",
                            dataType:"json",
                            data:request,
                            success:function (data) {
                                response(
                                    $.map(
                                        data.label, function (item) {
                                            return {
                                                label:item.label,
                                                value:item.label,
                                                sublevel_id:item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select:function (event, ui) {
                        $(e.target).attr('data-value', ui.item.sublevel_id);
                    }
                });
            }
        },

        showCityLocations:function () {
            locationCity();
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                console.log($('.labels').eq(i));
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            var array_tips = [];
            for (var i = 0; i < $('.tipItemTitle').length; i++) {
                var tipItem = {};
                tipItem.tipItemTitle = $('.tipItemTitle').eq(i).attr('data-value');
                tipItem.tipItemContent = $('.tipItemContent').eq(i).val();
                array_tips.push(tipItem);
            }
            var array_tra = [];
            for (var i = 0; i < $('.traItemTitle').length; i++) {
                var traItem = {};
                traItem.traItemTitle = $('.traItemTitle').eq(i).attr('data-value');
                traItem.traItemContent = $('.traItemContent').eq(i).val();
                array_tra.push(traItem);
            }
            var array_intr = [];
            for (var i = 0; i < $('.intrItemTitle').length; i++) {
                var intrItem = {};
                intrItem.intrItemTitle = $('.intrItemTitle').eq(i).attr('data-value');
                intrItem.intrItemContent = $('.intrItemContent').eq(i).val();
                array_intr.push(intrItem);
            }
            var recommand_center = {};
            recommand_center.name = $("#recommand_center_name").val();
            recommand_center.latitude = $("#recommand_center_latitude").val();
            recommand_center.longitude = $("#recommand_center_longitude").val();
            recommand_center._id = 'center';
            //新增城市
            var dst=Number($("#dstOffset").val());
            var rawO= Number($("#rawOffset").val());
            var drs={};
            if(isNaN(dst)){
                alert('dstOffset必须是数值类型！');
                return false;
            }
            if(isNaN(rawO)){
                alert('rawOffset必须是数值类型！');
                return false;
            }
            drs.dstOffset=dst;
            drs.rawOffset=rawO;

            var continents= $("#update_continents").val();
            var countryname=$("#update_countryname").val();
            var en_info={};
            if(continents==''){
                alert('continents不能为空！');
                return false;
            }
            if(countryname==''){
                alert('countryname不能为空！');
                return false;
            }
            //alert(continents+'##'+countryname);
            en_info.continents=continents;
            en_info.countryname=countryname;
            var newAttractions = new weego_city.CityModel({
                continents:$("#continents option:selected").text(),
                continentscode:$("#continents").val(),
                cityname_py:$("#cityname_py").val(),
                cityname:$("#cityname").val(),
                cityname_en:$("#cityname_en").val(),
                countryname:$("#country option:selected").text(),
                countrycode:$("#country").val(),
                introduce:array_intr,
                short_introduce:$("#short_introduce").val(),
                restaurant_overview:$("#restaurant_overview").val(),
                shopping_overview:$("#shopping_overview").val(),
                attraction_overview:$("#attraction_overview").val(),
                timezone:drs,
                en_info:en_info,
                tips:array_tips,
                traffic:array_tra,
                recommand_day:$("#recommand_day").val(),
                recommand_indensity:$("#recommand_indensity").val(),
                recommand_center : recommand_center,
                hot_flag:$('input:radio[name="hot_flag"]:checked').val(),
                city_rank:$("#city_rank").val(),
                show_flag:$('input:radio[name="show_flag"]:checked').val(),
                masterLabel:$("#masterLabel").attr('data-value'),
                label:array_label,
                latitude:$("#latitude").val(),
                longitude:$("#longitude").val(),
                weoid:$('#weoid').val()
            });
            newAttractions.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                    } else {
                        alert('保存成功');
                        $("#attractionsDialog").new_modal('hide');
                        _this.that.getData(weego_city.currentPage);
                    }
                },
                error:function () {
                    alert("失败");
                }
            });
            return false;
        },
        selectCountry: function(){
            var continentCode =  $("#continents").val();
            $.ajax({
                url:"/getCountriesByContinent/"+continentCode,
                success:function (data) {
                    if(data.status){
                        var countries = data.countries;
                        var option = '';
                        for(var i=0;i<countries.length;i++){
                            var country = countries[i];
                            option +='<option value="'+country.code+'">'+country.cn_name+'</option>';
                        }
                        $('#country').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }

            });
        }
    });

    weego_city.EditCityView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDetailDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function () {
            var _this = this;
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var template = Handlebars.compile($("#city_edit_template").html());
            _this.model.set('user',weego_user.globalUser);
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'click #addlabel':'addlabel',
            'click #addTip':'addTip',
            'click #addIntr':'addIntr',
            'click #addTra':'addTra',
            'focus .labels':'autogetMasterLabel',
            'focus #masterLabel':'autogetMasterLabel',
            'focus #addRestagValue':'autogetRestag',
            'focus #addShoptagValue':'autogetShoptag',
            'focus #addActivitytagValue':'autogetActivitytag',
            'click #addRestag': 'addRestag',
            'click #addShoptag': 'addShoptag',
            'click #addActivitytag': 'addActivitytag',
            'click #addRecomment': 'addRecomment',
            'click .del':'dellabel',
            'click .recdel':'recdellabel',
            'click .li-del': 'delLi',
            'click .delTip':'delTip',
            'click .delIntr':'delIntr',
            'click .delTra':'delTra',
            'change #continents':'selectCountry',
            'click .editwords':'editwords',
            'click .textareasurebtn':'textareasure'
        },
        textareasure:function (e){
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords:function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        delLi: function (e) {
            $(e.target).parent().remove();
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        recdellabel:function (e) {
            $(e.target).parents('.recomments-group').remove();
        },delTip:function (e) {
            $(e.target).parents('.tip-control').remove();
        },
        delTra:function (e) {
            $(e.target).parents('.tra-control').remove();
        },
        delIntr:function (e) {
            $(e.target).parents('.intr-control').remove();
        },
        autogetMasterLabel:function (e) {
            var _this = this;
            if ($(e.target).attr('id') == 'masterLabel') {
                $("#masterLabel").autocomplete({
                    source:function (request, response) {
                        $.ajax({
                            url:"/getLabelByLevel/1",
                            dataType:"json",
                            data:request,
                            success:function (data) {
                                response(
                                    $.map(
                                        data.label, function (item) {
                                            return {
                                                label:item.label,
                                                value:item.label,
                                                masterLbale_id:item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select:function (event, ui) {
                        $(e.target).attr('data-value', ui.item.masterLbale_id);
                    }
                });
            } else {
                $(".labels").autocomplete({
                    source:function (request, response) {
                        $.ajax({
                            url:"/getLabelByLevel/1",
                            dataType:"json",
                            data:request,
                            success:function (data) {
                                response(
                                    $.map(
                                        data.label, function (item) {
                                            return {
                                                label:item.label,
                                                value:item.label,
                                                sublevel_id:item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select:function (event, ui) {
                        $(e.target).attr('data-value', ui.item.sublevel_id);
                    }
                });
            }
        },
        //餐馆一级标签、查询和新增
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
        addRestag: function () {
            var label = $('#addRestagValue').val();
            var itemId = $('#addRestagValue').attr('data-value');
            //var cover_image = $('#addRestagValue').attr('data-value1');
            //var desc = $('#addRestagValue').attr('data-value2');
            var en_name = $('#addRestagValue').attr('data-enname');
            if (itemId && label) {
                var $newitem = $('<li style="display: inline"><input class="input-xlarge focused restags" readonly style="width:100px" name="Restags" ' +
                    'type="text" value="' + label + '" data-value="' + itemId + '" data-enname="' + en_name + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#restag-list').last().after($newitem);
            } else {
                alert('请不手动输入！');
            }
        },
         //购物一级标签、查询和新增
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
                                            en_name: item.en_name
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addShoptagValue").attr('value', ui.item.label);
                    $("#addShoptagValue").attr('data-value', ui.item._id);
                    $("#addShoptagValue").attr('data-enname', ui.item.en_name);
                }
            });

        },
             //城市活动查询
        autogetActivitytag: function (e) {
             var _this = this;
            var type ='all';
            var key = $('#addActivitytagValue').val();
            $("#addActivitytagValue").autocomplete({
                source: function (request, response) {
                    key = $('#addActivitytagValue').val();
                    $.ajax({
                        url: "/getCityactivitytagsByType/" + type + "/" + key,
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

                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addActivitytagValue").attr('value', ui.item.label);
                    $("#addActivitytagValue").attr('data-value', ui.item._id);

                }
            });

        },
        addShoptag: function () {
            var label = $('#addShoptagValue').val();
            var itemId = $('#addShoptagValue').attr('data-value');

            var en_name = $('#addShoptagValue').attr('data-enname');
            if (itemId && label) {
                var $newitem = $('<li><input class="input-xlarge focused shoptags" readonly style="width:100px" name="Shoptags" ' +
                    'type="text" value="' + label + '" data-value="' + itemId + '" data-enname="' + en_name + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#shoptag-list').last().after($newitem);
            } else {
                alert('请不手动输入！');
            }
        },
        addActivitytag: function () {
            var label = $('#addActivitytagValue').val();
            var itemId = $('#addActivitytagValue').attr('data-value');

            if (itemId && label) {
                var $newitem = $('<li><input class="input-xlarge focused activitytags" readonly style="width:100px" name="Activitytags" ' +
                    'type="text" value="' + label + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#activitytag-list').last().after($newitem);
            } else {
                alert('请不手动输入！');
            }
        },
        //修改最佳推荐
        addRecomment: function () {//增加最佳推荐
            //alert('Table2');
            var $newlabel = $('<div class="control-group recomments-group"><label class="control-label"  for="label2"><font  color="green">新增最佳推荐</font></label><div class="controls">' +
                ' 类型:<input class="input-xlarge focused recomments labels" name="test" id="masterLabel" data-value="{{_id}}" style="width:8%" type="text">' +
                //' :<input class="input-xlarge focused recomments" name="_id" style="width:8%" type="text">' +
                'title: <input class="input-xlarge focused recomments" name="title" style="width:10%"   type="text"  >' +
                '&nbsp; title_en: <input class="input-xlarge focused recomments" name="title_en" style="width: 20%"  type="text"  ><br>' +
                '&nbsp;description: <textarea class="input-xlarge focused recomments" name="description"  style="width:30%" ></textarea>' +
                'description_en: <textarea class="input-xlarge focused recomments" name="description_en"  style="width:30%" ></textarea>' +
                '<input type="button" value="删除" class="recdel"></div></div>');
            $('.recomments-group').last().after($newlabel);

        },
        showCityLocations:function () {
            locationCity();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label"></label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        addTip:function () {
            var $newtip = $('<div class="controls tip-control"><input class="input-xlarge focused tipItemTitle"  name="tipItemTitle" data-value="" type="text" id="tipItemTitle">'+
                '<input type="button" value="删除" class="delTip"><textarea class="tipItemContent" id="tipItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.tip-control').last().after($newtip);
        },
        addTra:function () {
            var $newtra = $('<div class="controls tra-control"><input class="input-xlarge focused traItemTitle"  name="traItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delTra"><textarea class="traItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.tra-control').last().after($newtra);
        },
        addIntr:function () {
            var $newintr = $('<div class="controls intr-control"><input class="input-xlarge focused intrItemTitle"  name="intrItemTitle" data-value="" type="text" >'+
                '<input type="button" value="删除" class="delIntr"><textarea class="intrItemContent" style="width:80%;height:50px"></textarea></div>');
            $('.intr-control').last().after($newintr);
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            var array_tips = [];
            for (var i = 0; i < $('.tipItemTitle').length; i++) {
                var tipItem = {};
                tipItem.tipItemTitle = $('.tipItemTitle').eq(i).val();
                tipItem.tipItemContent = $('.tipItemContent').eq(i).val();
                array_tips.push(tipItem);
            }
            var array_tra = [];
            for (var i = 0; i < $('.traItemTitle').length; i++) {
                var traItem = {};
                traItem.traItemTitle = $('.traItemTitle').eq(i).val();
                traItem.traItemContent = $('.traItemContent').eq(i).val();
                array_tra.push(traItem);
            }
            var array_intr = [];
            for (var i = 0; i < $('.intrItemTitle').length; i++) {
                var intrItem = {};
                intrItem.intrItemTitle = $('.intrItemTitle').eq(i).val();
                intrItem.intrItemContent = $('.intrItemContent').eq(i).val();
                array_intr.push(intrItem);
            }
            var regroup = $(".recomments-group");
            var array_retext = [];
            for (var i = 0; i < regroup.length; i++) {//最佳推荐
                var Element = regroup.eq(i);
                var name_t= Element.find("input[name=test]").val();
                var _id_T =Element.find("input[name=test]").attr('data-value');
                var title_T = Element.find("input[name=title]").val();
                var title_en_T = Element.find("input[name=title_en]").val();
                var description_T = Element.find("textarea[name=description]").val();
                var description_en_T = Element.find("textarea[name=description_en]").val();
                if (typeof(title_T) == 'undefined' || typeof(title_en_T) == 'undefined' || typeof(description_T) == 'undefined' || typeof(description_en_T) == 'undefined' || typeof(_id_T) == 'undefined') {
                    continue;
                }
                array_retext.push({_id:_id_T,name:name_t,title: title_T, title_en: title_en_T, description: description_T, description_en: description_en_T});
            }

            var res1 = [];
            for (var i = 0; i < $('.restags').length; i++) {
                var item = {};
                item._id = $('.restags').eq(i).attr('data-value');
                item.title = $('.restags').eq(i).attr('value');
                res1.push(item);
            }
            var shop1 = [];
            for (var i = 0; i < $('.shoptags').length; i++) {
                var item = {};
                item._id = $('.shoptags').eq(i).attr('data-value');
                item.title = $('.shoptags').eq(i).attr('value');
                shop1.push(item);
            }
            var activities1 = [];
            for (var i = 0; i < $('.activitytags').length; i++) {
                var item = {};
                item._id = $('.activitytags').eq(i).attr('data-value');
                item.title = $('.activitytags').eq(i).attr('value');
                activities1.push(item);
            }
            var recommand_center = {};
            recommand_center.name = $("#recommand_center_name").val();
            recommand_center.latitude = $("#recommand_center_latitude").val();
            recommand_center.longitude = $("#recommand_center_longitude").val();
            recommand_center._id = 'center';

            var dst=Number($("#dstOffset").val());
            var rawO= Number($("#rawOffset").val());
            var drs={};
            if(isNaN(dst)){
             alert('dstOffset必须是数值类型！');
                return false;
            }
            if(isNaN(rawO)){
                alert('rawOffset必须是数值类型！');
                return false;
            }
            drs.dstOffset=dst;
            drs.rawOffset=rawO;
            //修改数据
            var continents= $("#update_continents").val();
            var countryname=$("#update_countryname").val();
            var en_info={};
            if(continents==''){
             alert('continents不能为空！');
                return false;
            }
            if(countryname==''){
                alert('countryname不能为空！');
                return false;
            }
            //alert(continents+'##'+countryname);
            en_info.continents=continents;
            en_info.countryname=countryname;
            _this.model.save({
                continents:$("#continents option:selected").text(),
                continentscode:$("#continents").val(),
                cityname:$("#cityname").val(),
                cityname_en:$("#cityname_en").val(),
                cityname_py:$("#cityname_py").val(),
                countryname:$("#country option:selected").text(),
                countrycode:$("#country").val(),
                introduce:array_intr,
                short_introduce:$("#short_introduce").val(),
                restaurant_overview:$("#restaurant_overview").val(),
                shopping_overview:$("#shopping_overview").val(),
                attraction_overview:$("#attraction_overview").val(),
                timezone:drs,
                en_info:en_info,
                tips:array_tips,
                reslabels:res1,
                shoplabels:shop1,
                activity_labels:activities1,
                labels:array_retext,
                traffic:array_tra,
                recommand_day:$("#recommand_day").val(),
                recommand_indensity:$("#recommand_indensity").val(),
                recommand_center : recommand_center,
                hot_flag:$('input:radio[name="hot_flag"]:checked').val(),
                city_rank:$("#city_rank").val(),
                show_flag:$('input:radio[name="show_flag"]:checked').val(),
                label:array_label, masterLabel:$("#masterLabel").attr('data-value'),
                latitude:$("#latitude").val(),
                longitude:$("#longitude").val(),
                weoid:$("#weoid").val()
            }, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        alert('保存成功');
                        $("#attractionsDetailDialog").new_modal('hide');
                        weego_city.defaultView.getData(weego_city.currentPage);
                    }
                },
                error:function () {
                    console.log("tianjiashibai");
                }
            });
            return false;
        },
        selectCountry: function(){
            var continentCode =  $("#continents").val();
            $.ajax({
                url:"/getCountriesByContinent/"+continentCode,
                success:function (data) {
                    if(data.status){
                        var countries = data.countries;
                        var option = '';
                        for(var i=0;i<countries.length;i++){
                            var country = countries[i];
                            option +='<option value="'+country.code+'">'+country.cn_name+'</option>';
                        }
                        $('#country').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }

            });
        }
    });

    weego_city.CityView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    var template = Handlebars.compile($("#cityView").html());
                    _this.model.set('user',weego_user.globalUser);
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete',
            'click .upload':'upload',
            'click .upload_background_img':'upload_background_img',
            'click .upload_background_img_new':'upload_background_img_new',
            'click .upload_coverimg_new':'upload_coverimg_new'
        },
        modify:function (e) {
            var EditCityView = new weego_city.EditCityView();
            EditCityView.model = this.model;
            EditCityView.render().$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            initialize();
        },
        delete:function (e) {
            console.log("delete user");
            var _this = this;
            var isConfirmed = confirm("是否删除用户");
            if (isConfirmed) {
                this.model.destroy({
                    success:function (model, response) {
                        _this.$el.remove();
                    }
                });
            }
        },
        upload:function () {
            var manageCoverImageView = new weego_city.ManageCoverImageView();
            manageCoverImageView.model = this.model;
            manageCoverImageView.render().$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            manageCoverImageView.unloadPic();
        },
        upload_coverimg_new: function () {
            var managePgcImageViewTest = new CityCoverImageView();
            managePgcImageViewTest.model = this.model;
            managePgcImageViewTest.render().$el.new_modal({
                "show": true,
                "z_index": weego.z_index++
            });
            managePgcImageViewTest.unloadPic();
        },
        upload_background_img_new: function () {
            var managePgcImageViewTest = new CityBackgroundImageView();
            managePgcImageViewTest.model = this.model;
            managePgcImageViewTest.render().$el.new_modal({
                "show": true,
                "z_index": weego.z_index++
            });
            managePgcImageViewTest.unloadPic();
        },
        upload_background_img:function () {
            var manageBackgroundImageView = new weego_city.ManageBackgroundImageView();
            manageBackgroundImageView.model = this.model;
            manageBackgroundImageView.render().$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            manageBackgroundImageView.unloadPic();
        }
    });
    //背景图开始
    var CityBackgroundImageView = Backbone.View.extend({
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
            var template = Handlebars.compile($('#manageTempView').html());
            $(template()).appendTo(_this.$el);
            var type = _this.model.get('type');

            _this.$('#zxx_id_Temp').val(_this.model.get('_id'));
            _this.$('#_type_Temp').val(type);
            imgForlder = 'citypathforApp';
            var image = _this.model.get('imgforapp');
            if (image && image.length > 0) {
                var uploadPgcViewLife = new UploadCityViewLife();
                uploadPgcViewLife.model = {_id: image, imgForlder: imgForlder, type: "citys", num: 0};
                //uploadPgcViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
                uploadPgcViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
                url: '/postCityImage',
                type: 'citys',
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
    var UploadCityViewLife = Backbone.View.extend({
        tagName: 'li',
        "id": "uploaditem",
        initialize: function () {
            _.bindAll(this, 'render', 'remove');
        },
        render: function () {
            var _this = this;
            var template = Handlebars.compile($('#uploadTempView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events: {
            'click .btn-remove': 'remove',
        },
        remove: function (e) {
            var _this = this;
            var _id = $('#zxx_id_Temp').val();
            $.ajax({
                url: '/delUploadCiytImage/' + _id + '/' + _this.model._id,
                success: function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    //背景图结束

    // 封面图开始
    var CityCoverImageView = Backbone.View.extend({
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
            var template = Handlebars.compile($('#manageTempView').html());
            $(template()).appendTo(_this.$el);
            var type = _this.model.get('type');

            _this.$('#zxx_id_Temp').val(_this.model.get('_id'));
            _this.$('#_type_Temp').val(type);
            imgForlder = 'imgsizeC2';
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                var uploadPgcViewLife = new UploadCityViewLife();
                uploadPgcViewLife.model = {_id: image[i], imgForlder: imgForlder, type: "citys", num:image.length-1};
                //uploadPgcViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
                uploadPgcViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
                url: '/postCityCoverImage',
                type: 'citys',
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
    //封面图结束
    weego_city.ManageBackgroundImageView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"manageImageDialog",
        initialize:function () {
            _.bindAll(this, 'render');
        },
        render:function () {
            var _this = this;
            this.$el.css({
                width:"100%",
                height:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var template = Handlebars.compile($('#manageBackgroundImageView').html());
            $(template()).appendTo(_this.$el);
            _this.$('#city_id').val(_this.model.get('_id'));
            var image = _this.model.get('imgforapp');
            //var image = _this.model.get('backgroundimage');
            if (image && image.length > 0) {
                //for (var i = 0; i < image.length; i++) {
                    var uploadBackgroundImageView = new weego_city.UploadBackgroundImageView();
                    uploadBackgroundImageView.model = image;
                    uploadBackgroundImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            //}
            return this;
        },
        unloadPic:function () {
            var _this = this;
            var oBtn = document.getElementById("unloadPic");
            var oShow = document.getElementById("uploadedName");
            new AjaxUpload(oBtn, {
                action:"/citypic/upload_background_img",
                name:"upload",
                data:{
                    _id:_this.$('#city_id').val()
                },
                responseType:"json",
                onSubmit:function (file, ext) {
                },
                onComplete:function (file, response) {
                    var uploadBackgroundImageView = new weego_city.UploadBackgroundImageView();
                    uploadBackgroundImageView.model = response;
                    uploadBackgroundImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            });
        }
    });
    weego_city.UploadBackgroundImageView = Backbone.View.extend({
        tagName:'li',
        initialize:function () {
            _.bindAll(this, 'render', 'remove');
        },
        render:function () {
            var _this = this;
            var template = Handlebars.compile($('#cityUploadImageView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .btn-remove':'remove'
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#city_id').val();
            $.ajax({
                url:'/delBackgroundImage/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    //城市封面图片管理
    weego_city.ManageCoverImageView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"manageImageDialog",
        initialize:function () {
            _.bindAll(this, 'render');
        },
        render:function () {
            var _this = this;
            this.$el.css({
                width:"100%",
                height:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position:'relative'
            });
            var template = Handlebars.compile($('#manageCoverImageView').html());
            $(template()).appendTo(_this.$el);
            _this.$('#city_id').val(_this.model.get('_id'));
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadCoverImageView = new weego_city.UploadCoverImageView();
                    uploadCoverImageView.model = image[i];
                    uploadCoverImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('coverImageName');
            if(coverImageName){
                _this.$('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/city/imgsizeC2/'+coverImageName+'?rev='+Math.random()+'">'));
            }
            return this;
        },
        unloadPic:function () {
            var _this = this;
            var oBtn = document.getElementById("unloadPic");
            var oShow = document.getElementById("uploadedName");
            new AjaxUpload(oBtn, {
                action:"/citypic/upload",
                name:"upload",
                data:{
                    _id:_this.$('#city_id').val()
                },
                responseType:"json",
                onSubmit:function (file, ext) {
                },
                onComplete:function (file, response) {
                    var uploadCoverImageView = new weego_city.UploadCoverImageView();
                    uploadCoverImageView.model = response;
                    uploadCoverImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            });
        }
    });
    weego_city.UploadCoverImageView = Backbone.View.extend({
        tagName:'li',
        initialize:function () {
            _.bindAll(this, 'render', 'remove');
        },
        render:function () {
            var _this = this;
            var template = Handlebars.compile($('#uploadCoverImageView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .btn-remove':'remove',
            'click .setCoverImg':'setCoverImg'
        },
        setCoverImg:function () {
            var _this = this;
            var _id = $('#city_id').val();
            $.ajax({
                url:'/setCityCoverImg/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data) {
                        $('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/city/imgsizeC2/' + data + '?rev=' + Math.random() + '">'));
                    }
                }
            });
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#city_id').val();
            $.ajax({
                url:'/delCoverImage/' + _id + '/' + _this.model,
                success:function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    weego_city.AppView = Backbone.View.extend({
        el:'#app',
        query:{},
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendCity', 'addCity', 'getData');
            this.collection = new weego_city.CityCollection();
            this.collection.on('add', this.appendCity);
        },
        render:function () {
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#cityappView").html());
            $(template({user:weego_user.globalUser})).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addCityButton':'addCity',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage',
            'click #search-city-button':'search'
        },
        search:function(){
            var country = $('#search-country-cityname').val();
            var cityname = $('#search-cityname-cityname').val();
            self.location = '#city/1/q_'+country+'/q_'+cityname;
        },
        addCity:function () {
            new weego_city.AddCityDetailView().render(this).$el.new_modal({
                "show":true,
                "z_index":weego_city.z_index++
            });
            initialize();
        },
        appendCity:function (city) {
            var cityView = new weego_city.CityView();
            cityView.model = city;
            cityView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if (weego_city.currentPage >= weego_city.sumpages) {
                alert("没有下一页");
                return;
            }
            weego_city.currentPage = parseInt(weego_city.currentPage) + 1;
            self.location = "#city/" + weego_city.currentPage+'/q_'+this.query.country+'/q_'+this.query.cityname;
        },
        prePage:function () {
            if (weego_city.currentPage > 1) {
                weego_city.currentPage = parseInt(weego_city.currentPage) - 1;
                self.location = "#city/" + weego_city.currentPage+'/q_'+this.query.country+'/q_'+this.query.cityname;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index,query) {
            this.query = query;
            var _this = this;
            $.ajax({
                url:'/getCityByPage/' + weego_city.limit + '/' + _index+'?country='+query.country+'&cityname='+query.cityname,
                type:'GET',
                success:function (data) {
                    weego_city.count = data.count;
                    if (data && data.city && data.city.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        _this.$('#allcityno').html(weego_city.count);
                        _this.$('#current_page').html(weego_city.currentPage);
                        weego_city.sumpages = Math.ceil(weego_city.count / weego_city.limit);
                        _this.$('#sum_page').html(weego_city.sumpages);
                        for (var i = 0; i < data.city.length; i++) {
                            _this.collection.add(new weego_city.CityModel({cityname:data.city[i].cityname, introduce:data.city[i].introduce, location:data.city[i].location, _id:data.city[i]._id}));
                        }
                    } else {
                        if (weego_city.currentPage == 1) {
                            _this.render();
                            _this.$('#allcitysno').html('0');
                            _this.$('#current_page').html('1');
                            _this.$('#sum_page').html('1');
                            alert("暂时没有城市");
                        } else {
                            alert("无下一页");
                            weego_city.currentPage--;
                        }
                    }
                    if(!isNull(query.country)){
                        _this.$('#search-country-cityname').attr('value',query.country);
                    }
                    if(!isNull(query.cityname)){
                        $('#search-cityname-cityname').val(query.cityname);
                    }
                }
            });
        }
    });
    var geocoder;
    var map;
    var city_location;
    var marker;
    var city_location;

    function initialize() {
        // geocoder = new google.maps.Geocoder();
        // var latlng;
        // if ($("#latitude").val() != '' && $("#longitude").val() != '') {
        //     latlng = new google.maps.LatLng(parseFloat($("#latitude").val()), parseFloat($("#longitude").val()));
        // } else {
        //     latlng = new google.maps.LatLng(39.924482, 116.408386);
        // }

        // var mapOptions = {
        //     zoom:9,
        //     center:latlng,
        //     mapTypeId:google.maps.MapTypeId.ROADMAP
        // }
        // map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        // var marker = new google.maps.Marker({
        //     position:latlng,
        //     map:map,
        //     title:'Hello World!'
        // });
    }

    function locationCity() {
        var address = document.getElementById('cityname').value;
        geocoder.geocode({ 'address':address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                city_location = results[0].geometry.location;
                var latlng = new google.maps.LatLng(city_location.lat(), city_location.lng());
                $("#latitude").val(city_location.lat());
                $("#longitude").val(city_location.lng());
                var mapOptions = {
                    zoom:9,
                    center:latlng,
                    mapTypeId:google.maps.MapTypeId.ROADMAP
                }
                map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
                var marker = new google.maps.Marker({
                    position:latlng,
                    map:map,
                    title:'Hello World!'
                });
            }
        });
    }

}(weego_city));
