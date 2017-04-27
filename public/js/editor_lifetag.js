/**
 * User: lb
 */

//---------------------------------model and collection-------------------------------------------------

var LifetagModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/lifetag'
});
var LifetagCollection = Backbone.Collection.extend({
    url: '/lifetags/'+this.pageLimit+'/'+this.currentPage,
    model: LifetagModel,
    currentPage: 1,
    pageLimit: 10,
    parse: function(response){
        this.total = response.count;
        return response.lifetags;
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
        this.url = '/lifetags/'+limit+'/'+pageIndex+'/'+type;
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
var LifetagView = Backbone.View.extend({
    template: Handlebars.compile($('#lifetagDetailView').html()),
    initialize: function(){
        // alert('');
        this.template = Handlebars.compile($('#lifetagDetailView').html());
    },
    events: {
        'click #save': 'saveLifetag',
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
    saveLifetag: function(e){
        var name = this.getTextInputValue('lifetag-name');
        if(name=='' || name==null || name==undefined){
            alert('名称不能为空！');
            return false;
        }
        var lifetagDetails = {
            name: name,
            type: this.getTextInputValue('lifetag-property-type'),
            desc: this.getTextInputValue('lifetag-desc')
        }
        if(this.model == null || this.model.get('_id') == null)
        {
            this.model = new LifetagModel(lifetagDetails);
            this.model.save({},{
                success:function(){
                    alert('添加成功');
                    window.history.back();
                }
            });
        }
        else{
            this.model.save(lifetagDetails, {
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

var LifetagListView = Backbone.View.extend({
    template: Handlebars.compile($('#lifetag-list-view').html()),
    events:{
        'click #lifetag-list-prev-page': 'showPrevPage',
        'click #lifetag-list-next-page': 'showNextPage',
        'change #lifetag_type': 'selectType'
    },
    initialize: function(data){
        var that = this;
        this.collection = new LifetagCollection();
        this.collection.on('all', function(){
            $('#lifetag-list-current-page').html(that.collection.currentPage);
            $('#lifetag-list-total').html(that.collection.total);
            $('#lifetag-list-page-count').html(Math.floor(that.collection.total/that.collection.pageLimit) + 1);
        });
        this.type = data.type;
    },
    selectType: function(){
        var type = $('#lifetag_type').val();
        self.location = '#lifetags/1/'+type;
    },
    showLifetagList: function(collection){
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function(model){
            var lifetagListItemView = new LifetagListItemView({model: model});
            lifetagListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    showFirstPage: function(){
        var that = this;
        this.collection.getFirstPage(function(collection){
            that.showLifetagList(collection);
        })
    },
    showPrevPage: function(){
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showLifetagList(collection);
//        });
        if(!this.collection.hasPage(parseInt(this.collection.currentPage)-1))
            return;
        Backbone.history.navigate('lifetags/'+(--this.collection.currentPage)+'/'+this.type, {trigger:true});
    },
    showNextPage: function(){
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showLifetagList(collection);
//        });
        if(this.collection.hasPage(parseInt(this.collection.currentPage)+1) === false)
            return;
        Backbone.history.navigate('lifetags/'+(++this.collection.currentPage)+'/'+this.type, {trigger:true});
    },
    showByPage: function(page,type){
        var that = this;
        this.collection.getPage(page,type, function(collection){
            that.showLifetagList(collection);
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

var LifetagListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#lifetag-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #lifetag-list-item-edit' : 'editLifetag',
        'click #lifetag-list-item-remove' : 'removeLifetag',
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
   
    editLifetag : function(){
//        $('#app').off();
//        $('#app').empty();
//        (new LifetagView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeLifetag : function(){
        this.model.destroy();
        this.$el.remove();
    }
});

