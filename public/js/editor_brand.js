/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var BrandModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/brand'
});
var BrandCollection = Backbone.Collection.extend({
    url: '/brands/' + this.pageLimit + '/' + this.currentPage,
    model: BrandModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.brands;
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
        this.url = '/brands/' + limit + '/' + pageIndex + '/' + type;
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
    getbrandInfo: function(cityname,areaname,type,successCallback){
        this.url ='/getbrandssByName/?cityname=' + cityname + '&areaname=' + areaname+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var BrandView = Backbone.View.extend({
    template: Handlebars.compile($('#brandDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#brandDetailView').html());
    },
    events: {
        'click #save': 'saveBrand',
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
    saveBrand: function (e) {
        var title = this.getTextInputValue('brand-title');
        if (title == '' || title == null || title == undefined) {
            alert('名称不能为空！');
            return false;
        }
        var brandDetails = {
            title: title,
            type: this.getTextInputValue('brand-property-type'),
            advice: this.getTextInputValue('brand-advice'),
            //desc: this.getTextInputValue('brand-desc') ,
            desc: this.getTextInputValue('brand-desc')
        }
        if (this.model == null || this.model.get('_id') == null) {
            //alert('6:'+brandDetails.title+'#'+brandDetails.type+'#'+brandDetails.desc);
            this.model = new BrandModel(brandDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(brandDetails, {
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

var BrandListView = Backbone.View.extend({
    template: Handlebars.compile($('#brand-list-view').html()),
    events: {
        'click #brand-list-prev-page': 'showPrevPage',
        'click #brand-list-next-page': 'showNextPage',
        'click #search-brand-button': 'brandButton',
        'change #brand_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new BrandCollection();
        this.collection.on('all', function () {
            $('#brand-list-current-page').html(that.collection.currentPage);
            $('#brand-list-total').html(that.collection.total);
            $('#brand-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    brandButton: function () {
        var cityname = $('#search-cityname-cityname').val();
        var name = $('#search-name-name').val();
        var type = $('#brand_type').val();
        var that = this;
        this.collection.getbrandInfo(cityname,name,type, function (collection)  {
            that.showBrandList(collection);
        })
    },
    selectType: function () {
        var type = $('#brand_type').val();
        self.location = '#brands/1/' + type;
    },
    showBrandList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var brandListItemView = new BrandListItemView({model: model});
            brandListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showBrandList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('brands/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('brands/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showBrandList(collection);
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

var BrandListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#brand-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #brand-list-item-edit': 'editBrand',
        'click #brand-list-item-remove': 'removeBrand',
        'click #brand-list-item-image':'manageImage'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editBrand: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeBrand: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    },
    manageImage:function(){
        var manageBrandImageViewTest=new ManageBrandImageViewTest();
        manageBrandImageViewTest.model = this.model;
        manageBrandImageViewTest.render().$el.new_modal({
            "show":true,
            "z_index": weego.z_index++
        });
        manageBrandImageViewTest.unloadPic();
    }
});
var ManageBrandImageViewTest = Backbone.View.extend({
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
        var image = _this.model.get('cover_image');
        if (image && image.length > 0) {
            var uploadBrandViewLife = new UploadBrandViewLife();
            uploadBrandViewLife.model = {_id: image, imgForlder: imgForlder,type:"brands",num:0};
            uploadBrandViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postBrandImage',
            type: 'brands',
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
var UploadBrandViewLife = Backbone.View.extend({
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
            url: '/delUploadBrandImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

