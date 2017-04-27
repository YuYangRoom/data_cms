/**
 * User: katat
 * Date: 9/4/13
 * Time: 8:06 PM
 */




var HotelModel = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/hotel'
});
var HotelCollection = Backbone.Collection.extend({
    url: '/hotels/'+this.pageLimit+'/'+this.currentPage,
    model: HotelModel,
    currentPage: 1,
    pageLimit: 10,
    query:'',
    initialize: function(data){
        if(data.cityname){
            this.query += "cityname="+data.cityname + "&";
        }
        if(data.hotelname){
            this.query += "hotelname="+data.hotelname+"&";
        }
        this.url = this.baseUrl +this.pageLimit+'/'+this.currentPage+'?'+this.query;
    },
    parse: function(response){
        this.total = response.count;
        return response.hotels;
    },
    hasPage: function(page){
        if(((page * this.pageLimit) - this.total) > this.pageLimit)
            return false;
        if(page == 0)
            return false;
        return true;
    },
    getByPage: function(limit, pageIndex, successCallback){
        this.url = '/hotels/'+limit+'/'+pageIndex+'?'+this.query;
        this.fetch({success: successCallback});
    },
    getFirstPage: function(callback){
        this.getByPage(this.pageLimit, 1, callback);
    },
    getNextPage: function(successCallback){
        if(!this.hasPage(this.currentPage + 1))
            return;
        this.getByPage(this.pageLimit, ++this.currentPage, successCallback);
    },
    getPrevPage: function(successCallback){
        if(!this.hasPage(this.currentPage - 1))
            return;
        this.getByPage(this.pageLimit, --this.currentPage, successCallback);
    },
    getPage: function(page, successCallback){
        this.currentPage = page;
        this.getByPage(this.pageLimit, this.currentPage, successCallback);
    }
})
var HotelView = Backbone.View.extend({
    template: Handlebars.compile($('#hotelDetailView').html()),
    initialize: function(){
        // alert('');
        this.template = Handlebars.compile($('#hotelDetailView').html());
    },
    events: {
        'click #hotel-save': 'saveHotel',
        'click #show_hotel_desc' : 'showMarkDown_desc',
        'click #show_hotel_room' : 'showMarkDown_room',
        'click #show_hotel_hot' : 'showMarkDown_hot',
        'click #show_hotel_service' : 'showMarkDown_service',
        'click #show_hotel_appraise' : 'showMarkDown_appraise',
        'click #show_hotel_traffic' : 'showMarkDown_traffic',
        'click #back' : 'back',
        'click #cancel' : 'back'
    },
    render: function(){
        this.model.set('user',weego_user.globalUser);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    back: function(e){
        e.preventDefault();
        window.history.back();
    },
    getTextInputValue: function(id){
        return this.$el.find('#'+id).val();
    },
    showMarkDown_desc: function(){
        if(this.$el.find('#wmd-preview-desc').is(":visible"))
            this.$el.find('#wmd-preview-desc').hide();
        else
            this.$el.find('#wmd-preview-desc').show();
    },
    showMarkDown_room: function(){
        if(this.$el.find('#wmd-preview-room').is(":visible"))
            this.$el.find('#wmd-preview-room').hide();
        else
            this.$el.find('#wmd-preview-room').show();
    },
    showMarkDown_hot: function(){
        if(this.$el.find('#wmd-preview-hot').is(":visible"))
            this.$el.find('#wmd-preview-hot').hide();
        else
            this.$el.find('#wmd-preview-hot').show();
    },
    showMarkDown_service: function(){
        if(this.$el.find('#wmd-preview-service').is(":visible"))
            this.$el.find('#wmd-preview-service').hide();
        else
            this.$el.find('#wmd-preview-service').show();
    },
    showMarkDown_appraise: function(){
        if(this.$el.find('#wmd-preview-appraise').is(":visible"))
            this.$el.find('#wmd-preview-appraise').hide();
        else
            this.$el.find('#wmd-preview-appraise').show();
    },
    showMarkDown_traffic: function(){
        if(this.$el.find('#wmd-preview-traffic').is(":visible"))
            this.$el.find('#wmd-preview-traffic').hide();
        else
            this.$el.find('#wmd-preview-traffic').show();
    },
    initMarkDown : function(){
            var converter1 = Markdown.getSanitizingConverter();
            var editor1 = new Markdown.Editor(converter1,"-desc",{});
            editor1.run();
            var converter2 = Markdown.getSanitizingConverter();
            var editor2 = new Markdown.Editor(converter1,"-room",{});
            editor2.run();
            var converter3 = Markdown.getSanitizingConverter();
            var editor3 = new Markdown.Editor(converter1,"-service",{});
            editor3.run();
            var converter4 = Markdown.getSanitizingConverter();
            var editor4 = new Markdown.Editor(converter1,"-hot",{});
            editor4.run();
            var converter5 = Markdown.getSanitizingConverter();
            var editor5 = new Markdown.Editor(converter1,"-appraise",{});
            editor5.run();
            var converter6 = Markdown.getSanitizingConverter();
            var editor6 = new Markdown.Editor(converter1,"-traffic",{});
            editor6.run();
            this.$el.find('#wmd-preview-desc').hide();
            this.$el.find('#wmd-preview-room').hide();
            this.$el.find('#wmd-preview-service').hide();
            this.$el.find('#wmd-preview-hot').hide();
            this.$el.find('#wmd-preview-appraise').hide();
            this.$el.find('#wmd-preview-traffic').hide();

    },
    saveHotel: function(e){
        var acceptCreditCards = [];
        this.$el.find('#hotel-accept-creditcards').find(':checked').each(function(i, elm){
            acceptCreditCards.push($(elm).val());
        })
        var hotelDetails = {
            name: this.getTextInputValue('hotel-name'),
            property_type: this.getTextInputValue('hotel-property-type'),
            stars: parseInt(this.getTextInputValue('hotel-stars')),
            url: this.getTextInputValue('hotel-url'),
            reservation_phone: this.getTextInputValue('hotel-reservation-phone'),
            fax: this.getTextInputValue('hotel-fax'),
            district: this.getTextInputValue('hotel-district'),
            city: this.getTextInputValue('hotel-city'),
            country: this.getTextInputValue('hotel-country'),
            continents: this.getTextInputValue('hotel-continents'),
            state: this.getTextInputValue('hotel-state'),
            state_code: this.getTextInputValue('hotel-state-code'),
            address: this.getTextInputValue('hotel-address'),
            postal_code: this.getTextInputValue('hotel-postal-code'),
            longitude: this.getTextInputValue('hotel-longitude'),
            latitude: this.getTextInputValue('hotel-latitude'),
            overview: this.getTextInputValue('hotel-overview'),
            area_description: this.getTextInputValue('hotel-description'),
            from_price: parseInt(this.getTextInputValue('hotel-from-price')),
            website_price: parseInt(this.getTextInputValue('hotel-website-price')),
            currency: this.getTextInputValue('hotel-currency'),
            creditcards: acceptCreditCards,
            isviewindex:$('input:radio[name="isviewindex"]:checked').val(),
            isviewindex_big:$('input:radio[name="isviewindex_big"]:checked').val(),
            hotel_desc:this.getTextInputValue('wmd-input-desc'),
            hotel_room:this.getTextInputValue('wmd-input-room'),
            hotel_service:this.getTextInputValue('wmd-input-service'),
            hotel_hot:this.getTextInputValue('wmd-input-hot'),
            hotel_appraise:this.getTextInputValue('wmd-input-appraise'),
            hotel_traffic:this.getTextInputValue('wmd-input-traffic'),
            facilities: {
                pet_friendly: this.$el.find('#hotel-pet-friendly').prop('checked'),
                restaurant: this.$el.find('#hotel-restaurant').prop('checked'),
                free_wifi: this.$el.find('#hotel-free-wifi').prop('checked'),
                gym: this.$el.find('#hotel-gym').prop('checked'),
                handicap_accessible: this.$el.find('#hotel-handicap-accessible').prop('checked'),
                bar: this.$el.find('#hotel-bar').prop('checked'),
                room_service: this.$el.find('#hotel-room-service').prop('checked'),
                breakfast: this.$el.find('#hotel-breakfast').prop('checked'),
                pool: this.$el.find('#hotel-pool').prop('checked'),
                spa: this.$el.find('#hotel-spa').prop('checked'),
                parking_onsite: this.$el.find('#hotel-parking-onsite').prop('checked'),
                babysitting: this.$el.find('#hotel-babysitting').prop('checked'),
                babysitting: this.$el.find('#hotel-babysitting').prop('checked')
            },
            to_list: this.$el.find('#hotel-to-list').prop('checked')
        }
        // alert(this.getTextInputValue('wmd-input-traffic'));
        if(this.model == null || this.model.get('_id') == null)
        {
            this.model = new HotelModel(hotelDetails);
            this.model.save({},{
                success:function(){
                    alert('酒店信息添加成功');
                    window.history.back();
                }
            });
        }
        else{
            this.model.save(hotelDetails, {
                success: function(){
                    alert('酒店修改成功');
                    window.history.back()
                }
            });
        }

        e.preventDefault();
        return false;
    }
})

var HotelListView = Backbone.View.extend({
    template: Handlebars.compile($('#hotel-list-view').html()),
    query:{},
    events:{
        'click #hotel-list-prev-page': 'showPrevPage',
        'click #hotel-list-next-page': 'showNextPage',
        'click #search-hotel-button': 'seach'
    },
    initialize: function(query){
        var that = this;
        this.query = query;
        this.collection = new HotelCollection(query);
        this.collection.on('all', function(){
            $('#hotel-list-current-page').html(that.collection.currentPage);
            $('#hotel-list-total').html(that.collection.total);
            $('#hotel-list-page-count').html(Math.floor(that.collection.total/that.collection.pageLimit) + 1);
            $('#search-hotel-cityname').val(query.cityname);
            $('#search-hotel-hotelname').val(isNull(query.hotelname)?query.hotelname:decodeURIComponent(query.hotelname));
        });
    },
    showHotelList: function(collection){
        var that = this;
        this.tbodyPlaceHolder.off();
        this.tbodyPlaceHolder.empty();
        _.each(collection.models, function(model){
            var hotelListItemView = new HotelListItemView({model: model});
            hotelListItemView.render().$el.appendTo(that.tbodyPlaceHolder);
        })
    },
    seach:function(){
        var cityname =$('#search-hotel-cityname').val();
        var hotelname =$('#search-hotel-hotelname').val();
        self.location = '/#hotels/1/q_'+cityname+'/q_'+encodeURIComponent(hotelname);
    },
    showFirstPage: function(){
        var that = this;
        this.collection.getFirstPage(function(collection){
            that.showHotelList(collection);
        })
    },
    showPrevPage: function(){
//        var that = this;
//        this.collection.getPrevPage(function(collection){
//            that.showHotelList(collection);
//        });
        if(!this.collection.hasPage(parseInt(this.collection.currentPage)-1))
            return;
        Backbone.history.navigate('hotels/'+(--this.collection.currentPage)+'/q_'+this.query.cityname+'/q_'+encodeURIComponent(this.query.hotelname), {trigger:true});
    },
    showNextPage: function(){
//        var that = this;
//        this.collection.getNextPage(function(collection){
//            that.showHotelList(collection);
//        });
        if(this.collection.hasPage(parseInt(this.collection.currentPage)+1) === false)
            return;
        Backbone.history.navigate('hotels/'+(++this.collection.currentPage)+'/q_'+this.query.cityname+'/q_'+encodeURIComponent(this.query.hotelname), {trigger:true});
    },
    showByPage: function(page){
        var that = this;
        this.collection.getPage(page, function(collection){
            that.showHotelList(collection);
        });
    },
    render: function(){
        var that = this;
        this.$el.html(that.template({
             user:weego_user.globalUser
//            currentPage: that.collection.currentPage,
//            pageCount: (that.collection.total/that.collection.pageLimit) + 1,
//            total: that.collection.total
        }));
        this.tbodyPlaceHolder = that.$el.find('tbody');

        return this;
    }
})

var HotelListItemView = Backbone.View.extend({
    template: Handlebars.compile($('#hotel-list-item-view').html()),
    tagName: 'tr',
    events: {
        'click #hotel-list-item-edit' : 'editHotel',
        'click #hotel-list-item-remove' : 'removeHotel',
        'click #hotel-list-item-upload-cover-img' : 'showHotelImgCoverModal'
    },
    render: function(){
        this.model.set('user',weego_user.globalUser);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    showHotelImgCoverModal: function(){
        var hotelImageUploadView = new HotelImageUploadView({model:this.model});
        this.$el.find('#modal-placeholder').empty();
        this.$el.find('#modal-placeholder').append(hotelImageUploadView.render().$el);
//        console.log(hotelImageUploadView.render().$el);
        this.$el.find('.modal').modal();
        this.$el.find('.modal').css('z-index',2001);
        $('.modal-backdrop').css('opacity', 0.8);
    },
    editHotel : function(){
//        $('#app').off();
//        $('#app').empty();
//        (new HotelView({model: this.model})).render().$el.appendTo($('#app'));
    },
    removeHotel : function(){
        console.log(this.model);
        this.model.destroy();
        this.$el.remove();
    }
})

var HotelImageUploadView = Backbone.View.extend({
    template: Handlebars.compile($('#hotel-image-upload-view').html()),
    events: {
        'click a.cover' : 'setCover',
        'click a.img-remove' : 'removeImg'
    },
    initialize: function(){
        var that = this;
        this.model.on('change:images', function(){
            that.showImageThumbnails();
        })
    },
    showImageThumbnails: function(){
        var imageListEle = Handlebars.compile($('#hotel-image-thumbnails').html())(this.model.toJSON());
        this.$el.find('#images').empty();
        this.$el.find('#images').append($(imageListEle));
    },
    setCover : function(e){
        var imgSrc = $(e.target).parent().find('img').attr('src');
        var fileName = imgSrc.split('/')[imgSrc.split('/').length -1];
        this.model.set('imgCover', fileName);
        this.model.save({}, {
            success : function(){
                $(e.target).parent().parent().find('.cover').removeClass('disabled btn-success');
                $(e.target).addClass('disabled btn-success');
            }
        });
    },
    removeImg : function(e){
        var imgSrc = $(e.target).parent().find('img').attr('src');
        var fileName = imgSrc.split('/')[imgSrc.split('/').length -1];
        var imgs = _.without(this.model.get('images'), fileName);
        this.model.set('images', imgs);
        // this.model.save({}, function(){
        //     $(e.target).parent().remove();
        // });
        var curr_imgCover = this.model.get('imgCover');
        if(fileName == curr_imgCover){
            this.model.set('imgCover', '');
            this.model.save({}, {
                success : function(){
                    $(e.target).parent().parent().find('.cover').removeClass('disabled btn-success');
                    $(e.target).addClass('disabled btn-success');
                }
            });
        }
        $.ajax({
            url:'/delUploadImageHotel/' + this.model.get('_id') + '/' + fileName,
            success:function (data) {
                if (data.status == 'success') {
                    $(e.target).parent().remove();
                }
            }
        });
    
    },
    render: function(){
        var that = this;
        this.$el.html(this.template({id: this.model.get('_id')}));
        this.$el.find('#fileupload').fileupload({
            dataType: 'json',
            formData: {
                '_id':this.model.get('_id')
            },
            done: function(e, data){
                that.model.set('images', data.result);
            }
        })
        this.showImageThumbnails();
        return this;
    }
})

