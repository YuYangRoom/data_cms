/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var ActivityModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/activity'
});
var ActivityCollection = Backbone.Collection.extend({
    url: '/activitys/' + this.pageLimit + '/' + this.currentPage,
    model: ActivityModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.activitys;
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
        this.url = '/activitys/' + limit + '/' + pageIndex + '/' + type;
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
    searchActivity2: function(cityname,areaname,type,successCallback){
        this.url ='/getActivitysByName/?cityname=' + cityname + '&areaname=' + areaname+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var ActivityView = Backbone.View.extend({
    template: Handlebars.compile($('#activityDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#activityDetailView').html());
    },
    events: {
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'click #save': 'saveActivity',
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
    saveActivity: function (e) {
        var title = this.getTextInputValue('activity-title');
        if (title == '' || title == null || title == undefined) {
            alert('名称不能为空！');
            return false;
        }
        var activity_city={};
        activity_city.cityname = this.getTextInputValue('cityname');
        activity_city._id = this.getTextInputValue('city_select');
        var activityDetails = {
            title: title,
            open_time: this.getTextInputValue('activity-open_time'),
            acttime: this.getTextInputValue('activity-acttime'),
            acturl: this.getTextInputValue('activity-acturl'),
            activity_city: activity_city,
            order_url: this.getTextInputValue('activity-order_url'),
            deaddress: this.getTextInputValue('activity-deaddress'),
            address: this.getTextInputValue('activity-address'),
            price: this.getTextInputValue('activity-price'),
            atype: this.getTextInputValue('activity-atype'),
            close_time: this.getTextInputValue('activity-close_time'),
            type: this.getTextInputValue('activity-property-type'),
            //desc: this.getTextInputValue('activity-desc') ,
            desc: this.getTextInputValue('activity-desc'),
            longitude: this.getTextInputValue('activity-longitude'),
            latitude: this.getTextInputValue('activity-latitude')
        }
        var start_timeTest=activityDetails.open_time;
        if(start_timeTest.indexOf('年')>=0){
            start_timeTest=start_timeTest.replace(/年|月|日/g, '').trim();
        }else {
            start_timeTest=start_timeTest.replace(/\//g, '').trim();
        }
        var end_timeTest= activityDetails.close_time;
        if(end_timeTest.indexOf('年')>=0){
            end_timeTest=end_timeTest.replace(/年|月|日/g, '').trim();
        }else{
            end_timeTest=end_timeTest.replace(/\//g, '').trim();
        }
        //alert(start_timeTest+'#####'+end_timeTest);
        if(start_timeTest>end_timeTest){
            alert('开始时间不能大于结束时间，重新输入！');
            return false;
        }
        //alert();
        if(activityDetails.latitude<-90||activityDetails.latitude>90||activityDetails.longitude>180||activityDetails.longitude<-180){
              alert('经纬度输入有误,请重新输入!\n经度的范围：-180-180、纬度的范围：-90-90');
            return false;
        }
        if (this.model == null || this.model.get('_id') == null) {
            this.model = new ActivityModel(activityDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加活动成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(activityDetails, {
                success: function () {
                    alert('修改活动成功');
                    window.history.back();
                }
            });
        }

        e.preventDefault();
        return false;
    }
});

var ActivityListView= Backbone.View.extend({

    template: Handlebars.compile($('#activity-list-view').html()),

    events: {
        'click #activity-list-prev-page': 'showPrevPage',
        'click #activity-list-next-page': 'showNextPage',
        'click #search-activity-button': 'wtf',
        'change #activity_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new ActivityCollection();
        this.collection.on('all', function () {
            $('#activity-list-current-page').html(that.collection.currentPage);
            $('#activity-list-total').html(that.collection.total);
            $('#activity-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },

    selectType: function () {
        var type = $('#activity_type').val();
        self.location = '#activitys/1/' + type;
    },

    showActivityList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var activityListItemView = new ActivityListItemView({model: model});
            activityListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showActivityList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('activitys/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('activitys/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showActivityList(collection);
        });
    },
    wtf: function () {
        var cityname = $('#search-city_name-city_name').val();
        var name = $('#search-name-name').val();
        var type = $('#activity_type').val();
        var that = this;
         this.collection.searchActivity2(cityname,name,type, function (collection)  {
            that.showActivityList(collection);
        })
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

var ActivityListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#activity-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #activity-list-item-edit': 'editActivity',
        'click #activity-list-item-remove': 'removeActivity',
        'click #activity-list-item-images_desc': 'images_desc',
        'click #activity-list-item-image':'manageImage'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editActivity: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeActivity: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    },

     images_desc: function (e) {//上传数组图片
        var manageMenuViewTest_images = new ManageMenuViewTest_images();
        manageMenuViewTest_images.model = this.model;
        manageMenuViewTest_images.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageMenuViewTest_images.unloadPic();
    },
    manageImage:function(){
        var manageActivityImageViewTest=new ManageActivityImageViewTest();
        manageActivityImageViewTest.model = this.model;
        manageActivityImageViewTest.render().$el.new_modal({
            "show":true,
            "z_index": weego.z_index++
        });
        manageActivityImageViewTest.unloadPic();
    }
});
//数组图片上传
var ManageMenuViewTest_images = Backbone.View.extend({
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
        //alert(type+'**********');
        _this.$('#zxx_id_Temp').val(_this.model.get('_id'));
        _this.$('#_type_Temp').val(type);
        var imgForlder = 'restaurant';
        var images = _this.model.get('images_desc');
        if (images && images.length > 0) {
            for (var i = 0; i < images.length; i++) {
                var uploadMenuView = new UploadActivityViewLife2();
                uploadMenuView.model = {
                    _id: images[i].image_id,
                    p_desc: images[i].desc,
                    image_desc: images[i].image_desc,
                    p_title: images[i].title,
                    imgForlder: imgForlder,
                    type: 'activity_picture',
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
            url: '/postLife_Activity',
            type: 'people_picture',
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
                                ' <strong>标题:</strong><textarea id="uploadP_title' + i + '" class="upload_advice_list" style="height:30px;width:200px"></textarea><br>' +
                                ' <strong>标题描述:</strong> <textarea id="uploadP_desc' + i + '" class="upload_desc_list" style="height:50px;width:300px"></textarea><br>' +
                                ' <strong>图片描述:</strong> <textarea id="uploadImage_desc' + i + '" class="upload_desc_list" style="height:50px;width:300px"></textarea>' +
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
var ManageActivityImageViewTest = Backbone.View.extend({
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
        imgForlder = 'activities';
        var image = _this.model.get('cover_image');
        if (image && image.length > 0) {
            var uploadActivityViewLife = new UploadActivityViewLife();
            uploadActivityViewLife.model = {_id: image, imgForlder: imgForlder,type:"activity",num:0};
            uploadActivityViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postActivityImage',
            type: 'activities',
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
var UploadActivityViewLife = Backbone.View.extend({
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
            url: '/delUploadActivityImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

//数组图片的删除操作、修改
var UploadActivityViewLife2 = Backbone.View.extend({
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
        var p_desc = $('.txt-p_desc' + num).val();
        var image_desc = $('.txt-image_desc' + num).val();
        var p_title = $('.txt-p_title' + num).val();
        //alert(_id+'##'+p_desc+'##'+p_title);
        $.ajax({
            type: 'POST',
            url: '/UpdateUploadActivity_image',
            data: {'_id': _id, 'name': _this.model._id, 'p_desc': p_desc,'image_desc': image_desc, 'p_title': p_title},
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
            url: '/delUploadActivity_image/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});
