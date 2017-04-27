/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var PeopleModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/people'
});
var PeopleCollection = Backbone.Collection.extend({
    url: '/peoples/' + this.pageLimit + '/' + this.currentPage,
    model: PeopleModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.peoples;
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
        this.url = '/peoples/' + limit + '/' + pageIndex + '/' + type;
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
var PeopleView = Backbone.View.extend({
    template: Handlebars.compile($('#peopleDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#peopleDetailView').html());
    },
    events: {
        'click #save': 'savePeople',
        //'click #addPeople': 'addPeople',
        //'click .del': 'dellabel',
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
/*    dellabel: function (e) {
        $(e.target).parents('.peoples-group').remove();//POI删除
    },*/
/*    addPeople: function () {//人物信息
        var $newlabel = $('<div class="control-group peoples-group"><label class="control-label"  for="label2"><font  color="green">新增人物</font></label><div class="controls">' +
            '标题:<input class="input-xlarge focused peoples" name="title" style="width:8%"  placeholder="不超过15字" type="text" >' +
            ' 描述:<textarea class="input-xlarge focused peoples" name="desc"  style="width:20%" ></textarea>' +
            '图片序号: <input class="input-xlarge focused peoples" name="image_order" style="width:5%"  type="text">' +
            '<input type="button" value="删除" class="del"></div></div>');
        $('.peoples-group').last().after($newlabel);
    },*/
    savePeople: function (e) {
/*        var image_=[];
        var image_group=$(".image-group");
        //alert('***');
         for(var k=0;k<image_group.length;k++){
             var Element = image_group.eq(k);
             var imageId=Element.find("input[name=imageId]").val();
             var order=Element.find("input[name=order]").val();
           /!*  alert(imageId+'##3'+order);
             return false;*!/
             image_.push({imageId:imageId,order:order});
         }*/
/*     var people_tags=[];
         var group = $(".peoples-group");
         for (var i = 0; i < group.length; i++) {
         var Element = group.eq(i);
         var title = Element.find("input[name=title]").val();
         var desc = Element.find("textarea[name=desc]").val();
         var image_order = Element.find("input[name=image_order]").val();
                if (typeof(title) == 'undefined' || typeof(desc) == 'undefined' || typeof(image_order) == 'undefined') {
         continue;
         }
             people_tags.push({title: title, desc: desc, image_order: image_order});
                   }*/
         var cityname ={_id:'',name:''};
        cityname.name= this.getTextInputValue('people-city_name');
        var title = this.getTextInputValue('people-title');
        if (title == '' || title == null || title == undefined) {
            alert('人物姓名不能为空！');
            return false;
        }
        var peopleDetails = {
            username: title,
            //image_content:image_,
            type: this.getTextInputValue('people-property-type'),
            city_name:cityname,
            //simple_introduce:people_tags,
            job_desc: this.getTextInputValue('people-job_desc'),
            short_introduce: this.getTextInputValue('people-short_introduce')
        }
        if (this.model == null || this.model.get('_id') == null) {
            //alert('6:'+peopleDetails.title+'#'+peopleDetails.type+'#'+peopleDetails.desc);
            this.model = new PeopleModel(peopleDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(peopleDetails, {
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

var PeopleListView = Backbone.View.extend({
    template: Handlebars.compile($('#people-list-view').html()),
    events: {
        'click #people-list-prev-page': 'showPrevPage',
        'click #people-list-next-page': 'showNextPage',
        'change #people_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new PeopleCollection();
        this.collection.on('all', function () {
            $('#people-list-current-page').html(that.collection.currentPage);
            $('#people-list-total').html(that.collection.total);
            $('#people-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    selectType: function () {
        var type = $('#people_type').val();
        self.location = '#peoples/1/' + type;
    },
    showPeopleList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var peopleListItemView = new PeopleListItemView({model: model});
            peopleListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showPeopleList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('peoples/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('peoples/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showPeopleList(collection);
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

var PeopleListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#people-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #people-list-item-edit': 'editPeople',
        'click #people-list-item-remove': 'removePeople',
        'click #people-list-item-image':'manageImage',
        'click #people-list-item-head_image':'manageImage2',
        'click #life-list-item-peopleArray':'peopleArray'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editPeople: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removePeople: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    },
    manageImage:function(){
        var managePeopleImageViewTest=new ManagePeopleImageViewTest();
        managePeopleImageViewTest.model = this.model;
        managePeopleImageViewTest.render().$el.new_modal({
            "show":true,
            "z_index": weego.z_index++
        });
        managePeopleImageViewTest.unloadPic();
    },
    manageImage2:function(){
        var managePeopleImageViewTest2=new ManagePeopleImageViewTest2();
        managePeopleImageViewTest2.model = this.model;
        managePeopleImageViewTest2.render().$el.new_modal({
            "show":true,
            "z_index": weego.z_index++
        });
        managePeopleImageViewTest2.unloadPic();
    } ,
    peopleArray: function (e) {
        var manageMenuViewTest = new ManageMenuViewTest2();
        manageMenuViewTest.model = this.model;
        manageMenuViewTest.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        manageMenuViewTest.unloadPic();
    },
});
var ManageMenuViewTest2 = Backbone.View.extend({
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
        var menu = _this.model.get('simple_introduce');
        if (menu && menu.length > 0) {
            for (var i = 0; i < menu.length; i++) {
                var uploadMenuView = new UploadMenuViewLife2();
                uploadMenuView.model = {
                    _id: menu[i].image,
                    p_desc: menu[i].desc,
                    p_title: menu[i].title,
                    imgForlder: imgForlder,
                    type: 'people_picture',
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
            url: '/postLifeMenu2',
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
                                ' <strong>标题:</strong><textarea id="uploadP_title' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>描述:</strong> <textarea id="uploadP_desc' + i + '" class="upload_desc_list" style="height:50px;width:500px"></textarea>' +
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
var ManagePeopleImageViewTest = Backbone.View.extend({
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
            var uploadPeopleViewLife = new UploadPeopleViewLife();
            uploadPeopleViewLife.model = {_id: image, imgForlder: imgForlder,type:"peoples",num:0};
            uploadPeopleViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postPeopleImage',
            type: 'peoples',
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
var ManagePeopleImageViewTest2 = Backbone.View.extend({
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
        var image = _this.model.get('head_image');
        if (image && image.length > 0) {
            var uploadPeopleViewLife = new UploadPeopleViewLife_headImage();
            uploadPeopleViewLife.model = {_id: image, imgForlder: imgForlder,type:"peoples",num:0};
            uploadPeopleViewLife.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postPeopleHead_Image',
            type: 'peoples',
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
var UploadPeopleViewLife = Backbone.View.extend({
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
            url: '/delUploadPeopleImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

var UploadPeopleViewLife_headImage = Backbone.View.extend({
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
            url: '/delUploadPeopleHead_Image/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

var UploadMenuViewLife2 = Backbone.View.extend({
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
        var p_title = $('.txt-p_title' + num).val();
        //alert(_id+'##'+p_desc+'##'+p_title);
        $.ajax({
            type: 'POST',
            url: '/UpdateUploadMenu_people',
            data: {'_id': _id, 'name': _this.model._id, 'p_desc': p_desc, 'p_title': p_title},
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
            url: '/delUploadMenuLife_people/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});



