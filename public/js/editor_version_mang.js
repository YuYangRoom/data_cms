/**
 * User: hbl
 */
//---------------------------------model and collection-------------------------------------------------
var Version_mangModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/version_mang'
});
var Version_mangCollection = Backbone.Collection.extend({
    url: '/version_mangs/' + this.pageLimit + '/' + this.currentPage,
    model: Version_mangModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function (response) {
        this.total = response.count;
        return response.version_mangs;
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
        this.url = '/version_mangs/' + limit + '/' + pageIndex + '/' + type;
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
    getversion_mangInfo: function(cityname,areaname,type,successCallback){
        this.url ='/getversion_mangssByName/?cityname=' + cityname + '&areaname=' + areaname+ '&type=' + type;
        this.fetch({success: successCallback});
    }
});

//-----------------------------------end model,collection---------------------------------------------------
//-----------------------------------begin view--------------------------------------------------------------
var Version_mangView = Backbone.View.extend({
    template: Handlebars.compile($('#version_mangDetailView').html()),
    initialize: function () {
        // alert('');
        this.template = Handlebars.compile($('#version_mangDetailView').html());
    },
    events: {
        'click #save': 'saveVersion_mang',
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
    saveVersion_mang: function (e) {
        var version = this.getTextInputValue('version_mang-version');
        var updateType=this.getTextInputValue('version_mang-type');
        alert(updateType+"###"+this.getTextInputValue('version_mang-_id'));
        if (updateType != 0 && updateType != 1 && updateType != 2 && updateType != 3) {
            if (version == '' || version == null || version == undefined) {
                alert('版本号不能为空！');
                return false;
            }
        }
        var __v=this.getTextInputValue('version_mang-v');
        if(__v==''){
            __v=0;
        }
        var  operating=this.getTextInputValue('version_mang-operating');
        if(operating==''){
            operating=-1;
        }
        var  platform=this.getTextInputValue('version_mang-platform');
        if(platform==''){
            platform="ios";
        }
        if( this.getTextInputValue('version_mang-isShow')=="true"){
            var isShow=true;
        }else{
            var isShow=false;
        }

        var version_mangDetails = {
            type:this.getTextInputValue('version_mang-type'),
            poiID:this.getTextInputValue('version_mang-_id'),
            version: version,
            isShow: isShow,
            __v:__v,
            operating:operating ,
            platform: platform
        }
        if (this.model == null || this.model.get('_id') == null) {
            this.model = new Version_mangModel(version_mangDetails);
            this.model.save({}, {
                success: function () {
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else {
            this.model.save(version_mangDetails, {
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

var Version_mangListView = Backbone.View.extend({
    template: Handlebars.compile($('#version_mang-list-view').html()),
    events: {
        'click #version_mang-list-prev-page': 'showPrevPage',
        'click #version_mang-list-next-page': 'showNextPage',
        'click #search-version_mang-button': 'version_mangButton',
        'change #version_mang_type': 'selectType'
    },
    initialize: function (data) {
        var that = this;
        this.collection = new Version_mangCollection();
        this.collection.on('all', function () {
            $('#version_mang-list-current-page').html(that.collection.currentPage);
            $('#version_mang-list-total').html(that.collection.total);
            $('#version_mang-list-page-count').html(Math.floor(that.collection.total / that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    version_mangButton: function () {
        var cityname = $('#search-cityname-cityname').val();
        var name = $('#search-name-name').val();
        var type = $('#version_mang_type').val();
        var that = this;
        this.collection.getversion_mangInfo(cityname,name,type, function (collection)  {
            that.showVersion_mangList(collection);
        })
    },
    selectType: function () {
        var type = $('#version_mang_type').val();
        self.location = '#version_mangs/1/' + type;
    },
    showVersion_mangList: function (collection) {
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function (model) {
            var version_mangListItemView = new Version_mangListItemView({model: model});
            version_mangListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function () {
        var that = this;
        this.collection.getFirstPage(function (collection) {
            that.showVersion_mangList(collection);
        })
    },
    showPrevPage: function () {
        if (!this.collection.hasPage(parseInt(this.collection.currentPage) - 1))
            return;
        Backbone.history.navigate('version_mangs/' + (--this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showNextPage: function () {
        if (this.collection.hasPage(parseInt(this.collection.currentPage) + 1) === false)
            return;
        Backbone.history.navigate('version_mangs/' + (++this.collection.currentPage) + '/' + this.type, {trigger: true});
    },
    showByPage: function (page, type) {
        var that = this;
        this.collection.getPage(page, type, function (collection) {
            that.showVersion_mangList(collection);
        });
    },
    render: function () {
        var that = this;
        this.$el.html(that.template({
            type: this.type
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});
var Version_mangListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#version_mang-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #version_mang-list-item-edit': 'editVersion_mang',
        'click #version_mang-list-item-remove': 'removeVersion_mang',
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    editVersion_mang: function () {
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeVersion_mang: function () {
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});