/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego = {
    init:function () {
    }
};
$(weego.init());
(function (weego) {
    weego.currentPage = 1;
    weego.limit = 20;
    weego.sumpages = 1;
    weego.count = 0;
    weego.GlobalRouter = Backbone.Router.extend({
        routes:{
            "city/:pageno":"city", //
            "*actions":"index"
        },
        city:function (pageno) {
            weego.currentPage = pageno;
            weego.defaultView = new weego.AppView();
            weego.defaultView.getData(weego.currentPage)
        },
        index:function () {
            weego.currentPage = 1;
            weego.defaultView = new weego.AppView();
            weego.defaultView.getData(weego.currentPage)
        }
    });

    weego.CityModel = Backbone.Model.extend({
        urlRoot:'/city',
        idAttribute:"_id"
    });
    weego.CityCollection = Backbone.Collection.extend({
        model:weego.CityModel
    });
    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    weego.AddCityDetailView = Backbone.View.extend({
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
            'focus .labels':'autogetMasterLabel',
            'click .del':'dellabel'
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        autogetMasterLabel:function (e) {
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
        },
        showCityLocations:function () {
            locationCity();
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            var newAttractions = new weego.CityModel({cityname:$("#cityname").val(), cityname_en:$("#cityname_en").val(), countryname:$("#countryname").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(), recommand_day:$("#recommand_day").val(), hot_flag:$('input:radio[name="hot_flag"]:checked').val(), show_flag:$('input:radio[name="show_flag"]:checked').val(), label:array_label, latitude:$("#latitude").val(), longitude:$("#longitude").val()});
            newAttractions.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        alert('保存成功');
                        $("#attractionsDialog").new_modal('hide');
                        _this.that.getData(weego.currentPage);
                    }
                },
                error:function () {
                    console.log("tianjiashibai");
                }
            });
            return false;
        }
    });

    weego.EditCityView = Backbone.View.extend({
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
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'click #addlabel':'addlabel',
            'focus .labels':'autogetMasterLabel',
            'focus #masterLabel':'autogetMasterLabel',
            'click .del':'dellabel'
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
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
        showCityLocations:function () {
            locationCity();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            _this.model.save({cityname:$("#cityname").val(), cityname_en:$("#cityname_en").val(), countryname:$("#countryname").val(), introduce:$("#introduce").val(), short_introduce:$("#short_introduce").val(), recommand_day:$("#recommand_day").val(), hot_flag:$('input:radio[name="hot_flag"]:checked').val(), show_flag:$('input:radio[name="show_flag"]:checked').val(), label:array_label, masterLabel:$("#masterLabel").attr('data-value'), latitude:$("#latitude").val(), longitude:$("#longitude").val()}, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        alert('保存成功');
                        $("#attractionsDetailDialog").new_modal('hide');
                        weego.defaultView.getData(weego.currentPage);
                    }
                },
                error:function () {
                    console.log("tianjiashibai");
                }
            });
            return false;
        }
    });

    weego.CityView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    var template = Handlebars.compile($("#cityView").html());
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete',
            'click .upload':'upload',
//            'click .upload_background_img':'upload_background_img',
//            'click .upload_left_img':'upload_left_img',
//            'click .upload_small_img':'upload_small_img',
//            'click .upload_right_middle_img':'upload_right_middle_img',
//            'click .upload_left_middle_img':'upload_left_middle_img'
            'click .upload_background_img':'upload_background_img'
        },
        modify:function (e) {
            var EditCityView = new weego.EditCityView();
            EditCityView.model = this.model;
            EditCityView.render().$el.new_modal({
                "show":true,
                "z_index":weego.z_index++
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
            var _this = this;
            $('#dialog').dialog({title:"封面图片"});
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'citypic/upload',
                debug:true,
                params:{
                    city_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        },
        upload_background_img:function () {
            var manageBackgroundImageView = new weego.ManageBackgroundImageView();
            manageBackgroundImageView.model = this.model;
            manageBackgroundImageView.render().$el.new_modal({
                "show":true,
                "z_index":weego.z_index++
            });
            manageBackgroundImageView.unloadPic();
        },
        upload_left_img:function () {
            var _this = this;
            $('#dialog').dialog({title:"前台界面左大图"});
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'citypic/upload_left_img',
                debug:true,
                params:{
                    city_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        },
        upload_small_img:function () {
            var _this = this;
            $('#dialog').dialog({title:"前台界面小图"});
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'citypic/upload_small_img',
                debug:true,
                params:{
                    city_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        },
        upload_right_middle_img:function () {
            var _this = this;
            $('#dialog').dialog({title:"前台界面左中图"});
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'citypic/upload_right_middle_img',
                debug:true,
                params:{
                    city_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        },
        upload_left_middle_img:function () {
            var _this = this;
            $('#dialog').dialog({title:"前台界面右中图"});
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'citypic/upload_left_middle_img',
                debug:true,
                params:{
                    city_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        }
    });
    weego.ManageBackgroundImageView = Backbone.View.extend({
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
                position: 'relative'
            });
            var template = Handlebars.compile($('#manageImageView').html());
            $(template()).appendTo(_this.$el);
            _this.$('#attractions_id').val(_this.model.get('_id'));
            var image = _this.model.get('image');
            if(image&&image.length>0){
                for(var i = 0;i<image.length;i++){
                    var uploadImageView = new weego.UploadImageView();
                    uploadImageView.model = image[i];
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('coverImageName');
            if(coverImageName){
                _this.$('#coverImageName').empty().append($('<img src="/attractionsimage/'+coverImageName+'?rev='+Math.random()+'">'));
            }
            return this;
        },
        unloadPic:function () {
            var _this = this;
            var oBtn = document.getElementById("unloadPic");
            var oShow = document.getElementById("uploadedName");
            new AjaxUpload(oBtn, {
                action:"/postimage",
                name:"upload",
                data: {
                    _id : _this.$('#attractions_id').val()
                },
                responseType:"json",
                onSubmit:function (file, ext) {
                },
                onComplete:function (file, response) {
                    var uploadImageView = new weego.UploadImageView();
                    uploadImageView.model = response;
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            });
        }
    });
    weego.UploadImageView = Backbone.View.extend({
        tagName:'li',
        initialize:function () {
            _.bindAll(this, 'render', 'remove' ,'setCoverImg');
        },
        render:function () {
            var _this = this;
            var template = Handlebars.compile($('#uploadImageView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .btn-remove':'remove',
            'click .setCoverImg':'setCoverImg'
        },
        setCoverImg:function(){
            var _this = this;
            var _id = $('#attractions_id').val();
            $.ajax({
                url:'/setCoverImg/' +_id+'/'+ _this.model,
                success:function (data) {
                    if (data) {
                        $('#coverImageName').empty().append($('<img src="/attractionsimage/'+data+'?rev='+Math.random()+'">'));
                    }
                }
            });
        },
        remove:function (e) {
            var _this = this;
            var _id = $('#attractions_id').val();
            $.ajax({
                url:'/delUploadImage/' +_id+'/'+ _this.model,
                success:function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    weego.AppView = Backbone.View.extend({
        el:'#app',
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendCity', 'addCity', 'getData');
            this.collection = new weego.CityCollection();
            this.collection.on('add', this.appendCity);
        },
        render:function () {
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#appView").html());
            $(template()).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addCityButton':'addCity',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },
        addCity:function () {
            new weego.AddCityDetailView().render(this).$el.new_modal({
                "show":true,
                "z_index":weego.z_index++
            });
            initialize();
        },
        appendCity:function (city) {
            var cityView = new weego.CityView();
            cityView.model = city;
            cityView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if (weego.currentPage >= weego.sumpages) {
                alert("没有下一页");
                return;
            }
            weego.currentPage = parseInt(weego.currentPage) + 1;
            self.location = "#city/" + weego.currentPage;
        },
        prePage:function () {
            if (weego.currentPage > 1) {
                weego.currentPage = parseInt(weego.currentPage) - 1;
                self.location = "#city/" + weego.currentPage;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index) {
            var _this = this;
            $.ajax({
                url:'/getCityByPage/' + weego.limit + '/' + _index,
                type:'GET',
                success:function (data) {
                    weego.count = data.count;
                    if (data && data.city && data.city.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        _this.$('#allcityno').html(weego.count);
                        _this.$('#current_page').html(weego.currentPage);
                        weego.sumpages = Math.ceil(weego.count / weego.limit);
                        _this.$('#sum_page').html(weego.sumpages);
                        for (var i = 0; i < data.city.length; i++) {
                            _this.collection.add(new weego.CityModel({cityname:data.city[i].cityname, introduce:data.city[i].introduce, location:data.city[i].location, _id:data.city[i]._id}));
                        }
                    } else {
                        if (weego.currentPage == 1) {
                            _this.render();
                            _this.$('#allcitysno').html('0');
                            _this.$('#current_page').html('1');
                            _this.$('#sum_page').html('1');
                            alert("暂时没有城市");
                        } else {
                            alert("无下一页");
                            weego.currentPage--;
                        }
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
        geocoder = new google.maps.Geocoder();
        var latlng;
        if ($("#latitude").val() != '' && $("#longitude").val() != '') {
            latlng = new google.maps.LatLng(parseFloat($("#latitude").val()), parseFloat($("#longitude").val()));
        } else {
            latlng = new google.maps.LatLng(39.924482, 116.408386);
        }

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

}(weego));