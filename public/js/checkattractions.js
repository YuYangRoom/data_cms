/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-6-5
 * Time: 上午9:51
 * To change this template use File | Settings | File Templates.
 */
var weego = {
    init:function () {

    }
};
$(weego.init());

(function (weego) {

    weego.GlobalRouter = Backbone.Router.extend({
        routes:{
            "city/:name/:pageno":"city_attractions",//
            "*actions":"index"
        },
        city_attractions:function (name,pageno) {
            weego.name = name
            weego.currentPage = pageno;
            weego.defaultView = new weego.AppView();
            weego.defaultView.getData(weego.currentPage,weego.name)
        },
        index:function(){
            weego.name = '';
            weego.currentPage = 1;
            weego.defaultView = new weego.AppView();
            weego.defaultView.getData(weego.currentPage,weego.name)
        }
    });
    weego.currentPage = 1;
    weego.sumpages = 1;
    weego.limit = 10;
    weego.z_index = 2000;
    weego.count=0;
    weego.name;
    weego.AttractionsModel = Backbone.Model.extend({
        urlRoot:'/checkattractions',
        idAttribute:"_id"
    });
    weego.AttractionsColletion = Backbone.Collection.extend({
//        url:'/getAllAttractions',
        model:weego.AttractionsModel
    });

    weego.LabelModel = Backbone.Model.extend({
        urlRoot:'/addlabel'
    });

    weego.CityModel = Backbone.Model.extend({
        urlRoot:''
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
    //edit city view
    weego.ShowAttractionsDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDetailDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function () {
            this.$el.css({
                width:"100%",
                left:0,
                right:0,
                top:0,
                bottom:0,
                margin:'auto',
                position: 'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#attractions_detail_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'change #cityname':'showCityLocations',
            'click #addlabel':'addlabel',
            'click .del':'dellabel',
            'click .del':'delcomment',
            'click .del':'addcomment',
            'focus .labels':'autoget',
            'focus #masterLabel':'autogetMasterLabel',
            'click #cancel':'cancel'
        },
        autogetMasterLabel:function(e){
            var _this = this;
            $( "#masterLabel" ).autocomplete({
                source: function(request,response){
                    $.ajax({
                        url:"/getLabelByLevel/1",
                        dataType:"json",
                        data:request,
                        success: function( data ) {
                            response(
                                $.map(
                                    data.label, function( item ) {
                                        return {
                                            label:item.label,
                                            value:item.label ,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function( event, ui ) {
                    $( "#masterLabel" ).attr('data-value',ui.item.sublevel_id);
                }
            });
        },
        autoget:function(e){
            var _this = this;
            $( ".labels" ).autocomplete({
                source: function(request,response){
                    $.ajax({
                        url:"/getLabelByLabelID/"+$("#masterLabel").attr('data-value'),
                        dataType:"json",
                        success: function( data ) {
                            response(
                                $.map(
                                    data.label, function( item ) {
                                        return {
                                            label:item.label,
                                            value:item.label ,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function( event, ui ) {
                    $(e.target).attr('data-value',ui.item.sublevel_id);
                }
            });
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addlabel:function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        savelabel:function (e) {
            console.log($(e.target).val());
            var _this = this;
            if ($(e.target).val() == '' || $(e.target).val() == null) {
                return false;
            } else {
                var newlabel = new weego.LabelModel({label:$(e.target).val()});
                newlabel.save(null, {
                    success:function (model, res) {
                        if (!res.isSuccess) {
                            console.log("cuole");
                        } else {
                            console.log(model.get('_id'));
                        }
                    }
                });
            }
        },
        delcomment:function (e) {
            $(e.target).parents('.comment-group').remove();
        },
        addcomment:function () {
            var $newcomment = $('<div class="control-group comment-group"><label class="control-comment" for="comment">评论</label><div class="controls">' +
                '<input class="input-xlarge focused comment" id="comment" name="comment" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.comment-group').last().after($newcomment);
        },
        //savecomment:function (e) {
        //    console.log($(e.target).val());
        //    var _this = this;
        //    if ($(e.target).val() == '' || $(e.target).val() == null) {
        //        return false;
        //    } else {
        //        var newlabel = new weego.LabelModel({label:$(e.target).val()});
        //        newlabel.save(null, {
        //            success:function (model, res) {
        //                if (!res.isSuccess) {
        //                    console.log("cuole");
        //                } else {
        //                    console.log(model.get('_id'));
        //                }
        //            }
        //        });
        //    }
        //},
        showCityLocations:function () {
            locationCity();
        },
        showLocations:function () {
            codeAddress();
        },
        save:function () {
            this.model.save({}, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                        alert('审核成功');
                        $("#attractionsDetailDialog").modal('hide');
                        weego.defaultView.getData(weego.currentPage,'');
                    }
                },
                error:function () {
                    console.log("审核失败");
                }
            });
            return false;
        },
        cancel:function(){
            $("#attractionsDetailDialog").modal('hide');
        }
    });

    weego.AttractionsView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    var template = Handlebars.compile($("#attractionsView").html());
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete',
            'click .upload':'upload',
            'click #manageimg':'manageimg'
        },
        manageimg:function(e){
            var manageImageView = new weego.ManageImageView();
            manageImageView.model = this.model;
            manageImageView.render().$el.modal({
                "show":true,
                "z_index":weego.z_index++
            });
            manageImageView.unloadPic();
        },
        modify:function (e) {
            var showAttractionsDetailView = new weego.ShowAttractionsDetailView();
            showAttractionsDetailView.model = this.model;
            showAttractionsDetailView.render().$el.modal({
                "show":true,
                "z_index":weego.z_index++
            });
            initialize();
        },
        delete:function (e) {
            var _this = this;
            var isConfirmed = confirm("是否删除???");
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
            $('#dialog').dialog();
            new qq.FileUploader({
                element:$('#dialog')[0],
                action:'upload',
                debug:true,
                params:{
                    attractions_id:_this.model.get('_id')
                },
                onComplete:function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        }
    });

    weego.ManageImageView = Backbone.View.extend({
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
            _this.$('#zxx_id').val(_this.model.get('_id'));
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
                    _id : _this.$('#zxx_id').val()
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
            var _id = $('#zxx_id').val();
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
            var _id = $('#zxx_id').val();
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
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendAttractions', 'addAttractions', 'getData');
            this.collection = new weego.AttractionsColletion();
            this.collection.on('add', this.appendAttractions);
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
            'click #addAttractionsButton':'addAttractions',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },
        addAttractions:function () {
            new weego.AttractionsDetailView().render(this).$el.modal({
                "show":true,
                "z_index":weego.z_index++
            });
            initialize();
        },
        appendAttractions:function (attractions) {
            var attractionsView = new weego.AttractionsView();
            attractionsView.model = attractions;
            attractionsView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if(weego.currentPage>=weego.sumpages){
                alert("没有下一页");
                return;
            }
            weego.currentPage = parseInt(weego.currentPage)+1;
            self.location = "#city/"+weego.name+"/"+weego.currentPage;
        },
        prePage:function () {
            if (weego.currentPage > 1) {
                weego.currentPage = parseInt(weego.currentPage)-1;
                self.location = "#city/"+weego.name+"/"+weego.currentPage;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index,name) {
            var _this = this;
            var cityname = name ||"";
            $.ajax({
                url:'/getAllUserCreateAttractionsByPage/' + weego.limit + '/' + _index+'/'+cityname,
                type:'GET',
                success:function (data) {
                    weego.count = data.count;
                    if (data && data.attractions && data.attractions.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        _this.$('#allattractionsno').html(weego.count);
                        _this.$('#current_page').html(weego.currentPage);
                        weego.sumpages = Math.ceil(weego.count/weego.limit);
                        _this.$('#sum_page').html(weego.sumpages);
                        for (var i = 0; i < data.attractions.length; i++) {
                            _this.collection.add(data.attractions[i]);
                        }
                    } else {
                        if (weego.currentPage == 1) {
                            _this.render();
                            _this.$('#allattractionsno').html('0');
                            _this.$('#current_page').html('1');
                            _this.$('#sum_page').html('1');
                            alert("没有景点");
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
        marker = new google.maps.Marker({
            position:latlng,
            map:map
        });
    }

    function locationCity() {
        var address = document.getElementById('cityname').value;
        geocoder.geocode({ 'address':address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                city_location = results[0].geometry.location;
                map.setCenter(results[0].geometry.location);
            }
        });
    }


    function codeAddress() {
        marker.setMap(null);
        var address = document.getElementById('attractions_en').value;
        geocoder.geocode({ 'address':address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $("#latitude").val(results[0].geometry.location.lat());
                $("#longitude").val(results[0].geometry.location.lat());
                map.setCenter(results[0].geometry.location);
                marker = new google.maps.Marker({
                    map:map,
                    position:results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

}(weego));
