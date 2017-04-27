/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var BannerModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/banner'
});
var BannerCollection = Backbone.Collection.extend({
    url: '/banners/' + this.pageLimit + '/' + this.currentPage,
    model: BannerModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.banners;
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
        this.url = '/banners/' + limit + '/' + pageIndex + '/' + type;
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
    }
});
//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var BannerView= Backbone.View.extend({
    template: Handlebars.compile($('#bannerDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#bannerDetailView').html());
    },
    events: {
        'click #save': 'saveBanner',
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
    saveBanner: function (e) {
        var ios_url = this.getTextInputValue('banner-ios_url')+ '';
        if (!ios_url) {
            alert("广告URL不能为空！");
            return false;
        } else if (ios_url.indexOf("www") < 0) {
            alert("广告URL地址有误！！！");
            return false;
        }
        var bannerDetails = {
            type: this.getTextInputValue('banner-property-type'),
            ios_url:ios_url ,
            android_url: this.getTextInputValue('banner-android_url')
        }
        if (this.model == null || this.model.get('_id') == null) {
            //alert('6:'+bannerDetails.title+'#'+bannerDetails.type+'#'+bannerDetails.desc);
            this.model = new BannerModel(bannerDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(bannerDetails, {
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

var BannerListView = Backbone.View.extend({
    template: Handlebars.compile($('#banner-list-view').html()),
    events: {
        'click #banner-list-prev-page': 'showPrevPage',
        'click #banner-list-next-page': 'showNextPage',
        'change #banner_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new BannerCollection();
        this.collection.on('all', function () {
            $('#banner-list-current-page').html(that.collection.currentPage);
            $('#banner-list-total').html(that.collection.total);
            $('#banner-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    selectType: function () {
        var type = $('#banner_type').val();
        self.location = '#banners/1/' + type;
    },
    showBannerList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var bannerListItemView = new BannerListItemView({model: model});
            bannerListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showBannerList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('banners/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('banners/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showBannerList(collection);
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

var BannerListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#banner-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #banner-list-item-edit': 'editBanner',
        'click #banner-list-item-remove': 'removeBanner',
        'click #banner-list-item-image_plus':'manageImage_plus',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editBanner: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeBanner: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    },
    manageImage_plus:function(){
        var manageBannerImageViewTest_plus=new ManageBannerImageViewTest_plus();
        manageBannerImageViewTest_plus.model = this.model;
        manageBannerImageViewTest_plus.render().$el.new_modal({
            "show":true,
            "z_index": weego.z_index++
        });
        manageBannerImageViewTest_plus.unloadPic();
    }
});
//iphone_plus
var ManageBannerImageViewTest_plus = Backbone.View.extend({
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
        var image = _this.model.get('iPhone6plus_image');
        if (image && image.length > 0) {
            var uploadBannerViewLife = new UploadBannerViewLife();
            uploadBannerViewLife.model = {image_type:'iphone_plus',_id: image, imgForlder: imgForlder,type:"banners",num:0};
            uploadBannerViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postBannerImage_plus',
            type: 'banners',
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
//android
var UploadBannerViewLife = Backbone.View.extend({

    tagName: 'li',
    "id": "uploaditem",
    initialize: function () {
        _.bindAll(this, 'render', 'remove');
    },
    render: function () {
        var _this = this;
        //var images_type=this.model.image_type;
        var template = Handlebars.compile($('#uploadTempView').html());
        $(template(_this.model)).appendTo(_this.$el);
        return this;
    },
    events: {
        'click .btn-remove': 'remove',
    },
    remove: function (e) {
        var _this = this;
        var images_type=this.model.image_type;
        //alert(images_type);
        //return false;
        var _id = $('#zxx_id_Temp').val();
        $.ajax({
            url: '/delUploadBannerImage/' + _id + '/' + _this.model._id+'/'+images_type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

