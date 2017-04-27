/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-6-22
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */
var weego_user = {
    init:function () {
        if($.cookie('user')){
            this.loginFlag = true;
            this.globalUser = jQuery.parseJSON($.cookie('user'));
        }else{
            this.loginFlag = false;
            this.globalUser = {};
        }
    }
};
$(weego_user.init());
(function (weego_user) {
    // weego_user.loginFlag = false;
    weego_user.currentPage = 1;
    weego_user.sumpages = 1;
    weego_user.limit = 10;
    weego_user.z_index = 2000;
    weego_user.count = 0;
    weego_user.name;
    // weego_user.globalUser;

    weego_user.UserLoginModel = Backbone.Model.extend({
        urlRoot:'/login',
        idAttribute:"_id"
    });

    weego_user.UserModel = Backbone.Model.extend({
        urlRoot:'/user',
        idAttribute:"_id"
    });
    weego_user.UserCollection = Backbone.Collection.extend({
        model:weego_user.UserModel
    });

    weego_user.TaskModel = Backbone.Model.extend({
        urlRoot:'/task',
        idAttribute:"_id"
    });

    weego_user.TaskquestionModel = Backbone.Model.extend({
        urlRoot:'/taskquestion',
        idAttribute:"_id"
    });


    weego_user.LoginView = Backbone.View.extend({
        el:'#app',
        initialize: function(){
        },
        render:function () {
            var _this = this;
            $('#app').empty();
            var template = Handlebars.compile($("#loginTemplate").html());
            $(template()).appendTo(_this.$el);
            // $('.cmsNav').css('display', 'block');
            this.delegateEvents(this.events);
            return this;

        },
        events:{
            'click #login':'login'
        },
        login:function () {
            if ($('#username').val() == '' || $('#password').val() == '') {
                $(".valid_wrong").fadeIn("slow");
                return false;
            }
            var userModel = new weego_user.UserLoginModel();
            userModel.set('username', $('#username').val());
            userModel.set('password', md5($('#password').val()));
            userModel.save(null,
                {
                    success:function (model, res) {
                        if (model.get('login') == true) {
                            $('.cmsNav').css('display', 'block');
                            weego_user.globalUser = {};
                            weego_user.globalUser.username = model.get('username');
                            weego_user.globalUser._id = model.get('_id');
                            weego_user.globalUser.type = model.get('type');
                            var cookieUser = {'_id':weego_user.globalUser._id,'username':weego_user.globalUser.username,'type':weego_user.globalUser.type};
                            $.cookie('user',JSON.stringify(cookieUser),{expires:1});
                            // if (weego.globalCurrentUrl == '#login'||weego.globalCurrentUrl=='') {
                            //     weego.globalCurrentUrl = '#city/1';
                            // }
                            weego.globalCurrentUrl = '#main';
                            weego_user.loginFlag = true;
                            self.location = weego.globalCurrentUrl;

                        } else {
                            $(".login_wrong").fadeIn("slow");
                        }
                    }
                });
        }
    });
    
    //编辑主页
    weego_user.EditorMainView = Backbone.View.extend({
        el: "#app",
        initialize: function(){
            var thisView = this;
            $("<div/>").load("/templ/editorMain.handlebars", function(){
                var template = Handlebars.compile($(this).html());
                thisView.$el.empty().append(template());
                thisView.initData();
            })
        },
        initData: function() {
            var AjaxDataSource = function(options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
            };

            AjaxDataSource.prototype = {

                /**
                 * Returns stored column metadata
                 */
                columns: function() {
                    return this._columns;
                },
                /**
                 * Called when Datagrid needs data. Logic should check the options parameter
                 * to determine what data to return, then return data by calling the callback.
                 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
                 * @param {function} callback To be called with the requested data.
                 */
                data: function(options, callback) {
                    var url = '/getedithistory';
                    var self = this;

                    if (true) {
                        // Search active.  Add URL parameters for API.
                        url += '?';
                        url += options.search ? ('&cityname=' + encodeURIComponent(options.search)) : '';
                        url += options.filter ? ('&status=' + options.filter.value) : '';
                        url += '&perpage=' + options.pageSize;
                        url += '&page=' + (options.pageIndex + 1);
                        if (options.sortProperty) {
                            url += "&sort=" + options.sortProperty + "&sortdir=" + options.sortDirection
                        }

                        //alert(url); //use this to debug
                        $.ajax(url, {

                            // Set JSONP options for API
                            dataType: 'json',
                            type: 'GET'

                        }).done(function(response) {
                            // alert('ajax');

                            //alert(response.data);

                            // Prepare data to return to Datagrid
                            var data = response.edittask;
                            var count = response.edittask.length;
                            var startIndex = options.pageIndex * options.pageSize;
                            var endIndex = startIndex + options.pageSize;
                            var end = (endIndex > count) ? count : endIndex;
                            var pages = Math.ceil(count / options.pageSize);
                            var page = options.pageIndex + 1;
                            var start = startIndex + 1;
                            // SORTING is dealt with by the server
                            data = data.slice(startIndex, endIndex);
                            // Allow client code to format the data
                            if (self._formatter) self._formatter(data);

                            // Return data to Datagrid
                            callback({
                                data: data,
                                start: start,
                                end: end,
                                count: count,
                                pages: pages,
                                page: page
                            });

                        });
                    } else {
                        // No search. Return zero results to Datagrid
                        callback({
                            data: [],
                            start: 0,
                            end: 0,
                            count: 0,
                            pages: 0,
                            page: 0
                        });
                    }
                }
            };
            $('#EditorHistoryGrid').datagrid({
                stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                dataSource: new AjaxDataSource({
                    // Column definitions for Datagrid
                    columns: [{
                        property: 'city_name',
                        label: '编辑项目',
                        sortable: false
                    }, {
                        property: 'type',
                        label: '类型',
                        sortable: false
                    }, {
                        property: 'status',
                        label: '审核状态',
                        sortable: false
                    }, {
                        property: 'auditorname',
                        label: '审核人',
                        sortable: true
                    }, {
                        property: 'auditdate',
                        label: '审核时间',
                        sortable: true
                    }, {
                        property: 'editorname',
                        label: '编辑',
                        sortable: true
                    }, {
                        property: 'editdate',
                        label: '编辑时间',
                        sortable: true
                    }],

                    formatter: function(items) {
                        $.each(items, function(index, item) {
                            item.city_name = (item.name==null) ? '<a href="#allCountries/'+item.countryname+'/'+item.city_name+'">'+item.city_name+'</a>' : '<a href="#allCountries/'+item.countryname+'/'+item.city_name+'/'+item.type+'/'+item.name+'">'+item.name+'</a>'
                            if (item.status == '0') {
                                item.status = '<button type="button" class="btn btn-default" disabled="disabled">未审核</button>'
                            } else if (item.status == '1') {
                                item.status = '<button type="button" class="btn btn-info" disabled="disabled">审核中</button>'
                            } else if (item.status == '2') {
                                item.status = '<button type="button" class="btn btn-success" disabled="disabled">审核通过</button>'
                            } else {
                                item.status = '<button type="button" class="btn btn-danger" disabled="disabled">未通过</button>'
                            }
                        });
                    }
                })

            });
            
            var AjaxDataSource1 = function(options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
            };

            AjaxDataSource1.prototype = {

                /**
                 * Returns stored column metadata
                 */
                columns: function() {
                    return this._columns;
                },
                /**
                 * Called when Datagrid needs data. Logic should check the options parameter
                 * to determine what data to return, then return data by calling the callback.
                 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
                 * @param {function} callback To be called with the requested data.
                 */
                data: function(options, callback) {
                    var url = '/getaudithistory';
                    var self = this;

                    if (true) {
                        // Search active.  Add URL parameters for API.
                        url += '?';
                        url += options.search ? ('&cityname=' + encodeURIComponent(options.search)) : '';
                        url += options.filter ? ('&status=' + options.filter.value) : '';
                        url += '&perpage=' + options.pageSize;
                        url += '&page=' + (options.pageIndex + 1);
                        if (options.sortProperty) {
                            url += "&sort=" + options.sortProperty + "&sortdir=" + options.sortDirection
                        }

                        //alert(url); //use this to debug
                        $.ajax(url, {

                            // Set JSONP options for API
                            dataType: 'json',
                            type: 'GET'

                        }).done(function(response) {
                            // alert('ajax');

                            //alert(response.data);

                            // Prepare data to return to Datagrid
                            var data = response.audittask;
                            var count = response.audittask.length;
                            var startIndex = options.pageIndex * options.pageSize;
                            var endIndex = startIndex + options.pageSize;
                            var end = (endIndex > count) ? count : endIndex;
                            var pages = Math.ceil(count / options.pageSize);
                            var page = options.pageIndex + 1;
                            var start = startIndex + 1;
                            // SORTING is dealt with by the server
                            data = data.slice(startIndex, endIndex);
                            // Allow client code to format the data
                            if (self._formatter) self._formatter(data);

                            // Return data to Datagrid
                            callback({
                                data: data,
                                start: start,
                                end: end,
                                count: count,
                                pages: pages,
                                page: page
                            });

                        });
                    } else {
                        // No search. Return zero results to Datagrid
                        callback({
                            data: [],
                            start: 0,
                            end: 0,
                            count: 0,
                            pages: 0,
                            page: 0
                        });
                    }
                }
            };
            $('#EditorTaskGrid').datagrid({
                stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                dataSource: new AjaxDataSource1({
                    // Column definitions for Datagrid
                    columns: [{
                        property: 'city_name',
                        label: '编辑项目',
                        sortable: false
                    }, {
                        property: 'type',
                        label: '类型',
                        sortable: false
                    }, {
                        property: 'status',
                        label: '审核状态',
                        sortable: false
                    }, {
                        property: 'auditorname',
                        label: '审核人',
                        sortable: true
                    }, {
                        property: 'auditdate',
                        label: '审核时间',
                        sortable: true
                    }, {
                        property: 'editorname',
                        label: '编辑',
                        sortable: true
                    }, {
                        property: 'editdate',
                        label: '编辑时间',
                        sortable: true
                    }],

                    formatter: function(items) {
                        $.each(items, function(index, item) {
                        item.city_name = (item.name == null) ? '<a href="#allCountries/' + item.countryname + '/' + item.city_name + '">' + item.city_name + '</a>' : '<a href="#allCountries/' + item.countryname + '/' + item.city_name + '/' + item.type + '/' + item.name + '">' + item.name + '</a>'
                        if (item.status == '0') {
                            item.status = '<button type="button" class="btn btn-default" disabled="disabled">未审核</button>'
                        } else if (item.status == '1') {
                            item.status = '<button type="button" class="btn btn-info" disabled="disabled">审核中</button>'
                        } else if (item.status == '2') {
                            item.status = '<button type="button" class="btn btn-success" disabled="disabled">审核通过</button>'
                        } else {
                            item.status = '<button type="button" class="btn btn-danger" disabled="disabled">未通过</button>'
                        }
                        });
                    }
                })

            });
        }
    });
    // weego_user.EditorMainView = Backbone.View.extend({
    //     el:"#app",
    //     currentPage: 1,
    //     pageLimit: 10,
    //     initialize:function(){
    //         var thisView=this;
    //         if(weegoCache.editorMainTpl){
    //             thisView.$el.empty().append(weegoCache.editorMainTpl);
    //             thisView.initData();
    //         }else{
    //             $("<div/>").load("/templ/editorMain.handlebars",function(){
    //                 var template = Handlebars.compile($(this).html());
    //                 weegoCache.editorMainTpl=template();
    //                 thisView.$el.empty().append(template());
    //                 thisView.initData();
    //             });
    //         }
    //     },
    //     initData: function(){
    //         $.ajax({
    //             url:"/auditings/"+this.pageLimit+'/'+this.currentPage,
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     this.appendAuditingHTML(data);
    //                 }else{
    //                     alert('数据库异常！');
    //                 }
    //             },this)
    //         });

    //         $.ajax({
    //             url:"/tasks/"+this.pageLimit+'/'+this.currentPage,
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     this.appendTaskHTML(data);
    //                 }else{
    //                     alert('数据库异常！');
    //                 }
    //             },this)
    //         });

    //         $.ajax({
    //             url:"/taskquestions/"+this.pageLimit+'/'+this.currentPage,
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     this.appendTaskquestionHTML(data);
    //                 }else{
    //                     alert('数据库异常！');
    //                 }
    //             },this)
    //         });

    //     },
    //     appendAuditingHTML:function(data){
    //         var results = data.results;
    //         var itemHtml = '';
    //         for(var i=0;i<results.length;i++){
    //             var item = results[i];
    //             var displayTime = item.create_at.split('T');
    //             var status = item.status==0?'未递交':item.status==10?'已递交':item.status==40?'审核不通过':'审核通过';
    //             var type = item.type=='0'?'景点':item.type=='1'?'餐馆':item.type=='2'?'购物':'娱乐';
    //             var log_type = item.log_type=='0'?'新增':'修改';
    //             var askApprovalHTML = '<span>递交审核</span>';
    //             if(item.status==0||item.status==40)
    //                 askApprovalHTML = '<a href="#" class="askApprovalHTML"><span class="askApproval">递交审核</span></a>';
    //             itemHtml += '<div class="ehitem" auditingId="'+item._id+'">'+
    //             '<span>'+displayTime[0]+'</span>'+
    //             '<span>'+type+'</span>'+
    //             '<span>'+item.city_name+'</span>'+
    //             '<span>'+item.name+'</span>'+
    //             '<span>'+log_type+'</span>'+
    //             '<span>'+item.task_name+'</span>'+
    //             '<span class="status">'+status+'</span>'+
    //             askApprovalHTML+
    //             '<span class="showDetail">详情</span>'+
    //             '<p>我修改了xxx</p>'+
                
    //             '</div>';
    //         }
    //         $('.cmsEditorHistory-items').html(itemHtml);
    //         $('#auditing-list-current-page').html('1');
    //         $('#auditing-list-total').html(data.count);
    //         $('#auditing-list-page-count').html(Math.floor(data.count/this.pageLimit) + 1);
    //     },
    //     appendTaskHTML:function(data){
    //         var results = data.results;
    //         var itemHtml = '';
    //         for(var i=0;i<results.length;i++){
    //             var item = results[i];
    //             var displayTime = item.create_at.split('T');
    //             var status = '待完成';
    //             if(item.status==50)
    //                 status = '已完成';
    //             itemHtml += '<tr>'+
    //             '<td>'+item.name+'</td>'+
    //             '<td>'+item.city_name+'</td>'+
    //             '<td>'+displayTime[0]+'</td>'+
    //             '<td>'+item.total+'条['+item.attraction_num+'条景点,'+
    //             item.restaurant_num+'条餐馆,'+item.shopping_num+'条购物,'+item.entertainment_num+'条娱乐]</td>'+
    //             '<td>'+item.days+'天</td>'+
    //             '<td>'+item.desc+'</td>'+
    //             '<td>'+status+'</td>'+
    //             '</tr>';
    //         }
    //         $('#myTask').html(itemHtml);
    //         $('#task-list-current-page').html('1');
    //         $('#task-list-total').html(data.count);
    //         $('#task-list-page-count').html(Math.floor(data.count/this.pageLimit) + 1);
    //     },
    //     appendTaskquestionHTML:function(data){
    //         var results = data.results;
    //         var itemHtml = '';
    //         for(var i=0;i<results.length;i++){
    //             var item = results[i];
    //             var displayTime = item.create_at.split('T');
    //             var isClosed = item.is_closed?'已解决':'待解决';
    //             var closeHTML = '<td><a href="#" ><span class="setClosed">close</span></a></td>';
    //             if(item.is_closed)
    //                 closeHTML = '<td><span>close</span></td>'
    //             itemHtml += '<tr class="itemtr" taskquestionId="'+item._id+'">'+
    //             '<td>'+item.asker_name+'</td>'+
    //             '<td>'+displayTime[0]+'</td>'+
    //             '<td width=60%>'+item.content+'</td>'+
    //             '<td class="isClosed">'+isClosed+'</td>'+
    //             closeHTML+
    //             // '<a href="#" ><span class="setOpen">open</span></td>'+
    //             '</tr>';
    //         }
    //         $('#myTaskquestion').html(itemHtml);
    //         $('#taskquestion-list-current-page').html('1');
    //         $('#taskquestion-list-total').html(data.count);
    //         $('#taskquestion-list-page-count').html(Math.floor(data.count/this.pageLimit) + 1);
    //     },
    //     events:{
    //         "click .showDetail":"showDetail",
    //         "click .askApproval":"askApproval",
    //         "click #auditing-first":"auditingFirst",
    //         "click #auditing-pre":"auditingPre",
    //         "click #auditing-next":"auditingNext",
    //         "click #task-first":"taskFirst",
    //         "click #task-pre":"taskPre",
    //         "click #task-next":"taskNext",
    //         "click #taskquestion-first":"taskquestionFirst",
    //         "click #taskquestion-pre":"taskquestionPre",
    //         "click #taskquestion-next":"taskquestionNext",
    //         "click .setClosed":"setClosed",
    //         "click .setOpen":"setOpen"
    //     },
    //     setClosed:function(evt){
    //         evt.preventDefault();
    //         $.ajax({
    //             url:"/closeTaskquestion/"+$(evt.currentTarget).closest(".itemtr").attr('taskquestionId'),
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     console.log(data);
    //                    $(evt.currentTarget).parent().parent().siblings(".isClosed").html('已解决');
    //                    $(evt.currentTarget).parent().after('<span>close</span>').end().remove();
    //                 }else{
    //                     alert('设置失败！请联系管理员！');
    //                 }
    //             },this)
    //         });
    //     },
    //     setOpen:function(evt){
    //         evt.preventDefault();
    //         $.ajax({
    //             url:"/openTaskquestion/"+$(evt.currentTarget).closest(".itemtr").attr('taskquestionId'),
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                    $(evt.currentTarget).parent().siblings(".isClosed").html('待解决');
    //                 }else{
    //                     alert('设置失败！请联系管理员！');
    //                 }
    //             },this)
    //         });
    //     },
    //     showDetail:function(evt){
    //         var $this=$(evt.currentTarget);
    //         if($this.hasClass("active")){
    //             $this.removeClass("active").next().fadeOut();
    //         }else{
    //             $this.addClass("active").next().fadeIn();
    //         }
    //     },
    //     askApproval:function(evt){
    //         evt.preventDefault();
    //         if(confirm('确定递交审核该条数据吗？')){
    //             $.ajax({
    //                 url:"/askApproval/"+$(evt.currentTarget).closest(".ehitem").attr('auditingId'),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         console.log($(evt.currentTarget).parent().siblings(".status"));
    //                        $(evt.currentTarget).parent().siblings(".status").html('已递交');
    //                        $(evt.currentTarget).closest(".askApprovalHTML").after('<span>递交审核</span>').end().remove();
    //                     }else{
    //                         alert('递交失败！请联系管理员！');
    //                     }
    //                 },this)
    //             });
    //         }
    //     },
    //     auditingFirst:function(){
    //         $.ajax({
    //             url:"/auditings/"+this.pageLimit+'/1',
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     this.appendAuditingHTML(data);
    //                     $('#auditing-list-current-page').html('1');
    //                 }else{
    //                     alert('数据库异常！');
    //                 }
    //             },this)
    //         });
    //     },
    //     auditingPre:function(){
    //         var currentPage = $('#auditing-list-current-page').html();
    //         if(isInt(currentPage))
    //             currentPage = parseInt(currentPage);
    //         if(currentPage>1){
    //             $.ajax({
    //                 url:"/auditings/"+this.pageLimit+'/'+(--currentPage),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         this.appendAuditingHTML(data);
    //                         $('#auditing-list-current-page').html(currentPage);
    //                     }else{
    //                         alert('数据库异常！');
    //                     }
    //                 },this)
    //             });
    //         }else{
    //             alert('无上一页');
    //         }
    //     },
    //     auditingNext:function(){
    //         var currentPage = $('#auditing-list-current-page').html();
    //         if(isInt(currentPage))
    //             currentPage = parseInt(currentPage);
    //         else{
    //             return false;
    //         }
    //         var totalPage = $('#auditing-list-page-count').html();
    //         if(isInt(totalPage))
    //             totalPage = parseInt(totalPage);
    //         else{
    //             return false;
    //         }
    //         if(currentPage<totalPage){
    //             $.ajax({
    //                 url:"/auditings/"+this.pageLimit+'/'+(++currentPage),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         this.appendAuditingHTML(data);
    //                         $('#auditing-list-current-page').html(currentPage);
    //                     }else{
    //                         alert('数据库异常！');
    //                     }
    //                 },this)
    //             });
    //         }else{
    //             alert('无下一页');
    //         }
    //     },
    //     taskFirst:function(){
    //         $.ajax({
    //             url:"/tasks/"+this.pageLimit+'/1',
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     this.appendTaskHTML(data);
    //                     $('#task-list-current-page').html('1');
    //                 }else{
    //                     alert('数据库异常！');
    //                 }
    //             },this)
    //         });
    //     },
    //     taskPre:function(){
    //         var currentPage = $('#task-list-current-page').html();
    //         if(isInt(currentPage))
    //             currentPage = parseInt(currentPage);
    //         if(currentPage>1){
    //             $.ajax({
    //                 url:"/tasks/"+this.pageLimit+'/'+(--currentPage),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         this.appendTaskHTML(data);
    //                         $('#task-list-current-page').html(currentPage);
    //                     }else{
    //                         alert('数据库异常！');
    //                     }
    //                 },this)
    //             });
    //         }else{
    //             alert('无上一页');
    //         }
    //     },
    //     taskNext:function(){
    //         var currentPage = $('#task-list-current-page').html();
    //         if(isInt(currentPage))
    //             currentPage = parseInt(currentPage);
    //         else{
    //             return false;
    //         }
    //         var totalPage = $('#task-list-page-count').html();
    //         if(isInt(totalPage))
    //             totalPage = parseInt(totalPage);
    //         else{
    //             return false;
    //         }
    //         if(currentPage<totalPage){
    //             $.ajax({
    //                 url:"/tasks/"+this.pageLimit+'/'+(++currentPage),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         this.appendTaskHTML(data);
    //                         $('#task-list-current-page').html(currentPage);
    //                     }else{
    //                         alert('数据库异常！');
    //                     }
    //                 },this)
    //             });
    //         }else{
    //             alert('无下一页');
    //         }
    //     },
    //     taskquestionFirst:function(){
    //         $.ajax({
    //             url:"/taskquestions/"+this.pageLimit+'/1',
    //             success: _.bind(function (data) {
    //                 if(data.status){
    //                     this.appendTaskquestionHTML(data);
    //                     $('#taskquestion-list-current-page').html('1');
    //                 }else{
    //                     alert('数据库异常！');
    //                 }
    //             },this)
    //         });
    //     },
    //     taskquestionPre:function(){
    //         var currentPage = $('#taskquestion-list-current-page').html();
    //         if(isInt(currentPage))
    //             currentPage = parseInt(currentPage);
    //         if(currentPage>1){
    //             $.ajax({
    //                 url:"/taskquestions/"+this.pageLimit+'/'+(--currentPage),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         this.appendTaskquestionHTML(data);
    //                         $('#taskquestion-list-current-page').html(currentPage);
    //                     }else{
    //                         alert('数据库异常！');
    //                     }
    //                 },this)
    //             });
    //         }else{
    //             alert('无上一页');
    //         }
    //     },
    //     taskquestionNext:function(){
    //         var currentPage = $('#taskquestion-list-current-page').html();
    //         if(isInt(currentPage))
    //             currentPage = parseInt(currentPage);
    //         else{
    //             return false;
    //         }
    //         var totalPage = $('#taskquestion-list-page-count').html();
    //         if(isInt(totalPage))
    //             totalPage = parseInt(totalPage);
    //         else{
    //             return false;
    //         }
    //         if(currentPage<totalPage){
    //             $.ajax({
    //                 url:"/taskquestions/"+this.pageLimit+'/'+(++currentPage),
    //                 success: _.bind(function (data) {
    //                     if(data.status){
    //                         this.appendTaskquestionHTML(data);
    //                         $('#taskquestion-list-current-page').html(currentPage);
    //                     }else{
    //                         alert('数据库异常！');
    //                     }
    //                 },this)
    //             });
    //         }else{
    //             alert('无下一页');
    //         }
    //     },
    // });

    //Guest主页
    weego_user.GuestMainView = Backbone.View.extend({
        el:"#app",
        initialize:function(){
            var thisView=this;
            if(weegoCache.guestMainTpl){
                thisView.$el.empty().append(weegoCache.guestMainTpl);
            }else{
                $("<div/>").load("/templ/guest_main.html",function(){
                    var template = Handlebars.compile($(this).html());
                    weegoCache.guestMainTpl=template();
                    thisView.$el.empty().append(template());
                });
            }
        },

    });

    //管理员主页 
    weego_user.AdminMainView = Backbone.View.extend({
        el:"#app",
        currentPage: 1,
        pageLimit: 10,
        initialize:function(){
            var thisView=this;
            if(weegoCache.adminMainTpl){
                thisView.$el.empty().append(weegoCache.adminMainTpl);
                thisView.initMap();
                thisView.initSelect();
                thisView.initData(thisView);
            }else{
                $("<div/>").load("/templ/admin_personcenter.html",function(){
                    var template = Handlebars.compile($(this).html());
                    weegoCache.adminMainTpl=template();
                    thisView.$el.empty().append(template());
                    thisView.initMap();
                    thisView.initSelect();
                    thisView.initData(thisView);
                });
            }
        },
        initData: function(_this){
            $.ajax({
                url:"/getAllTasks/"+this.pageLimit+'/1',
                success:function (data) {
                    if(data.status){
                        _this.appendTaskHTML(data);
                    }else{
                        alert('数据库异常！');
                    }
                }
            });
        },
        appendTaskHTML:function(data){
            var results = data.results;
            var itemHtml = '';
            for(var i=0;i<results.length;i++){
                var item = results[i];
                var displayTime = item.create_at.split('T');
               
                itemHtml += '<li class="itemli" taskId="'+item._id+'"><div class="content"><ul class="taskdetail">'+
                '<li><h3>'+item.editor_name+'</h3></li>'+
                '<li><dl><dt><h5>'+item.city_name+'</h5></dt>'+
                '<dd><p>'+item.attraction_num+'个城市景点，'+
                item.restaurant_num+'个餐馆，'+
                item.shopping_num+'个购物，'+
                item.entertainment_num+'个娱乐信息</p></dd>'+
                '<dd><em>开始于'+displayTime[0]+'</em></dd></dl></li>'+
                '<li><h4>'+item.days+'天</h4><p>任务时长</p></li>'+
                '<li><h4>'+item.finish_rate+'%</h4><p>当前完成</p></li>'+
                '<li><button data-toggle="modal" class="btn btn-primary viewdetail">查看</button>'+
                    '<button class="btn btn-warning deltask">删除</button>'+
                    '<button class="btn btn-info sendmsg" editorId="'+item.editor_id+
                    '" editorName="'+item.editor_name+'">发信息</button>'+
                    '<button class="btn btn-primary checkeditor">审核</button></li></ul></div>'+
                '<div class="progress"><div style="width: '+item.finish_rate+'%;" class="bar"></div></div></li>';
            }
            $('#allTask').html(itemHtml);
            $('#checkdetail .modal-body').slimScroll({
                color: '#00f',
                size: '10px',
                height: '180px',
                alwaysVisible: true
            });
            $('#curr-page').html('1');
            $('#total-page').html(Math.floor(data.count/this.pageLimit) + 1);
            $('#total-count').html(data.count);
        },
        initMap : function(){
            jQuery('#vmap').vectorMap({
                map: 'world_en',
                backgroundColor: '#a5bfdd',
                borderColor: '#818181',
                borderOpacity: 0.25,
                borderWidth: 1,
                color: '#f4f3f0',
                enableZoom: true,
                hoverColor: '#c9dfaf',
                hoverOpacity: null,
                normalizeFunction: 'linear',
                scaleColors: ['#b6d6ff', '#005ace'],
                selectedColor: '#c9dfaf',
                selectedRegion: null,
                showTooltip: true,
                onRegionClick: function(element, code, region) {
                    var message = 'You clicked "' + region + '" which has the code: ' + code.toUpperCase();
                    $('#eachcountrydetail').find('li').eq(0).children('strong').html(region);
                    $.ajax({
                        url:"/getCountryStatistic/"+code.toUpperCase(),
                        success:function (data) {
                            if(data.status){
                                var online = data.online;
                                var lis = '';
                                for(var i=0;i<online.length;i++){
                                    var one = online[i];
                                    lis +='<li><label for="">'+one.city_name+'</label>'+
                                        '<strong>[已完成景点：'+one.attr_show+'，未完成：'+one.attr_not_show+']'+
                                        '[已完成餐馆：'+one.rest_show+'，未完成：'+one.rest_not_show+']'+
                                        '[已完成购物：'+one.shop_show+'，未完成：'+one.shop_not_show+']'+
                                        '</strong></li>';
                                }
                                $('#online_num').html(online.length);
                                $('#online').html(lis);
                                var lis2 = '';
                                var offline = data.offline;
                                for(var i=0;i<offline.length;i++){
                                    var one = offline[i];
                                    lis2 +='<li><label for="">'+one.city_name+'</label>'+
                                        '<strong>[已完成景点：'+one.attr_show+'，未完成：'+one.attr_not_show+']'+
                                        '[已完成餐馆：'+one.rest_show+'，未完成：'+one.rest_not_show+']'+
                                        '[已完成购物：'+one.shop_show+'，未完成：'+one.shop_not_show+']'+
                                        '</strong></li>';
                                }
                                $('#offline_num').html(offline.length);
                                console.log(offline.length);
                                $('#offline').html(lis2);
                                
                            }else{
                                alert('数据库异常！');
                            }
                        }
                    });
                }
            });
        },
        initSelect: function(){
            $.ajax({
                url:"/getAllEditor",
                success:function (data) {
                    if(data.status){
                        var results = data.results;
                        var option = '';
                        for(var i=0;i<results.length;i++){
                            var one = results[i];
                            option +='<option value="'+one._id+'" >'+one.username+'</option>';
                        }
                        $('#editor_select').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }
            });
            $.ajax({
                url:"/getAllCityBaseInfo",
                success:function (data) {
                    if(data.status){
                        var results = data.results;
                        var option = '';
                        for(var i=0;i<results.length;i++){
                            var one = results[i];
                            option +='<option value="'+one._id+'" >'+one.cityname+'</option>';
                        }
                        $('#city_select').html(option);
                    }else{
                        alert('数据库异常！');
                    }
                }
            });

        },
        showTaskDetailStatistic: function(e){
            var taskId = $(e.currentTarget).closest('.itemli').attr('taskId');
            $.ajax({
                url:"/statistic/"+taskId,
                success:function (data) {
                    if(data.status){
                        var task = data.task;
                        $('#taskdetail-statistic').highcharts({
                            chart: {
                                type: 'bar'
                            },
                            title: {
                                text: '数据统计'
                            },
                            xAxis: {
                                categories: ['景点', '餐馆', '购物']
                            },
                            yAxis: {
                                title: {
                                    text: '数量'
                                }
                            },
                            series: [{
                                name: '任务总数',
                                data: [task.attraction_num, task.restaurant_num, task.shopping_num]
                            }, {
                                name: '已完成',
                                data: [data.att_done, data.res_done, data.shop_done]
                            },{
                                name: '待审核[审核不通过]',
                                data: [data.att_ask, data.res_ask, data.shop_ask]
                            }]
                        });
                    }else{
                        alert('数据库异常！');
                    }
                }
            });
            
        },
        events:{
            'click #sendTask': 'sendTask',
            'change #city_select': 'selectCity',
            'change #attraction_num': 'numChange',
            'change #restaurant_num': 'numChange',
            'change #shopping_num': 'numChange',
            'change #entertainment_num': 'numChange',
            'click .viewdetail': 'viewdetail',
            'click .checkeditor': 'checkdetail',
            'click .sendmsg': 'sendmsg',
            'click .deltask': 'deltask',
            'click .delete':'delete',
            'click .icomoon-plus': 'newTask',
            'click #sendApproval': 'sendApproval',
            'click #sendMessage': 'sendMessage',
            "click #all-task-pre":"allTaskPre",
            "click #all-task-next":"allTaskNext",
        },
        newTask: function(e){
            $('#myModal').fadeIn();
        },
        deltask: function(e){
            var taskId = $(e.currentTarget).closest('.itemli').attr('taskId');
            if(confirm('你确定删除本次任务吗？审批记录条也将随之删除！')){
                var taskModel = new weego_user.TaskModel();
                taskModel.set('_id', taskId);
                taskModel.destroy();
                $(e.currentTarget).closest('.itemli').remove();
            }
        },
        viewdetail:function(e){
            // $(e.currentTarget()).next().fadeIn();
            $('#taskdetail').fadeIn();
            this.showTaskDetailStatistic(e);
        },
        checkdetail:function(e){
            $('#checkdetail').fadeIn();
            var taskId = $(e.currentTarget).closest('.itemli').attr('taskId');
            $('#checkdetail-list').attr('taskId',taskId);
            $.ajax({
                url:"/getApprovalAuditings/"+taskId,
                success:function (data) {
                    if(data.status){
                        var results = data.results;
                        console.log(data);
                        var itemHtml = '';
                        for(var i=0;i<results.length;i++){
                            var item = results[i];
                            var displayTime = item.mod_at.split('T');
                            var type = item.type=='0'?'景点':item.type=='1'?'餐馆':item.type=='2'?'购物':'娱乐';
                            var href = '';
                            if(item.type=='0'){
                                href='#attractions/1/q_'+item.city_name+'/q_'+item.name;
                            }else if(item.type=='1'){
                                href='#lifes/1/1/q_'+item.city_name+'/q_'+item.name;
                            }else if(item.type=='2'){
                                href='#lifes/1/2/q_'+item.city_name+'/q_'+item.name;
                            }else{
                                href='#lifes/1/3/q_'+item.city_name+'/q_'+item.name;
                            }
                            itemHtml += '<tr class="approval-auditing" auditingId="'+item._id+'">'+
                            '<td>'+displayTime[0]+'</td>'+
                            '<td>'+type+'</td>'+
                            '<td>'+item.city_name+'</td>'+
                            '<td>'+item.name+'</td>'+
                            '<td><a href="'+href+'" target="_blank" class="btn viewone">查看</a></td>'+
                            '<td>通过<input type="checkbox" style="float:none " class="pass-auditing">'+
                            '不通过<input type="checkbox" style="float:none " class="refuse-auditing"></td></tr>';
                        }
                        $('#checkdetail-list').html(itemHtml);
                    }else{
                        alert('数据库异常！');
                    }
                }
            });
        },
        sendmsg:function(e){
            $('#sendmsg').fadeIn();
            $('#sendMessage').attr('editorId',$(e.currentTarget).attr('editorId'));
            $('#sendMessage').attr('editorName',$(e.currentTarget).attr('editorName'));
        },
        sendMessage:function(e){
            var curr_user = jQuery.parseJSON($.cookie('user'));
            var content = $('#taskquestion-content').val();
            if(!content){
                alert('内容不能为空！');
                return false;
            }
            var item = {
                asker_id:curr_user._id,
                asker_name:curr_user.username,
                answer_id : $(e.currentTarget).attr('editorId'),
                answer_name : $(e.currentTarget).attr('editorName'),
                content : content
            };
            var taskquestionModel = new weego_user.TaskquestionModel(item);
            taskquestionModel.save({},{
                success:function(model, res){
                    if(res.status){
                        $('#sendmsg').fadeOut();
                        alert('发送成功');
                    }else{
                        alert('保存失败'+res.err);
                    }
                }
            });
        },
        delete:function(e){
            $('#myModal').fadeOut();
            $('#taskdetail').fadeOut();
            $('#checkdetail').fadeOut();
            $('#addeditor').fadeOut();
            $('#sendmsg').fadeOut();
        },
        numChange: function(){
            var attraction_num = $('#attraction_num').val();
            var restaurant_num = $('#restaurant_num').val();
            var shopping_num = $('#shopping_num').val();
            var entertainment_num = $('#entertainment_num').val(); 
            if(!isInt(attraction_num)){
                alert('景点数必须是整数！');
                $('#attraction_num').val('10');
                attraction_num = '10';
            }
            if(!isInt(restaurant_num)){
                alert('景点数必须是整数！');
                $('#restaurant_num').val('10');
                restaurant_num = '10';
            }
            if(!isInt(shopping_num)){
                alert('景点数必须是整数！');
                $('#shopping_num').val('10');
                shopping_num = '10';
            }
            if(!isInt(entertainment_num)){
                alert('景点数必须是整数！');
                $('#entertainment_num').val('0');
                entertainment_num = '0';
            }
            $('#total').val(parseInt(attraction_num)+parseInt(restaurant_num)+parseInt(shopping_num)+parseInt(entertainment_num));
        },
        selectCity: function(){
            var city_name = $('#city_select').find("option:selected").text();
            var total = $('#total').val();
            $('#taskname').val(city_name+total+'条数据任务');
        },
        sendTask: function(e){
            e.preventDefault();
            var total = $('#total').val();
            var days = $('#days').val();
            var taskname = $('#taskname').val();
            var attraction_num = $('#attraction_num').val();
            var restaurant_num = $('#restaurant_num').val();
            var shopping_num = $('#shopping_num').val();
            var entertainment_num = $('#entertainment_num').val();
            if(!taskname){
                alert('请输入任务名称！');
                $('#taskname').focus();
                return false;
            }
            if(!isInt(days)){
                alert('时长必须为数字！');
                $('#days').focus();
                return false;
            }
            if(!isInt(attraction_num) ||!isInt(restaurant_num)||!isInt(shopping_num)||!isInt(entertainment_num)){
                alert('景点、餐馆、购物、娱乐必须为数字！');
                $('#attraction_num').focus();
                return false;
            }

            if(confirm('你确定发送任务吗？')){
                var city_name = $('#city_select').find("option:selected").text();
                var item = {
                    editor_id:$('#editor_select').val(),
                    editor_name:$('#editor_select').find("option:selected").text(),
                    city_id:$('#city_select').val(),
                    city_name:city_name,
                    days:days,
                    attraction_num:attraction_num,
                    restaurant_num:restaurant_num,
                    shopping_num:shopping_num,
                    entertainment_num:entertainment_num,
                    total:total,
                    name:taskname,
                    desc:$('#desc').val()
                };
                var taskModel = new weego_user.TaskModel(item);
                taskModel.save({},{
                    success:function(model, res){
                        if(res.isSuccess){
                            $('#myModal').css('display','none');
                            $('.modal-backdrop').fadeOut();
                            self.location.reload();
                        }else{
                            alert('保存失败'+res.info);
                        }
                    }
                });
               
            }

        },
        sendApproval:function(e){
            var list = $('#checkdetail-list').children('.approval-auditing');
            var pass = [];
            var refuse = [];
            for(var i=0;i<list.length;i++){
                var pass_flag = $(list[i]).find('.pass-auditing').prop('checked');
                if(pass_flag){
                    pass.push($(list[i]).attr('auditingId'));
                }
                var refuse_flag = $(list[i]).find('.refuse-auditing').prop('checked');
                if(refuse_flag)
                    refuse.push($(list[i]).attr('auditingId'));
            }
            var taskId = $('#checkdetail-list').attr('taskId');
            if(confirm('你确定递交审核么？')){
                $.ajax({
                    url:"/approvalAuditings",
                    type:'POST',
                    data: {
                        'pass': pass,
                        'refuse': refuse,
                        'taskId':taskId
                    },
                    success:function (data) {
                        if(data.status){
                            $('#checkdetail').fadeOut();
                        }else{
                            alert('数据库异常！');
                        }
                    }
                });
            }
            
        },
        allTaskPre:function(e){
            e.preventDefault();
            var currentPage = $('#curr-page').html();
            if(isInt(currentPage))
                currentPage = parseInt(currentPage);
            if(currentPage>1){
                $.ajax({
                    url:"/getAllTasks/"+this.pageLimit+'/'+(--currentPage),
                    success: _.bind(function (data) {
                        if(data.status){
                            this.appendTaskHTML(data);
                            $('#curr-page').html(currentPage);
                        }else{
                            alert('数据库异常！');
                        }
                    },this)
                });
            }else{
                alert('无上一页');
            }
        },
        allTaskNext:function(e){
            e.preventDefault();
            var currentPage = $('#curr-page').html();
            if(isInt(currentPage))
                currentPage = parseInt(currentPage);
            else{
                return false;
            }
            var totalPage = $('#total-page').html();
            if(isInt(totalPage))
                totalPage = parseInt(totalPage);
            else{
                return false;
            }
            if(currentPage<totalPage){
                $.ajax({
                    url:"/getAllTasks/"+this.pageLimit+'/'+(++currentPage),
                    success: _.bind(function (data) {
                        if(data.status){
                            this.appendTaskHTML(data);
                            $('#curr-page').html(currentPage);
                        }else{
                            alert('数据库异常！');
                        }
                    },this)
                });
            }else{
                alert('无下一页');
            }
        },
    });

    // weego_user.AdminMainView = Backbone.View.extend({});

    weego_user.UserView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            var template = Handlebars.compile($("#userView").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete'
        },
        modify:function (e) {
            var editUserDetailView = new weego_user.EditUserDetailView();
            editUserDetailView.model = this.model;
            editUserDetailView.render().$el.new_modal({
                "show":true,
                "z_index":weego_user.z_index++
            });
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
        }
    });
    weego_user.AppView = Backbone.View.extend({
        el:'#app',
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendUser', 'addUser', 'getData');
            this.collection = new weego_user.UserCollection();
            this.collection.on('add', this.appendUser);
        },
        render:function () {
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#userappView").html());
            $(template()).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addUser':'addUser',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },
        addUser:function () {
            new weego_user.UserDetailView().render().$el.new_modal({
                "show":true,
                "z_index":weego_user.z_index++
            });
        },
        appendUser:function (user) {
            var userView = new weego_user.UserView();
            userView.model = user;
            userView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            if (weego_user.currentPage >= weego_user.sumpages) {
                alert("没有下一页");
                return;
            }
            weego_user.currentPage = parseInt(weego_user.currentPage) + 1;
            self.location = "#user/" + weego.currentPage;
        },
        prePage:function () {
            if (weego_user.currentPage > 1) {
                weego_user.currentPage = parseInt(weego_user.currentPage) - 1;
                self.location = "#user/" + weego.currentPage;
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index, name) {
            var _this = this;
            $.ajax({
                url:'/getUserByPage/' + weego_user.limit + '/' + _index,
                type:'GET',
                success:function (data) {
                    console.log(data);
                    weego_user.count = data.count;
                    if (data && data.user && data.user.length > 0) {
                        _this.collection.reset();
                        _this.render();

                        for (var i = 0; i < data.user.length; i++) {
                            _this.collection.add(data.user[i]);
                        }
                    } else {
                        if (weego_user.currentPage == 1) {
                            _this.render();
                            alert("没有用户");
                        } else {
                            alert("无下一页");
                            weego_user.currentPage--;
                        }
                    }
                }
            });
        }
    });
    //add user view
    weego_user.UserDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"addUserDialog",
        render:function () {
            this.$el.css({
                position:'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#add_user_template").html());
            $(template()).appendTo(_this.$el);
            return this;
        },
        events:{
            'click #save':'save'
        },
        save:function () {
            var _this = this;
            if ($('#username').val() == '' || $('#password').val() == '') {
                alert('用户名或者密码不能为空');
                return false;
            }
            var newUser = new weego_user.UserModel({
                username:$('#username').val(),
                password:md5($('#password').val()),
                type:parseInt($('#type').val()),
                group:parseInt($('#group').val())
            });
            newUser.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert("cuole");
                    } else {
                        alert('保存成功');
                        $("#addUserDialog").new_modal('hide');
                        weego_user.defaultView.getData(weego_user.currentPage);
                    }
                }
            });
        }
    });
    weego_user.EditUserDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"editUserDialog",
        render:function () {
            this.$el.css({
                position:'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#edit_user_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            return this;
        },
        events:{
         'click #save':'save'
        },
        save:function(){
            var _this  = this;
            this.model.set('password',md5($('#password').val()));
            this.model.set('type',parseInt($('#type').val()));
            this.model.set('group',parseInt($('#group').val()));
            this.model.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert("cuole");
                    } else {
                        alert('保存成功');
                        $("#editUserDialog").new_modal('hide');
                        weego_user.defaultView.getData(weego_user.currentPage);;
                    }
                }
            });
        }
    });
    function md5(value) {
        var hash = hex_md5(value);
        return  hash;
    }
})(weego_user);