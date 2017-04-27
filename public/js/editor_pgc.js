/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var PgcModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/pgc'
});
var PgcCollection = Backbone.Collection.extend({
    url: '/pgcs/' + this.pageLimit + '/' + this.currentPage,
    model: PgcModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.pgcs;
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
        this.url = '/pgcs/' + limit + '/' + pageIndex + '/' + type;
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
    searchPgc_info: function(cityname,areaname,type,successCallback){
        this.url ='/getPgcsByName/?cityname=' + cityname + '&areaname=' + areaname+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});


//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var PgcView = Backbone.View.extend({
    template: Handlebars.compile($('#pgcDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#pgcDetailView').html());
    },
    events: {
        'change #continents_select': 'selectContinent',
        'change #country_select': 'selectCountry',
        'change #city_select': 'selectCity',

        'click .del': 'dellabel',
        'focus #addPeopletagValue': 'autogetPeopletag',
        'click #addPeopletag': 'addPeopletag',
        'click #addRecomment': 'addRecomment',
        'click #save': 'savePgc',
        'click #cancel': 'back'
    },
    autogetPeopletag: function (e) {
        var _this = this;
        var type = $('#pgc-property-type').val();
        var key = $('#addPeopletagValue').val();
        if (key == "")key = "all";
        $("#addPeopletagValue").autocomplete({
            source: function (request, response) {
                key = $('#addPeopletagValue').val();
                if (key == "")key = "all";
                $.ajax({
                    url: "/getPeopletagsByType/" + type + "/" + key,
                    dataType: "json",
                    data: request,
                    success: function (data) {
                        response(
                            $.map(
                                data.result, function (item) {
                                    return {
                                        label: item.username,
                                        username: item.username,
                                        _id: item._id
                                    }
                                }));
                    }
                });
            },
            select: function (event, ui) {
                $("#addPeopletagValue").attr('value', ui.item.label);
                $("#addPeopletagValue").attr('data-value', ui.item._id);
                $("#addPeopletagValue").attr('data-value2', ui.item.username);
            }
        });
    },
    addPeopletag: function () {
        var label = $('#addPeopletagValue').val();
        var itemId = $('#addPeopletagValue').attr('data-value');
        var name = $('#addPeopletagValue').attr('data-value2');

        if (itemId && label) {
            var $newitem = $('<li><input class="input-xlarge focused peopletags" readonly style="width:100px" name="Peopletags" ' +
                'type="text" value="' + label + '" data-value="' + itemId + '"  data-value2="' + name + '"> <input type="button" value="删除" class="del"><li>');
            $('#peopletag-list').last().after($newitem);
        } else {
            alert('请不手动输入！');
        }
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
   dellabel: function (e) {
        $(e.target).parents('.recomments-group').remove();//POI删除
        $(e.target).parent().remove();
    },
    addRecomment: function () {//POI推荐信息
        var $newlabel = $('<div class="control-group recomments-group"><label class="control-label"  for="label2"><font  color="green">新增段落推荐</font></label><div class="controls">' +
            'POI的ID:<input class="input-xlarge focused " style="width:12%"  name="_id" type="text"  >' +
            '&nbsp;poi类型:&nbsp;<input class="input-xlarge focused "style="width:8px" maxlength="1" name="type"  type="text" >' +
            '&nbsp; 段落描述: <textarea class="input-xlarge focused comments" name="poi_desc"  style="width: 300px" ></textarea>' +
            '<input class="input-xlarge focused " name="poi_image"  placeholder="不需要手工填写" style="width:14%"  readonly  type="hidden"   >' +
            ' 段落标题:&nbsp;<textarea class="input-xlarge focused " name="poi_image_desc" style="width:200px" type="text"  ></textarea>' +
            '<input type="button" value="删除" class="del"></div></div>');
        $('.comments-group').last().after($newlabel);
    },
    savePgc: function (e) {
        var poi_tags = [];
        var group = $(".recomments-group");
        for (var i = 0; i < group.length; i++) {
            var Element = group.eq(i);
            var _id = Element.find("input[name=_id]").val();//poi的id
            var type = Element.find("input[name=type]").val();//poi类型
            var poi_desc = Element.find("textarea[name=poi_desc]").val();//段落描述
            var poi_image = Element.find("input[name=poi_image]").val();//poi图片
            var poi_image_desc = Element.find("textarea[name=poi_image_desc]").val();//段落标题
            if (typeof(_id) == 'undefined' || typeof(type) == 'undefined' || typeof(poi_desc) == 'undefined' || typeof(poi_image) == 'undefined' || typeof(poi_image_desc) == 'undefined') {
                continue;
            }

            if(_id.length!=24&&type!=''){
                 alert('ID没有关联poi，此时type必须为空！');
                return false;
            }
            var _id_2='';
            if(type==''&& _id.indexOf('****')<0){
                alert('type为空时、ID必须为****');
                return false;
            }
            if( _id.length==24&&type==''){
                alert('关联poi的时候、poi类型不能为空！');
                return false;
            }
            if(type==''&& _id.length==4){
                var date = new Date();
                  _id_2='****'+date.getTime();
            }else{
                _id_2=_id;
            }
            var poi_image_2='';
            var type_2='';
            var poi_desc_2='';
            var poi_image_desc_2='';

            if(type!=''){
                type_2=type;
            }
            if(poi_image!=''){
                poi_image_2=poi_image;
            }
            if(poi_desc!=''){
                poi_desc_2=poi_desc;
            }
            if(poi_image_desc!=''){
                poi_image_desc_2=poi_image_desc;
            }
            if (type == 0 || type == 1 || type == 2 || type == 3||type=='') {
                poi_tags.push({
                    _id: _id_2,
                    type: type_2,
                    poi_desc: poi_desc_2,
                    poi_image: poi_image_2,
                    poi_image_desc: poi_image_desc_2//段落标题
                });
            }
            else {
                alert('poi类型只能是0、1、2、3或者为空！' + '\n你输入的是:' + type);
                return false;
            }
        }
        if ($('.peopletags').length > 2) {
            alert('一个pgc只能关联一个人物！');
            return false;
        }
        for (var i = 0; i < $('.peopletags').length; i++) {
            var p_people = {};
            var id = $('.peopletags').eq(i).attr('data-value');
            var uname = $('.peopletags').eq(i).attr('data-value2');
            if (typeof(id) == 'undefined' || typeof(uname) == 'undefined') {
                p_people._id='';
                p_people.name='';
                continue;
            }
            p_people._id = id;
            p_people.name = uname;
        }
        var city = {};
        var original={};
        var c_start_time = this.getTextInputValue('pgc-c_start_time');
        var c_end_time = this.getTextInputValue('pgc-c_end_time');
        var    start_time=c_start_time.replace(/年/g, '').replace(/月/g, '').replace(/日/g, '');
        var    end_time =c_end_time.replace(/年/g, '').replace(/月/g, '').replace(/日/g, '');
        if(start_time>end_time){
           alert('开始日期能大于结束日期吗？？？');
            return false;
        }
        /*        alert(start_time+'##'+end_time);
         return false;*/
        //city
        var title = this.getTextInputValue('pgc-title');
        city.cityname = this.getTextInputValue('cityname');
        city._id = this.getTextInputValue('city_select');
        //original
        original.url=this.getTextInputValue('pgc-original-url');
        original.source=this.getTextInputValue('pgc-original-source');
        original.author=this.getTextInputValue('pgc-original-author');
        original.desc=this.getTextInputValue('pgc-original-desc');
        if (this.getTextInputValue('pgc-original-image').length == 29) {
            original.image = this.getTextInputValue('pgc-original-image');
        } else {
            original.image = "";
        }
        //alert(original.url+"##"+original.source+"##"+original.author+"##"+original.desc);
        //return false;
        //var city_type=city.cityname;
        //city._id = this.getTextInputValue('pgc-city');
        //alert(city.cityname);
        //return false;
        if (title == '' || title == null || title == undefined) {
            alert('PGC标题不能为空！');
            return false;
        }
        var type_info=this.getTextInputValue('pgc-property-type');
        var tags_info='';
        if(type_info=='1'){
            tags_info='品读·人物志';
        }
        if(type_info=='2'){
            tags_info='解构·城市元素';
        }
        if(type_info=='3'){
            tags_info='精选·下一站';
        }

        var pgcDetails = {
            title: title,
            pgc_city: city,
            c_start_time: c_start_time,
            start_time: start_time,
            c_end_time: c_end_time,
            end_time: end_time,
            type: this.getTextInputValue('pgc-property-type'),
            pgc_title: this.getTextInputValue('pgc-pgc_title'),
            pgc_country: this.getTextInputValue('pgc-pgc_country'),
            pgc_tags: tags_info,
            introducation: this.getTextInputValue('pgc-introducation'),
            content: this.getTextInputValue('pgc-content'),
            pgc_people: p_people,
            pgc_poi: poi_tags,
            original: original,
            //desc: this.getTextInputValue('pgc-desc') ,
            desc: this.getTextInputValue('pgc-desc')
        }

        if (this.model == null || this.model.get('_id') == null) {
            //alert('6:'+pgcDetails.title+'#'+pgcDetails.type+'#'+pgcDetails.desc);
            this.model = new PgcModel(pgcDetails);
            this.model.save({}, {
                success: function () {
                    alert('PGC添加成功');
                    window.history.back();
                }
            });
        }
        else {
            //alert('Hello hello hello !');
            this.model.save(pgcDetails, {
                success: function () {
                    alert('PGC修改成功');
                    window.history.back();
                }
            });
        }

        e.preventDefault();
        return false;
    }
});

var PgcListView = Backbone.View.extend({
    template: Handlebars.compile($('#pgc-list-view').html()),
    events: {
        'click #pgc-list-prev-page': 'showPrevPage',
        'click #pgc-list-next-page': 'showNextPage',
        'click #search_button_pgc': 'search_button_pgc',
        'change #pgc_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new PgcCollection();
        this.collection.on('all', function () {
            $('#pgc-list-current-page').html(that.collection.currentPage);
            $('#pgc-list-total').html(that.collection.total);
            $('#pgc-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    search_button_pgc: function () {
        var cityname = $('#search-pgc-city_name').val();
        var name = $('#search-pgc-name').val();
        var type = $('#pgc_type').val();
        var that = this;
        this.collection.searchPgc_info(cityname,name,type, function (collection)  {
            that.showPgcList(collection);
        })
    },
    selectType: function () {
        var type = $('#pgc_type').val();
        self.location = '#pgcs/1/' + type;
    },
    showPgcList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var pgcListItemView = new PgcListItemView({model: model});
            pgcListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showPgcList(collection);
        })
    },
    showPrevPage: function () {
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('pgcs/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('pgcs/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showPgcList(collection);
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

var PgcListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#pgc-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #pgc-list-item-edit': 'editPgc',
        'click #pgc-list-item-remove': 'removePgc',
        'click #pgc-list-item-image': 'manageImage',
        'click #pgc-list-item-originImage': 'originImage',
        'click #pgc-list-item-image_desc': 'manageImage_desc'
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editPgc: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removePgc: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    },
    manageImage_desc: function (e) {
        var managePgc_Image = new ManagePgc_Image();
        managePgc_Image.model = this.model;
        managePgc_Image.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        managePgc_Image.unloadPic();
    },
    originImage: function () {//origin图片上传
        var managePgcOriginImageViewTest = new ManagePgcOriginImageViewTest();
        managePgcOriginImageViewTest.model = this.model;
        managePgcOriginImageViewTest.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        managePgcOriginImageViewTest.unloadPic();
    } ,
    manageImage: function () {
        var managePgcImageViewTest = new ManagePgcImageViewTest();
        managePgcImageViewTest.model = this.model;
        managePgcImageViewTest.render().$el.new_modal({
            "show": true,
            "z_index": weego.z_index++
        });
        managePgcImageViewTest.unloadPic();
    }
});
//上传图片数组
var ManagePgc_Image = Backbone.View.extend({
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
        var menu = _this.model.get('pgc_images_desc');
        if (menu && menu.length > 0) {
            for (var i = 0; i < menu.length; i++) {
                var uploadPgc_View = new UploadPgcViewLife2();
                uploadPgc_View.model = {
                    _id: menu[i].section_image,
                    image_title: menu[i].image_title,
                    p_PGC_Id: menu[i].p_PGC_Id,
                    imgForlder: imgForlder,
                    type: 'pgcs_type',
                    num: i
                };
                uploadPgc_View.render().$el.appendTo(_this.$("#TempuploadedName"));
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
            url: '/postPgc_image_desc',
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
                                ' <strong>图片描述:</strong><textarea id="image_title' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
                                ' <strong>关联的POI的Id:</strong><textarea id="uploadp_pgc_Id' + i + '" class="upload_advice_list" style="height:30px;width:300px"></textarea><br>' +
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
var ManagePgcOriginImageViewTest = Backbone.View.extend({

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
        var imageoriginal = _this.model.get('original');
        if (imageoriginal && imageoriginal.image.length > 0) {
            var uploadPgcViewLife = new UploadPgcViewLife();
            uploadPgcViewLife.model = {_id: imageoriginal.image, imgForlder: imgForlder, type: 'pgcs_origin', num: 0};
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
            url: '/postPgcOriginImage',
            type: 'pgcs_origin',
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
var ManagePgcImageViewTest = Backbone.View.extend({
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
            var uploadPgcViewLife = new UploadPgcViewLife();
            uploadPgcViewLife.model = {_id: image, imgForlder: imgForlder, type: "pgcs", num: 0};
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
            url: '/postPgcImage',
            type: 'pgcs',
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
var UploadPgcViewLife = Backbone.View.extend({
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
        'click .btn-removeOrigin': 'removeOrigin'

    },
    remove: function (e) {
        var _this = this;
        var _id = $('#zxx_id_Temp').val();
        var type=$('#_type_Temp').val();

        $.ajax({
            url: '/delUploadPgcImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    },
    removeOrigin: function (e) {
        var _this = this;
        var _id = $('#zxx_id_Temp').val();
        $.ajax({
            url: '/delUploadPgcOriginImage/' + _id + '/' + _this.model._id,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});

//数组图片的删除操作、修改
var UploadPgcViewLife2 = Backbone.View.extend({
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
        var p_desc = $('.txt-p_desc' + num).val();
        var image_desc = $('.txt-image_desc' + num).val();
        var image_title = $('.txt-image_title' + num).val();
        var p_PGC_Id = $('.txt-p_PGC_Id' + num).val();
        //alert(_id+'##'+p_desc+'##'+p_title);

        $.ajax({
            type: 'POST',
            url: '/UpdateUploadPgc_image_desc',
            data: {'_id': _id, 'name': _this.model._id, 'p_desc': p_desc,'image_desc': image_desc, 'image_title': image_title, 'p_PGC_Id': p_PGC_Id},
            success: function (data) {
                if (data.status == 'success') {
                    alert("save success!");
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
            url: '/delUpload_Pgc_image_desc/' + _id + '/' + _this.model._id + '/' + _this.model.type,
            success: function (data) {
                if (data.status == 'success') {
                    _this.$el.remove();
                }
            }
        })
    }
});
