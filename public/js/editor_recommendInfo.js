/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var RecommendInfoModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/recommendInfo'
});
var RecommendInfoCollection = Backbone.Collection.extend({
    url: '/recommendInfos/' + this.pageLimit + '/' + this.currentPage,
    model: RecommendInfoModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.recommendInfos;
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
        this.url = '/recommendInfos/' + limit + '/' + pageIndex + '/' + type;
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
    getrecommendInfo: function(cityname,recommend_name,type,successCallback){
        this.url ='/getrecommendInfossByName/?cityname=' + cityname + '&recommend_name=' + recommend_name+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var RecommendInfoView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendInfoDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#recommendInfoDetailView').html());
    },
    events: {
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',
        'click #save': 'saveRecommendInfo',
        'click #cancel': 'back',
        'click #recommendInfo-list-item-image':'manageImage'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    manageImage:function(){
    var manageRecommendInfoImageViewTest=new ManageRecommendInfoImageViewTest();
    manageRecommendInfoImageViewTest.model = this.model;
    manageRecommendInfoImageViewTest.render().$el.new_modal({
        "show":true,
        "z_index": weego.z_index++
    });
    manageRecommendInfoImageViewTest.unloadPic();
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
        $("#city").val(cityname);
    },
    saveRecommendInfo: function (e) {
        var item={};
        var type = this.getTextInputValue('recommendInfo-property-type');
        var recommend_poi_lon = this.getTextInputValue('recommend_poi_lon').replace(/\s+/g, '');
        var recommend_poi_lat = this.getTextInputValue('recommend_poi_lat').replace(/\s+/g, '');
        //var recommend_poi_position = this.getTextInputValue('recommend_poi_position');
       /*  if(recommend_poi_lat==''||recommend_poi_lon==''){
                   alert('经纬度不可以为空！');
            return false;
        }*/
        if (recommend_poi_lon<-180 || recommend_poi_lon >180) {
            alert('经度的取值范围是(-180至180)！');
            return false;
        }
        if (recommend_poi_lat >90 || recommend_poi_lat <-90) {
            alert('纬度的取值范围是(-90至90)！');
            return false;
        }
        var recommend_poi_position=recommend_poi_lon+','+recommend_poi_lat;
        var recommend_radius = this.getTextInputValue('recommend_radius').replace(/\s+/g, '');
        var city_id = this.getTextInputValue('city_select');
        var city_name = this.getTextInputValue('city');
        var recommend_start_date_1 = this.getTextInputValue('recommend_start_date_1');
        var recommend_start_date=recommend_start_date_1.replace('年','').replace('月','').replace('日' ,'').trim();
        var date_s=recommend_start_date_1.replace('年','').replace('月','').replace('日' ,'').trim();

        var recommend_end_date_1 = this.getTextInputValue('recommend_end_date_1');
        var recommend_end_date=recommend_end_date_1.replace('年','').replace('月','').replace('日' ,'').trim();
        var date_e=recommend_end_date_1.replace('年','').replace('月','').replace('日' ,'').trim();
        if(recommend_start_date_1==''||recommend_end_date_1==''){
                    alert('推送开始日期和结束日期都不可以为空！！！');
            return false;
        }
        if(date_s>date_e){
            alert('错误提示：开始日期小于结束日期');
            return false;
        }
        var recommend_start_time = this.getTextInputValue('recommend_start_time');
        var recommend_end_time = this.getTextInputValue('recommend_end_time');
        //alert(recommend_start_time+'$$'+recommend_end_time);
         //alert(type+'#'+recommend_start_date+'#'+recommend_end_date+'#'+recommend_poi_position+'#'+recommend_radius);
        //推送内容
        var recommend_content_id = this.getTextInputValue('recommend_content_id').replace(/\s+/g, '');
        var recommend_content_title = this.getTextInputValue('recommend_content_title');
        var recommend_content_first = this.getTextInputValue('recommend_content_first');
        var recommend_content_second = this.getTextInputValue('recommend_content_second');
        var recommend_content_desc = this.getTextInputValue('recommend_content_desc');
        var recommend_content_url = this.getTextInputValue('recommend_content_url');
        var cover_image = this.getTextInputValue('cover_image');
        if(cover_image!=''){
            item.cover_image=cover_image;
        }
        item.recommend_content_id=recommend_content_id;
        item.recommend_content_title=recommend_content_title;
        item.recommend_content_first=recommend_content_first;
        item.recommend_content_second=recommend_content_second;
        item.recommend_content_desc=recommend_content_desc;
        item.recommend_content_url=recommend_content_url;
        //alert(recommend_content_id+'# '+recommend_content_title+'# '+recommend_content_first+'# '+recommend_content_second+'# '+recommend_content_desc+'# '+recommend_content_url+'# '+cover_image);
        //return false;
        var recommendInfoDetails = {
            type: type,
            city_id: city_id,
            city_name: city_name,
            recommend_poi_lat: recommend_poi_lat,
            recommend_poi_lon: recommend_poi_lon,
            recommend_start_date_1:recommend_start_date_1,
            recommend_start_date:recommend_start_date,
            recommend_end_date_1: recommend_end_date_1,
            recommend_end_date: recommend_end_date,
            recommend_start_time: recommend_start_time,
            recommend_end_time: recommend_end_time,
            recommend_poi_position: recommend_poi_position,
            recommend_radius: recommend_radius,
            //desc: this.getTextInputValue('recommendInfo-desc') ,
            item: item
        }
        if (this.model == null || this.model.get('_id') == null) {
            //alert('6:'+recommendInfoDetails.title+'#'+recommendInfoDetails.type+'#'+recommendInfoDetails.desc);
            this.model = new RecommendInfoModel(recommendInfoDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(recommendInfoDetails, {
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

var RecommendInfoListView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendInfo-list-view').html()),
    events: {
        'click #recommendInfo-list-prev-page': 'showPrevPage',
        'click #recommendInfo-list-next-page': 'showNextPage',
        'click #search-recommendInfo-button': 'recommendButton',
        'change #recommendInfo_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new RecommendInfoCollection();
        this.collection.on('all', function () {
            $('#recommendInfo-list-current-page').html(that.collection.currentPage);
            $('#recommendInfo-list-total').html(that.collection.total);
            $('#recommendInfo-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    recommendButton: function () {
        var cityname = $('#search-city_name-name').val();
        var recommend_name = $('#search-recommend-name').val();
        var type = $('#recommendInfo_type').val();
        var that = this;
        this.collection.getrecommendInfo(cityname,recommend_name,type, function (collection)  {
            that.showRecommendInfoList(collection);
        })
    },
    selectType: function () {
        var type = $('#recommendInfo_type').val();
        self.location = '#recommendInfos/1/' + type;
    },
    showRecommendInfoList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var recommendInfoListItemView = new RecommendInfoListItemView({model: model});
            recommendInfoListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showRecommendInfoList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('recommendInfos/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('recommendInfos/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showRecommendInfoList(collection);
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

var RecommendInfoListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#recommendInfo-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #recommendInfo-list-item-edit': 'editRecommendInfo',
        'click #recommendInfo-list-item-remove': 'removeRecommendInfo',

    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editRecommendInfo: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeRecommendInfo: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});
var ManageRecommendInfoImageViewTest = Backbone.View.extend({
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
        imgForlder = 'brands';
        var image = _this.model.get('recommend_content');
        //alert(image.cover_image);
        //return false;
        if (image.cover_image && image.cover_image.length > 0) {
            var uploadRecommendInfoViewLife = new UploadRecommendInfoViewLife();
            uploadRecommendInfoViewLife.model = {_id: image.cover_image, imgForlder: imgForlder,type:"recommendInfos",num:0};
            uploadRecommendInfoViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postRecommendInfoImage',
            type: 'recommendInfos',
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
var UploadRecommendInfoViewLife = Backbone.View.extend({
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
            url: '/delUploadRecommendInfoImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

