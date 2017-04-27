/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego_label = {
    init:function () {

    }
};
$(weego_label.init());

(function (weego_label) {

    weego_label.currentPage = 1;
    weego_label.limit = 20;


    weego_label.LabelModel = Backbone.Model.extend({
        urlRoot:'/label',
        idAttribute:"_id"
    });
    weego_label.LabelCollection = Backbone.Collection.extend({
        model:weego_label.LabelModel
    });

    Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if(v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    weego_label.AddLabelDetailView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDetailDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');

        },
        render:function (that) {
            var _this = this;
            _this.$el.css({
                'top':'0',
                'bottom':'0',
                'margin':'auto',
                'left':'10%',
                'right':'10%',
                'display':'block',
                'width':'1000px',
                'height':'100%',
                'overflow-y':'auto'
            });
            this.that = that;
            var _this = this;
            var template = Handlebars.compile($("#add_label_template").html());
            $(template(_this.model)).appendTo(_this.$el);
            this.delegateEvents(this.events);
            return this;
        },
        events:{
            'click #save':'save',
            'click #cancel':'cancel',
            'change #level':'changeLevel',
            'click #addlabel':'addLabel',
            'click .del':'dellabel',
            'focus .labels':'autoget'
        },
        cancel:function(){
            $("#attractionsDetailDialog").new_modal('hide');
        },
        autoget:function(e){
            var _this = this;
            $( ".labels" ).autocomplete({
                source: function(request,response){
                    $.ajax({
                            url:"/getLabelByLevel/2",
                            dataType:"json",
                            success: function( data ) {
                                response(
                                    $.map(
                                        data.label, function( item ) {
                                            return {
                                                label:item.label,
                                                value:item.label ,
                                                sublevel_id:item._id
                                            }
                                        }));
                            }
                        });
                },
                select: function( event, ui ) {
                    $(e.target).attr('data-value',ui.item.sublevel_id);
                }
            });
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addLabel:function(){
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">子标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" name="label" type="text" data-value=""><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        changeLevel:function () {
            if($('#level').val()==1){
                $('#addlabel').show();
            }else{
                $('#addlabel').hide();
            }
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                var value = $('.labels').eq(i).attr('data-value');
                if(value!==null||value!==''){
                }else{
                    array_label.push(value);
                }
            }
            var newLabels = new weego_label.LabelModel({label:$("#label").val(), level:$("#level").val(),classname:$("#classname").val(),subLabel:array_label});
            newLabels.save(null, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                        alert('保存失败');
                    } else {
                        alert('保存成功');
                        $("#attractionsDetailDialog").new_modal('hide');
                        _this.that.getData(weego_label.currentPage);
                    }
                },
                error:function () {
                    alert('保存失败');
                }
            });
            return false;
        }
    });

    weego_label.EditLabelView = Backbone.View.extend({
        tagName:"div",
        className:"modal hide fade",
        "id":"attractionsDetailDialog",
        initialize:function () {
            _.bindAll(this, 'render', 'save');
        },
        render:function () {
            var _this = this;
            _this.$el.css({
                'top':'0',
                'bottom':'0',
                'margin':'auto',
                'left':'10%',
                'right':'10%',
                'display':'block',
                'width':'1000px',
                'height':'100%',
                'overflow-y':'auto'
            });
            var template = Handlebars.compile($("#label_edit_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            if(_this.model.toJSON().level=='1'){
                _this.$('#addlabel').show();
            }
            return this;
        },
        events:{
            'click #save':'save',
            'click #cancel':'cancel',
            'change #level':'changeLevel',
            'click #addlabel':'addLabel',
            'click .del':'dellabel',
            'focus .labels':'autoget'
        },
        cancel:function(){
            $("#attractionsDetailDialog").new_modal('hide');
        },
        autoget:function(e){
            var _this = this;
            $( ".labels" ).autocomplete({
                source: function(request,response){
                    $.ajax({
                        url:"/getLabelByLevel/2",
                        dataType:"json",
                        success: function( data ) {
                            response(
                                $.map(
                                    data.label, function( item ) {
                                        return {
                                            label:item.label,
                                            value:item.label ,
                                            sublevel_id:item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function( event, ui ) {
                    $(e.target).attr('data-value',ui.item.sublevel_id);
                }
            });
        },
        dellabel:function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addLabel:function(){
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">子标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" name="label" type="text" data-value=""><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        changeLevel:function () {
            if($('#level').val()==1){
                $('#addlabel').show();
            }else{
                $('#addlabel').hide();
            }
        },
        save:function () {
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                var value = $('.labels').eq(i).attr('data-value');
                if(value===null||value===''){
                }else{
                    array_label.push(value);
                }
            }
            _this.model.save({label:$("#label").val(), level:$("#level").val(),classname:$("#classname").val(),subLabel:array_label}, {
                success:function (model, res) {
                    if (!res.isSuccess) {
                    } else {
                        alert('保存成功');
                        $("#attractionsDetailDialog").new_modal('hide');
                        weego_label.defaultView.getData(weego_label.currentPage);
                    }
                },
                error:function () {
                    alert('保存失败');
                }
            });
            return false;
        }
    });

    weego_label.LabelView = Backbone.View.extend({
        tagName:'tr',
        render:function () {
            var _this = this;
            _this.model.fetch({
                success:function () {
                    var template = Handlebars.compile($("#labelView").html());
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events:{
            'click .modify':'modify',
            'click .delete':'delete'
        },
        modify:function (e) {
            var EditLabelView = new weego_label.EditLabelView();
            EditLabelView.model = this.model;
            EditLabelView.render().$el.new_modal({
                "show":true,
                "z_index":weego_label.z_index++
            });
        },
        delete:function (e) {
            console.log("delete user");
            var _this = this;
            var isConfirmed = confirm("是否删除标签");
            if (isConfirmed) {
                this.model.destroy({
                    success:function (model, response) {
                        _this.$el.remove();
                    }
                });
            }
        }
    });

    weego_label.AppView = Backbone.View.extend({
        el:'#app',
        initialize:function () {
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendLabel', 'addLabel', 'getData');
            this.collection = new weego_label.LabelCollection();
            this.collection.on('add', this.appendLabel);
        },
        render:function () {
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#labelappView").html());
            $(template()).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events:{
            'click #addLabelButton':'addLabel',
            'click #nextPageButton':'nextPage',
            'click #prePageButton':'prePage'
        },

        delete:function () {
            this.getData(weego_label.currentPage);
        },
        addLabel:function () {
            new weego_label.AddLabelDetailView().render(this).$el.new_modal({
                "show":true,
                "z_index":weego_label.z_index++
            });
        },
        appendLabel:function (label) {
            var labelView = new weego_label.LabelView();
            labelView.model = label;
            labelView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage:function () {
            weego_label.currentPage++;
            this.getData(weego_label.currentPage);
        },
        prePage:function () {
            if (weego_label.currentPage > 1) {
                weego_label.currentPage--;
                this.getData(weego_label.currentPage);
            } else {
                alert("无上一页");
            }
        },
        getData:function (_index) {
            var _this = this;
            $.ajax({
                url:'/getLabelByPage/' + weego_label.limit + '/' + _index,
                type:'GET',
                success:function (data) {
                    if (data && data.label && data.label.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        for (var i = 0; i < data.label.length; i++) {
                            _this.collection.add(new weego_label.LabelModel({label:data.label[i].label, level:data.label[i].level, _id:data.label[i]._id}));
                        }
                    } else {
                        if (weego_label.currentPage == 1) {
                            _this.render();
                            alert("暂时没有标签");
                        } else {
                            alert("无下一页");
                            weego_label.currentPage--;
                        }
                    }
                }
            });
        }
    });
}(weego_label));