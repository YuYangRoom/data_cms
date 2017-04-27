/**
 * User: lb
 */

//---------------------------------model and collection-------------------------------------------------

var CategoryModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/category'
});
var CategoryCollection = Backbone.Collection.extend({
    url: '/categorys/'+this.pageLimit+'/'+this.currentPage,
    model: CategoryModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function(response){
        this.total = response.count;
        return response.categorys;
    },
    hasPage: function(page){
        if(((page * this.pageLimit) - this.total) > this.pageLimit)
            return false;
        if(page == 0)
            return false;
        return true;
    },
    getByPage: function(limit, pageIndex,type, successCallback){
        if(type == null ||type == undefined || type =='')
            type = '1';
        this.url = '/categorys/'+limit+'/'+pageIndex+'/'+type;
        this.fetch({success: successCallback});
    },
    getFirstPage: function(callback){
        this.getByPage(this.pageLimit, 1,'1', callback);
    },
    getNextPage: function(type,successCallback){
        if(!this.hasPage(this.currentPage + 1))
            return;
        this.getByPage(this.pageLimit, ++this.currentPage, type, successCallback);
    },
    getPrevPage: function(type,successCallback){
        if(!this.hasPage(this.currentPage - 1))
            return;
        this.getByPage(this.pageLimit, --this.currentPage, type, successCallback);
    },
    getPage: function(page,type, successCallback){
        this.currentPage = page;
        this.getByPage(this.pageLimit, this.currentPage, type, successCallback);
    }
});



//-----------------------------------end model,collection---------------------------------------------------


//-----------------------------------begin view--------------------------------------------------------------
var CategoryView = Backbone.View.extend({
    template: Handlebars.compile($('#categoryDetailView').html()),
    initialize: function(){
        // alert('');
        this.template = Handlebars.compile($('#categoryDetailView').html());
    },
    events: {
        'click #save': 'saveCategory',
        'click #cancel': 'back'
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    back: function(){
        console.log('back!');
        window.history.back();
    },
    getTextInputValue: function(id){
        return this.$el.find('#'+id).val();
    },
    saveCategory: function(e){
        var name = this.getTextInputValue('category-name');
        var en_name_2= this.getTextInputValue('category-en_name').trim();
        if(name=='' || name==null || name==undefined){
            alert('名称不能为空！');
            return false;
        }
        if(en_name_2=='' || en_name_2==null || en_name_2==undefined){
            alert('英文名用于分类、不能为空！');
            return false;
        }
        var categoryDetails = {
            name: name,
            en_name: en_name_2,
            type: this.getTextInputValue('category-property-type')
        }
        if(this.model == null || this.model.get('_id') == null)
        {
            this.model = new CategoryModel(categoryDetails);
            this.model.save({},{
                success:function(){
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else{
            this.model.save(categoryDetails, {
                success: function(){
                    alert('修改成功');
                    window.history.back();
                }
            });
        }

        e.preventDefault();
        return false;
    }
});

var CategoryListView = Backbone.View.extend({
    template: Handlebars.compile($('#category-list-view').html()),
    events:{
        'click #category-list-prev-page': 'showPrevPage',
        'click #category-list-next-page': 'showNextPage',
        'change #category_type': 'selectType'
    },
    initialize: function(data){
        var that = this;
        this.collection = new CategoryCollection();
        this.collection.on('all', function(){
            $('#category-list-current-page').html(that.collection.currentPage);
            $('#category-list-total').html(that.collection.total);
            $('#category-list-page-count').html(Math.floor(that.collection.total/that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    selectType: function(){
        var type = $('#category_type').val();
        self.location = '#categorys/1/'+type;
    },
    showCategoryList: function(collection){
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function(model){
            var categoryListItemView = new CategoryListItemView({model: model});
            categoryListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function(){
        var that = this;
        this.collection.getFirstPage(function(collection){
            that.showCategoryList(collection);
        })
    },
    showPrevPage: function(){
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if(!this.collection.hasPage(parseInt(this.collection.currentPage)-1))
            return;
        Backbone.history.navigate('categorys/'+(--this.collection.currentPage)+'/'+this.type, {trigger:true});
    },
    showNextPage: function(){
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showCategoryList(collection);
//        });
        if(this.collection.hasPage(parseInt(this.collection.currentPage)+1) === false)
            return;
        Backbone.history.navigate('categorys/'+(++this.collection.currentPage)+'/'+this.type, {trigger:true});
    },
    showByPage: function(page,type){
        var that = this;
        this.collection.getPage(page,type, function(collection){
            that.showCategoryList(collection);
        });
    },
    render: function(){
        var that = this;
        this.$el.html(that.template({
//            currentPage: that.collection.currentPage,
//            pageCount: (that.collection.total/that.collection.pageLimit) + 1,
//            total: that.collection.total
            type:this.type
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
});

var CategoryListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#category-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #category-list-item-edit' : 'editCategory',
        'click #category-list-item-remove' : 'removeCategory',
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
   
    editCategory : function(){
//        $('#app').off();
//        $('#app').empty();
//        (new CategoryView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeCategory : function(){
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
});

