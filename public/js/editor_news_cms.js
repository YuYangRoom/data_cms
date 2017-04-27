/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var News_cmsModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/news_cms'
});
var News_cmsCollection = Backbone.Collection.extend({
    url: '/news_cmss/' + this.pageLimit + '/' + this.currentPage,
    model: News_cmsModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.news_cmss;
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
        this.url = '/news_cmss/' + limit + '/' + pageIndex + '/' + type;
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
    getnews_cmsInfo: function(areaname,successCallback){
        this.url ='/getnews_cmsssByName/?areaname=' + areaname;
        this.fetch({success: successCallback});
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var News_cmsView = Backbone.View.extend({
    template: Handlebars.compile($('#news_cmsDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#news_cmsDetailView').html());
    },
    events: {
        'click #save': 'saveNews_cms',
        'click #news_cms-list-item-image_desc': 'news_cmsDesc',
        'click #news_cms-list-item-image':'manageImage',
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
    news_cmsDesc: function (e) {
        var manageNews_CMS_Image = new ManageNews_CMS_Image();
        manageNews_CMS_Image.model = this.model;
        manageNews_CMS_Image.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageNews_CMS_Image.unloadPic();
    },
    manageImage:function(){
    var manageNews_cmsImageViewTest=new ManageNews_cmsImageViewTest();
    manageNews_cmsImageViewTest.model = this.model;
    manageNews_cmsImageViewTest.render().$el.new_modal({
        "show":true,
        "z_index": weego.z_index++
    });
    manageNews_cmsImageViewTest.unloadPic();
},
    saveNews_cms: function (e) {
        var lead = this.getTextInputValue('news_cms-lead');
        var image = this.getTextInputValue('news_cms-image');
        var news_cms_type = this.getTextInputValue('news_cms_type');
        var last_modify_time = this.getTextInputValue('news_cms-create_date');
        if(image==''){
           image='';
        }
        /*   if (lead == '' || lead == null || lead == undefined) {
         alert('lead为空！');
         }*/
        var news_cmsDetails = {
            type:news_cms_type,
            last_modify_time:last_modify_time,
            lead: lead,
            image: image,
            lead_text: this.getTextInputValue('news_cms-lead_text'),
        }
        if (this.model == null || this.model.get('_id') == null) {
            this.model = new News_cmsModel(news_cmsDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(news_cmsDetails, {
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

var News_cmsListView = Backbone.View.extend({
    template: Handlebars.compile($('#news_cms-list-view').html()),
    events: {
        'click #news_cms-list-prev-page': 'showPrevPage',
        'click #news_cms-list-next-page': 'showNextPage',
        'click #search-news_cms-button': 'news_cmsButton',
        'change #news_cms_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new News_cmsCollection();
        this.collection.on('all', function () {
            $('#news_cms-list-current-page').html(that.collection.currentPage);
            $('#news_cms-list-total').html(that.collection.total);
            $('#news_cms-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    news_cmsButton: function () {
        var name = $('#search-name-name').val();
        var that = this;
        this.collection.getnews_cmsInfo(name, function (collection)  {
            that.showNews_cmsList(collection);
        })
    },
    selectType: function () {
        var type = $('#news_cms_type').val();
        self.location = '#news_cmss/1/' + type;
    },
    showNews_cmsList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var news_cmsListItemView = new News_cmsListItemView({model: model});
            news_cmsListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showNews_cmsList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('news_cmss/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('news_cmss/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showNews_cmsList(collection);
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

var News_cmsListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#news_cms-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #news_cms-list-item-edit': 'editNews_cms',
        'click #news_cms-list-item-remove': 'removeNews_cms',

    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editNews_cms: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeNews_cms: function () {
        if(confirm('是否删除？')!=true){
            return false;
        }
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});
//上传新闻图片数组
var ManageNews_CMS_Image = Backbone.View.extend({
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
        //var type = _this.model.get('type');
        var type ="1";

        _this.$('#zxx_id_Temp').val(_this.model.get('_id'));
        _this.$('#_type_Temp').val(type);
        var imgForlder = 'restaurant';
        var menu = _this.model.get('news_content');
        if (menu && menu.length > 0) {
            for (var i = 0; i < menu.length; i++) {
                var uploadNews_Cms_View = new UploadNewsCMSViewLife2();
                uploadNews_Cms_View.model = {
                    _id: menu[i].image,
                    newsInfo_title: menu[i].title,
                    newsInfo_url: menu[i].url,
                    newsInfo_text: menu[i].text,
                    newsInfo_source: menu[i].source,
                    newsInfo_date: menu[i].date,
                    newsInfo_image_desc: menu[i].image_desc,
                    imgForlder: imgForlder,
                    type: 'pgcs_type',
                    num: i
                };
                uploadNews_Cms_View.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postNews_CMS_image_desc',
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
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            html = html + '<div id="uploadList_' + i + '" class="upload_append_list"><p><strong>' + file.name + '</strong>' +
                                '<a href="javascript:" class="upload_delete" title="删除" data-index="' + i + '">删除</a><br />' +
                                '<img id="uploadImage_' + i + '" src="' + e.target.result + '" class="upload_image" /></p>' +
                                ' <strong>新闻标题:</strong><textarea id="newsInfo_title' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>新闻URL:</strong><textarea id="newsInfo_url' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>新闻Text:</strong><textarea id="newsInfo_text' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>新闻来源:</strong><textarea id="newsInfo_source' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>新闻日期:</strong><textarea id="newsInfo_date' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>新闻图片描述:</strong><textarea id="newsInfo_image_desc' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                    //' <strong>描述:</strong> <textarea id="uploadP_desc' + i + '" class="upload_desc_list" style="height:50px;width:500px"></textarea>' +
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
var ManageNews_cmsImageViewTest = Backbone.View.extend({
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
        var image = _this.model.get('image');
        if (image && image.length > 0) {
            var uploadNews_cmsViewLife = new UploadNews_cmsViewLife();
            uploadNews_cmsViewLife.model = {_id: image, imgForlder: imgForlder,type:"brands",num:0};
            uploadNews_cmsViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postNews_cmsImage',
            type: 'news_cmss',
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
var UploadNews_cmsViewLife = Backbone.View.extend({
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
            url: '/delUploadNews_cmsImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});


//数组图片的删除操作、修改
var UploadNewsCMSViewLife2 = Backbone.View.extend({
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
        'click .btn-remove': 'remove_image',
        'click .btn-save': 'save'
    },
    save: function (e) {
        var _this = this;
        var num = _this.model.num;
        var _id = $('#zxx_id_Temp').val();
        var newsInfo_title = $('.txt-newsInfo_title' + num).val();
        var newsInfo_url = $('.txt-newsInfo_url' + num).val();
        var newsInfo_text = $('.txt-newsInfo_text' + num).val();
        var newsInfo_source = $('.txt-newsInfo_source' + num).val();
        var newsInfo_date = $('.txt-newsInfo_date' + num).val();
        var newsInfo_image_desc = $('.txt-newsInfo_image_desc' + num).val();
        //alert(_id+'##'+p_desc+'##'+p_title);

        $.ajax({
            type: 'POST',
            url: '/UpdateUploadNews_Cms_image_desc',
            data: {'_id': _id, 'name': _this.model._id, 'newsInfo_title': newsInfo_title,'newsInfo_url': newsInfo_url, 'newsInfo_text': newsInfo_text, 'newsInfo_source': newsInfo_source, 'newsInfo_date': newsInfo_date, 'newsInfo_image_desc': newsInfo_image_desc},
            success: function (data) {
                if (data.status == 'success') {
                    alert("修改成功!");
                }else{
                    alert("修改失败!");
                }
            }
        })
    },
    remove_image: function (e) {
        if(confirm('是否删除？')!=true){
            return false;
        }
        var _this = this;
        var _id = $('#zxx_id_Temp').val();
        $.ajax({
            url: '/delUpload_News_cms_image_desc/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});
