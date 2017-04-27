/**
 * Created with JetBrains WebStorm.
 * User: jiangli
 * Date: 13-3-7
 * Time: 上午9:20
 * To change this template use File | Settings | File Templates.
 */
var weego = {
    init: function () {
        $(".cmsNav").on("click", "a", function (evt) {
            $(evt.currentTarget).addClass("active").siblings("a").removeClass("active");
        });

    }
};
var weegoCache = {};
$(weego.init());

(function (weego) {

    weego.GlobalRouter = Backbone.Router.extend({
        routes: {
            // "country":"city_attractions", //
            "allCountries": "showallCountries",
            "allCountries/:countryname": "showCountry",
            "allCountries/:countryname/:cityid": "showCity",
            "allCountries/:countryname/:cityname/:type": "showCityItems",
            "allCountries/:countryname/:cityname/:type/new": "addNewCityItems",
            "allCountries/:countryname/:cityname/:type/:itemname": "showItem",
            "city/:pageno": "city", //根据页码展示city
            "city/:pageno/:country/:cityname": "city", //根据页码展示city

            "attractions/:pageno": "list_attractions",
            "attractions": "list_attractions",
            "attraction/new": "showAttractionView",
            "attraction/:attractionId": "showAttractionView",
            "attractions/:pageno/:cityname/:attname": "list_attractions",

            "lifes": "showLifeListView1",
            "lifes/:pageno": "showLifeListView1",
            "lifes/:pageno/:type": "showLifeListView1",
            "lifes/:pageno/:type/:cityname": "showLifeListView1",
            "lifes/:pageno/:type/:cityname/:lifename": "showLifeListView1",
            "lifes/:pageno/:type/:cityname/:areaname": "showLifeListView2",
            "lifes/:pageno/:type/:cityname/:lifename/:tags": "showLifeListView",
            "life/new": "showLifeDetailView",
            "life/:id/:type": "showLifeDetailView",

            "categorys": "showCategoryListView",
            "brands": "showBrandListView",
            "event_cmss": "showEvent_cmsListView",
            "version_mangs": "showVersion_mangListView",
            "recommendRules": "showRecommendRuleListView",
            "recommendTimes": "showRecommendTimeListView",
            "news_cmss": "showNews_cmsListView",
            "recommendInfos": "showRecommendInfoListView",
            "peoples": "showPeopleListView",
            "pgcs": "showPgcListView",
            "banners": "showBannerListView",
            "activitys": "showActivityListView",
            "categorys/:pageno": "showCategoryListView",
            "brands/:pageno": "showBrandListView",
            "event_cmss/:pageno": "showEvent_cmsListView",
            "version_mangs/:pageno": "showVersion_mangListView",
            "recommendRules/:pageno": "showRecommendRuleListView",
            "recommendTimes/:pageno": "showRecommendTimeListView",
            "news_cmss/:pageno": "showNews_cmsListView",
            "recommendInfos/:pageno": "showRecommendInfoListView",
            "peoples/:pageno": "showPeopleListView",
            "pgcs/:pageno": "showPgcListView",
            "banners/:pageno": "showBannerListView",
            "activitys/:pageno": "showActivityListView",
            "categorys/:pageno/:type": "showCategoryListView",
            "brands/:pageno/:type": "showBrandListView",
            "event_cmss/:pageno/:type": "showEvent_cmsListView",
            "recommendRules/:pageno/:type": "showRecommendRuleListView",
            "version_mangs/:pageno/:type": "showVersion_mangListView",
            "recommendTimes/:pageno/:type": "showRecommendTimeListView",
            "news_cmss/:pageno/:type": "showNews_cmsListView",
            "recommendInfos/:pageno/:type": "showRecommendInfoListView",
            "peoples/:pageno/:type": "showPeopleListView",
            "pgcs/:pageno/:type": "showPgcListView",
            "banners/:pageno/:type": "showBannerListView",
            "activitys/:pageno/:type": "showActivityListView",
            "category/new": "showCategoryDetailView",
            "category/:id": "showCategoryDetailView",
            "brand/new": "showBrandDetailView",
            "event_cms/new": "showEvent_cmsDetailView",
            "version_mang/new": "showVersion_mangDetailView",
            "recommendRule/new": "showRecommendRuleDetailView",
            "recommendTime/new": "showRecommendTimeDetailView",
            "news_cms/new": "showNews_cmsDetailView",
            "recommendInfo/new": "showRecommendInfoDetailView",
            "people/new": "showPeopleDetailView",
            "pgc/new": "showPgcDetailView",
            "banner/new": "showBannerDetailView",
            "activity/new": "showActivityDetailView",
            "brand/:id": "showBrandDetailView",
            "event_cms/:id": "showEvent_cmsDetailView",
            "version_mang/:id": "showVersion_mangDetailView",
            "recommendRule/:id": "showRecommendRuleDetailView",
            "recommendTime/:id": "showRecommendTimeDetailView",
            "news_cms/:id": "showNews_cmsDetailView",
            "recommendInfo/:id": "showRecommendInfoDetailView",
            "people/:id": "showPeopleDetailView",
            "pgc/:id": "showPgcDetailView",
            "banner/:id": "showBannerDetailView",
            "activity/:id": "showActivityDetailView",

            "lifetags": "showLifetagListView",
            "lifetags/:pageno": "showLifetagListView",
            "lifetags/:pageno/:type": "showLifetagListView",
            "lifetag/new": "showLifetagDetailView",
            "lifetag/:id": "showLifetagDetailView",

            "areas": "showAreaListView",
            "areas/:pageno": "showAreaListView",
            "area/new": "showAreaDetailView",
            "area/:id": "showAreaDetailView",

            "lifetag": "showLifeTagListView",
            "lifetag/:pageno": "showLifeTagListView",

            "hotel/new": "showHotelDetailView",
            "hotel/:id": "showHotelDetailView",
            "hotels": "showHotelListView",
            "hotels/:page": "showHotelListView",
            "hotels/:page/:cityname/:hotelname": "showHotelListView",

            "label": 'list_label',
            "login": 'login',
            'user/:pageno': "list_user",
            "logout": "logout",

            //"*actions":"list_city"//默认显示city
            "main": "userMain",
            "statistics": "dataStatistic",
            "*actions": "userMain"

        },
        dataStatistic: function () {
            new weego.StatisticsView();
        },
        userMain: function (evt) {
            var currentUser = weego_user.globalUser;
            console.log(currentUser.type);
            if (currentUser.type == 0) {

                new weego_user.AdminMainView();
                $('.cmsNav .admin').css('display', 'block');
            } else if (currentUser.type == 1) {
                new weego_user.EditorMainView();
                $('.cmsNav .admin').css('display', 'none');
            } else if (currentUser.type == -1) {
                new weego_user.GuestMainView();
                $('.cmsNav .admin').css('display', 'none');
            }
            // $('.cmsNav').css('display', 'block');
        },
        before: function (route) {
            $('#app').off();
            if ((!weego_user.loginFlag || !weego_user.globalUser) && route != 'login' && route != 'logout') {
                // if (false && route != 'login'&&route!='logout') {
                weego.globalCurrentUrl = window.location.hash;
                self.location = "#login";
                return false;
            } else if (route != 'login') {
                $('.show-nav').fadeIn();
            }
            // if (weego_user.globalUser) {
            //     if (weego_user.globalUser.type == 1) {
            //         $('#tab-user').fadeIn();
            //         $('.icomoon_user').css('display', '');
            //         $('.icomoon_labels').css('display', '');
            //         $('.icomoon_user').css('display', '');
            //         $('.icomoon_label').css('display', '');
            //         $('.icomoon_category').css('display', '');
            //         $('.icomoon_lifetag').css('display', '');
            //     } else {
            //         $('.icomoon_user').css('display', 'none');
            //         $('.icomoon_labels').css('display', 'none');
            //         $('.icomoon_user').css('display', 'none');
            //         $('.icomoon_label').css('display', 'none');
            //         $('.icomoon_category').css('display', 'none');
            //         $('.icomoon_lifetag').css('display', 'none');
            //     }
            // }
        },
        logout: function () {
            $('.cmsNav').css('display', 'none');
            weego_user.loginFlag = false;
            weego_user.globalUser = null;
            $.cookie('user', null);
            $('.show-nav').fadeOut();
            self.location = "#login";
        },
        login: function () {
            $('.cmsNav').css('display', 'none');
            new weego_user.LoginView().render();
        },
        list_user: function (pageno) {
            if (weego_user.globalUser.type == 0) {
                $('#tab-user').siblings().removeClass('active');
                $('#tab-user').addClass('active');
                weego_city.currentPage = pageno;
                weego_user.defaultView = new weego_user.AppView();
                weego_user.defaultView.getData(weego_user.currentPage);
            } else {
                alert('权限不足！');
                self.location = '#main';
            }
        },
        list_label: function () {
            $('#tab-label').siblings().removeClass('active');
            $('#tab-label').addClass('active');
            weego_label.defaultView = new weego_label.AppView();
            weego_label.defaultView.getData(weego_label.currentPage);
        },
        showallCountries: function () {
            $.ajax({
                url: '/getAllCity',
                method: 'get',
                success: function (data) {
                    var allCountries = new weego.AllCountriesView();
                    $('#app').html('').append(allCountries.render(data).$el);
                }
            })
        },
        showCountry: function (countryname) {
            var countrycities = new weego.CountryCitiesView();
            $('#app').html('').append(countrycities.render(countryname).$el);
            var AjaxDataSource = function (options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
            };

            AjaxDataSource.prototype = {

                /**
                 * Returns stored column metadata
                 */
                columns: function () {
                    return this._columns;
                },
                /**
                 * Called when Datagrid needs data. Logic should check the options parameter
                 * to determine what data to return, then return data by calling the callback.
                 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
                 * @param {function} callback To be called with the requested data.
                 */
                data: function (options, callback) {
                    var url = '/getCountryCities/' + countryname;
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

                        }).done(function (response) {
                            // alert('ajax');

                            //alert(response.data);

                            // Prepare data to return to Datagrid
                            var data = response.results.city;
                            var count = response.results.city.length;
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
            console.log($('#CityGrid'));
            $('#CityGrid').datagrid({
                stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                dataSource: new AjaxDataSource({
                    // Column definitions for Datagrid
                    columns: [{
                        property: 'cityname',
                        label: '城市名',
                        sortable: false
                    }, {
                        property: 'attractionscount',
                        label: '景点',
                        sortable: false
                    }, {
                        property: 'restaurantscount',
                        label: '餐馆',
                        sortable: false
                    }, {
                        property: 'shopareacount',
                        label: '购物区域',
                        sortable: false
                    }, {
                        property: 'shoppingscount',
                        label: '购物',
                        sortable: false
                    }, {
                        property: 'show_flag',
                        label: '是否显示',
                        sortable: true
                    }, {
                        property: 'hot_flag',
                        label: '是否热门',
                        sortable: true
                    }, {
                        property: 'status',
                        label: '审核状态',
                        sortable: true
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

                    formatter: function (items) {
                        $.each(items, function (index, item) {
                            item.attractionscount = item.attractionscount ? '<a href="#allCountries/' + item.countryname + '/' + item.cityname + '/attractions">' + item.attractionscount + '</a>' : 0;
                            item.restaurantscount = item.restaurantscount ? '<a href="#allCountries/' + item.countryname + '/' + item.cityname + '/restaurants">' + item.restaurantscount + '</a>' : 0;
                            item.shopareacount = item.shopareacount ? '<a href="#allCountries/' + item.countryname + '/' + item.cityname + '/shopareas">' + item.shopareacount + '</a>' : 0;
                            item.shoppingscount = item.shoppingscount ? '<a href="#allCountries/' + item.countryname + '/' + item.cityname + '/shoppings">' + item.shoppingscount + '</a>' : 0;
                            item.cityname = '<a href="#allCountries/' + item.countryname + '/' + item._id + '">' + item.cityname + '</a>';
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

        },
        showCity: function (countryname, cityid) {

            $.ajax({
                url: '/getCountryCities/' + countryname + '/' + cityid,
                method: 'GET',
                success: function (data) {
                    //console.log(data);
                    var result = data.results;
                    var cityview = new weego.CityPreView();
                    $('#app').html('').append(cityview.render(data).$el);
                    $("#datepicker").datepicker();

                }
            })

        },
        showCityItems: function (countryname, cityname, type) {
            var cityitems = new weego.CityItemView();
            $('#app').html('').append(cityitems.render(countryname, cityname, type).$el);
            var AjaxDataSource = function (options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
            };

            AjaxDataSource.prototype = {

                /**
                 * Returns stored column metadata
                 */
                columns: function () {
                    return this._columns;
                },
                /**
                 * Called when Datagrid needs data. Logic should check the options parameter
                 * to determine what data to return, then return data by calling the callback.
                 * @param {object} options Options selected in datagrid (ex: {pageIndex:0,pageSize:5,search:'searchterm'})
                 * @param {function} callback To be called with the requested data.
                 */
                data: function (options, callback) {
                    var url = '/getCountryCities/' + countryname + '/' + cityname + '/' + type;
                    var self = this;

                    if (true) {
                        // Search active.  Add URL parameters for API.
                        url += '?';
                        url += options.search ? ('&name=' + encodeURIComponent(options.search)) : '';
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

                        }).done(function (response) {
                            // alert('ajax');

                            //alert(response.data);


                            // Prepare data to return to Datagrid
                            //console.log(response);
                            // weego.city_id  = response.restaurants[0].city_id;
                            if (type == "restaurants") {
                                var data = response.restaurants;
                                console.log(response);
                                var count = response.countrestaurants;
                            } else {
                                var data = response;
                                var count = response.length;
                            }

                            var startIndex = options.pageIndex * options.pageSize;
                            var endIndex = startIndex + options.pageSize;
                            var end = (endIndex > count) ? count : endIndex;
                            var pages = Math.ceil(count / options.pageSize);
                            var page = options.pageIndex + 1;
                            var start = startIndex + 1;
                            console.log(startIndex, endIndex, end, pages, page, start);
                            // SORTING is dealt with by the server
                            if (type == "restaurants") {
                                data = data.slice(0, 10);
                            } else {
                                data = data.slice(startIndex, endIndex);
                            }
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
            if (type == "attractions") {
                $('#CityGrid').datagrid({
                    stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                    dataSource: new AjaxDataSource({
                        // Column definitions for Datagrid
                        columns: [{
                            property: 'attractions',
                            label: '景点',
                            sortable: false
                        }, {
                            property: 'recommand_flag',
                            label: '是否推荐',
                            sortable: true
                        }, {
                            property: 'show_flag',
                            label: '是否显示',
                            sortable: true
                        }, {
                            property: 'status',
                            label: '审核状态',
                            sortable: true
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

                        formatter: function (items) {
                            $.each(items, function (index, item) {
                                item.attractions = '<a href="#allCountries/' + countryname + '/' + item.cityname + '/attractions/' + item.attractions + '">' + item.attractions + '</a>';
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

            if (type == "restaurants") {
                $('#CityGrid').datagrid({
                    stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                    dataSource: new AjaxDataSource({
                        // Column definitions for Datagrid
                        columns: [{
                            property: 'name',
                            label: '餐馆',
                            sortable: false
                        }, {
                            property: 'status',
                            label: '审核状态',
                            sortable: true
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

                        formatter: function (items) {
                            $.each(items, function (index, item) {
                                item.name = '<a href="#allCountries/' + countryname + '/' + item.city_name + '/restaurants/' + item.name + '">' + item.name + '</a>';
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

            if (type == "shopareas") {
                $('#CityGrid').datagrid({
                    stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                    dataSource: new AjaxDataSource({
                        // Column definitions for Datagrid
                        columns: [{
                            property: 'area_name',
                            label: '购物区域',
                            sortable: false
                        }, {
                            property: 'status',
                            label: '审核状态',
                            sortable: true
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

                        formatter: function (items) {
                            $.each(items, function (index, item) {
                                item.area_name = '<a href="#allCountries/' + countryname + '/' + item.city_name + '/shopareas/' + item.area_name + '">' + item.area_name + '</a>';
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

            if (type == "shoppings") {
                $('#CityGrid').datagrid({
                    stretchHeight: false, //forces the datagrid to take up all the height of the containing HTML element. If false, it expands (& contracts) to fit the amount of data it contains.
                    dataSource: new AjaxDataSource({
                        // Column definitions for Datagrid
                        columns: [{
                            property: 'name',
                            label: '购物',
                            sortable: false
                        }, {
                            property: 'status',
                            label: '审核状态',
                            sortable: true
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

                        formatter: function (items) {
                            $.each(items, function (index, item) {
                                item.name = '<a href="#allCountries/' + countryname + '/' + item.city_name + '/shoppings/' + item.name + '">' + item.name + '</a>';
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
        },
        addNewCityItems: function (countryname, cityname, type) {
            var newCityItemView = new weego.NewCityItemView();
            console.log(weego.city_id);
            var data = {
                countryname: countryname,
                cityname: cityname,
                type: type,
                city_id: weego.city_id
            }
            $('#app').html('').append(newCityItemView.render(data).$el);
        },
        showItem: function (countryname, cityname, type, itemname) {
            $.ajax({
                url: '/getCountryCities/' + countryname + '/' + cityname + '/' + type + '/' + itemname,
                method: 'GET',
                success: function (data) {
                    //console.log(data);
                    var attractionview = new weego.CityItemPreView();
                    $('#app').html('').append(attractionview.render(data, countryname, cityname, type, itemname).$el);
                }
            })
        },
        city: function (pageno, country, cityname) {
            $('#tab-city').siblings().removeClass('active');
            $('#tab-city').addClass('active');
            var query = {};
            if (country) {
                var a = country.split('_');
                if (a[1]) {
                    query.country = a[1];
                }
            }
            if (cityname) {
                var a = cityname.split('_');
                if (a[1]) {
                    query.cityname = a[1];
                }
            }
            weego_city.currentPage = pageno;
            weego_city.defaultView = new weego_city.AppView();
            weego_city.defaultView.getData(weego_city.currentPage, query);
        },
        list_city: function () {
            $('#tab-city').siblings().removeClass('active');
            $('#tab-city').addClass('active');
            weego_city.currentPage = 1;
            weego_city.defaultView = new weego_city.AppView();
            weego_city.defaultView.getData(weego_city.currentPage)
        },
        // city_attractions:function (name, pageno) {
        //     $('#tab-attractions').siblings().removeClass('active');
        //     $('#tab-attractions').addClass('active');
        //     weego.name = name;
        //     weego.currentPage = pageno;
        //     weego.defaultView = new weego.AppView();
        //     weego.defaultView.getData(weego.currentPage, weego.name);
        // },
        list_attractions: function (pageno, cityname, attrname) {
            $('#tab-attractions').siblings().removeClass('active');
            $('#tab-attractions').addClass('active');
            var query = {};
            if (cityname) {
                var a = cityname.split('_');
                if (a[1]) {
                    query.cityname = a[1];
                }
            }
            if (attrname) {
                var a = attrname.split('_');
                if (a[1]) {
                    query.attrname = a[1];
                }
            }
            // weego.name = '';
            weego.currentPage = (pageno == null ? 1 : pageno);
            weego.defaultView = new weego.AppView({
                cityname: cityname
            });
            weego.defaultView.getData(weego.currentPage, query);
        },
        showAttractionView: function (id) {
            $('#app').off();
            $('#app').empty();

            if (id == null) {
                new weego.AttractionsDetailView().render(this).$el.appendTo($('#app'));
                initialize();
            } else {
                var attractionModel = new weego.AttractionsModel();
                attractionModel.set('_id', id);
                attractionModel.fetch({
                    success: function () {
                        var showAttractionsDetailView = new weego.ShowAttractionsDetailView();
                        showAttractionsDetailView.model = attractionModel;
                        showAttractionsDetailView.render().$el.appendTo($('#app'));
                        initialize();
                    }
                });
            }
        },
        showHotelDetailView: function (id) {
            $('#app').off();
            $('#app').empty();

            if (id == null)
                (new HotelView({
                    model: new HotelModel()
                })).render().$el.appendTo($('#app'));
            else {
                var hotelModel = new HotelModel();
                hotelModel.set('_id', id);
                hotelModel.fetch({
                    success: function () {
                        var hotelView = new HotelView({
                            model: hotelModel
                        });
                        hotelView.render().$el.appendTo($('#app'));
                        hotelView.initMarkDown(); //初始化markdown
                    }
                });
            }
        },
        showHotelListView: function (page, cityname, hotelname) {
            $('#app').off();
            $('#app').empty();
            if (page == null) {
                var query = {};
                var hotelListView = new HotelListView(query);
                hotelListView.render().showFirstPage();
                hotelListView.$el.appendTo($('#app'));
            }
            if (page != null) {
                var query = {};
                if (cityname) {
                    var a = cityname.split('_');
                    if (a[1]) {
                        query.cityname = a[1];
                    }
                }
                if (hotelname) {
                    var a = hotelname.split('_');
                    if (a[1]) {
                        query.hotelname = a[1];
                    }
                }
                var hotelListView = new HotelListView(query);
                hotelListView.render();
                hotelListView.showByPage(page);
                hotelListView.$el.appendTo($('#app'));
            }
            $('#tab-hotels')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showLifeListView2: function (page, type, cityname, areaname) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            var model = {};
            model.type = type;
            if (cityname) {
                var a = cityname.split('_');
                if (a[1]) {
                    model.cityname = a[1];
                }
            }
            if (areaname) {
                var a = areaname.split('_');
                if (a[1]) {
                    model.areaname = a[1];
                }
            }
            if (page == null) {
                var lifeListView = new LifeListView(model);
                lifeListView.render().showFirstPage();
                lifeListView.$el.appendTo($('#app'));
            } else {
                var lifeListView = new LifeListView(model);

                lifeListView.render();
                lifeListView.showByPage(page);
                lifeListView.$el.appendTo($('#app'));
            }

            $('#tab-life')
                .addClass('active')
                .siblings().removeClass('active');

            $('.back_cur_city').prop("href", "/index.html#city/1/q_/" + cityname);
        },
        showLifeListView1: function (page, type, cityname, lifename) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            var model = {};
            model.type = type;
            if (cityname) {
                var a = cityname.split('_');
                if (a[1]) {
                    model.cityname = a[1];
                }
            }
            if (lifename) {
                var a = lifename.split('_');
                if (a[1]) {
                    model.lifename = a[1];
                }
            }
            if (page == null) {
                var lifeListView = new LifeListView(model);
                lifeListView.render().showFirstPage();
                lifeListView.$el.appendTo($('#app'));
            } else {
                var lifeListView = new LifeListView(model);

                lifeListView.render();
                lifeListView.showByPage(page);
                lifeListView.$el.appendTo($('#app'));
            }

            $('#tab-life')
                .addClass('active')
                .siblings().removeClass('active');

            $('.back_cur_city').prop("href", "/index.html#city/1/q_/" + cityname);
        },
        showLifeListView: function (page, type, cityname, lifename, tags) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            var model = {};
            model.tags = "";
            model.type = type;
            if (cityname) {
                var a = cityname.split('_');
                if (a[1]) {
                    model.cityname = a[1];
                }
            }
            if (lifename) {
                var a = lifename.split('_');
                if (a[1]) {
                    model.lifename = a[1];
                }
            }
            if (tags) {
                model.tags = tags;
                // model.tags =  tags.split("=");
                // model.tags = model.tags[1].split(",");
            }
            // if(isLocalFlag){
            //     var a=isLocalFlag.split('=');
            //     if(a[1]){
            //         model.isLocalFlag = a[1];
            //     }
            // }
            // if(isMichilinFlag){
            //     var a=isMichilinFlag.split('=');
            //     if(a[1]){
            //         model.isMichilinFlag = a[1];
            //     }
            // }
            // if(isBestDinnerchoics){
            //     var a=isBestDinnerchoics.split('=');
            //     if(a[1]){
            //         model.isBestDinnerchoics = a[1];
            //     }
            // }
            // if(isMostPopular){
            //     var a=isMostPopular.split('=');
            //     if(a[1]){
            //         model.isMostPopular = a[1];
            //     }
            // }
            if (page == null) {
                var lifeListView = new LifeListView(model);
                lifeListView.render().showFirstPage();
                lifeListView.$el.appendTo($('#app'));
            } else {
                var lifeListView = new LifeListView(model);
                lifeListView.render();
                lifeListView.showByPage(page);
                lifeListView.$el.appendTo($('#app'));
            }

            $('#tab-life')
                .addClass('active')
                .siblings().removeClass('active');

            $('.back_cur_city').prop("href", "/index.html#city/1/q_/" + cityname);
        },
        showLifeDetailView: function (id, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (id == null) {
                var lifeListView = null;
                if (type == '1') {
                    lifeListView = new LifeView({
                        model: new RestaurantModel()
                    });
                } else if (type == '2') {
                    lifeListView = new LifeView({
                        model: new ShoppingModel()
                    });
                } else {
                    lifeListView = new LifeView({
                        model: new EntertainmentModel()
                    });
                }
                lifeListView.render().$el.appendTo($('#app'));
            } else {
                if (type == '1') {
                    var restaurantModel = new RestaurantModel();
                    restaurantModel.set('_id', id);
                    restaurantModel.fetch({
                        success: function () {
                            restaurantModel.set('type', '1');
                            var restaurantView = new LifeView({
                                model: restaurantModel
                            });
                            restaurantView.render().$el.appendTo($('#app'));
                        }
                    });
                    // $.ajax({
                    //     url: '/restaurant/'+ id ,
                    //     success: function(data){
                    //         console.log(data);
                    //         // $('#lifeDetailView').html(data.toJSON());
                    //         // var template = Handlebars.compile($('#lifeDetailView').html());
                    //         // console.log(template);
                    //         // $('#app').append(template(data[0]));
                    //         // console.log(template(data[0]));
                    //         var restaurantModel = new RestaurantModel();
                    //         restaurantModel.set({
                    //             '_id', id

                    //         });
                    //         var restaurantView = new LifeView({
                    //             model: restaurantModel
                    //         });
                    //         restaurantView.render().$el.appendTo($('#app'));
                    //     }
                    // })
                } else if (type == '2') {
                    var shoppingModel = new ShoppingModel();
                    shoppingModel.set('_id', id);
                    shoppingModel.fetch({
                        success: function (a) {
                            shoppingModel.set('type', '2');
                            var shoppingView = new LifeView({
                                model: shoppingModel
                            });
                            shoppingView.render().$el.appendTo($('#app'));
                        }
                    });
                } else {
                    var entertainmentModel = new EntertainmentModel();
                    entertainmentModel.set('_id', id);
                    entertainmentModel.fetch({
                        success: function () {
                            entertainmentModel.set('type', '3');
                            var entertainmentView = new LifeView({
                                model: entertainmentModel
                            });
                            entertainmentView.render().$el.appendTo($('#app'));
                        }
                    });
                }
            }
        },
        showCategoryListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var categoryListView = new CategoryListView({
                    type: type
                });
                categoryListView.render().showFirstPage();
                categoryListView.$el.appendTo($('#app'));
            } else {
                var categoryListView = new CategoryListView({
                    type: type
                });
                categoryListView.render();
                categoryListView.showByPage(page, type);
                categoryListView.$el.appendTo($('#app'));
            }
            $('#tab-category')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showBrandListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var brandListView = new BrandListView({
                    type: type
                });
                brandListView.render().showFirstPage();
                brandListView.$el.appendTo($('#app'));
            } else {
                var brandListView = new BrandListView({
                    type: type
                });
                brandListView.render();
                brandListView.showByPage(page, type);
                brandListView.$el.appendTo($('#app'));
            }
            $('#tab-brand')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showEvent_cmsListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var event_cmsListView = new Event_cmsListView({
                    type: type
                });
                event_cmsListView.render().showFirstPage();
                event_cmsListView.$el.appendTo($('#app'));
            } else {
                var event_cmsListView = new Event_cmsListView({
                    type: type
                });
                event_cmsListView.render();
                event_cmsListView.showByPage(page, type);
                event_cmsListView.$el.appendTo($('#app'));
            }
            $('#tab-event_cms')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showVersion_mangListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var version_mangListView = new Version_mangListView({
                    type: type
                });
                version_mangListView.render().showFirstPage();
               version_mangListView.$el.appendTo($('#app'));
            } else {
                var version_mangListView = new Version_mangListView({
                    type: type
                });
                version_mangListView.render();
                version_mangListView.showByPage(page, type);
                version_mangListView.$el.appendTo($('#app'));
            }
            $('#tab-version_mang')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showRecommendRuleListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var recommendRuleListView = new RecommendRuleListView({
                    type: type
                });
                recommendRuleListView.render().showFirstPage();
               recommendRuleListView.$el.appendTo($('#app'));
            } else {
                var recommendRuleListView = new RecommendRuleListView({
                    type: type
                });
                recommendRuleListView.render();
                recommendRuleListView.showByPage(page, type);
                recommendRuleListView.$el.appendTo($('#app'));
            }
            $('#tab-recommendRule')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showRecommendTimeListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var recommendTimeListView = new RecommendTimeListView({
                    type: type
                });
                recommendTimeListView.render().showFirstPage();
               recommendTimeListView.$el.appendTo($('#app'));
            } else {
                var recommendTimeListView = new RecommendTimeListView({
                    type: type
                });
                recommendTimeListView.render();
                recommendTimeListView.showByPage(page, type);
                recommendTimeListView.$el.appendTo($('#app'));
            }
            $('#tab-recommendTime')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showNews_cmsListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var news_cmsListView = new News_cmsListView({
                    type: type
                });
                news_cmsListView.render().showFirstPage();
                news_cmsListView.$el.appendTo($('#app'));
            } else {
                var news_cmsListView = new News_cmsListView({
                    type: type
                });
                news_cmsListView.render();
                news_cmsListView.showByPage(page, type);
                news_cmsListView.$el.appendTo($('#app'));
            }
            $('#tab-news_cms')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showRecommendInfoListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var recommendInfoListView = new RecommendInfoListView({
                    type: type
                });
                recommendInfoListView.render().showFirstPage();
                recommendInfoListView.$el.appendTo($('#app'));
            } else {
                var recommendInfoListView = new RecommendInfoListView({
                    type: type
                });
                recommendInfoListView.render();
                recommendInfoListView.showByPage(page, type);
                recommendInfoListView.$el.appendTo($('#app'));
            }
            $('#tab-recommendInfo')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showPeopleListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var peopleListView = new PeopleListView({
                    type: type
                });
                peopleListView.render().showFirstPage();
                peopleListView.$el.appendTo($('#app'));
            } else {
                var peopleListView = new PeopleListView({
                    type: type
                });
                peopleListView.render();
                peopleListView.showByPage(page, type);
                peopleListView.$el.appendTo($('#app'));
            }
            $('#tab-people')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showPgcListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var pgcListView = new PgcListView({
                    type: type
                });
                pgcListView.render().showFirstPage();
                pgcListView.$el.appendTo($('#app'));
            } else {
                var pgcListView = new PgcListView({
                    type: type
                });
                pgcListView.render();
                pgcListView.showByPage(page, type);
                pgcListView.$el.appendTo($('#app'));
            }
            $('#tab-pgc')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showBannerListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var bannerListView = new BannerListView({
                    type: type
                });
                bannerListView.render().showFirstPage();
                bannerListView.$el.appendTo($('#app'));
            } else {
                var bannerListView = new BannerListView({
                    type: type
                });
                bannerListView.render();
                bannerListView.showByPage(page, type);
                bannerListView.$el.appendTo($('#app'));
            }
            $('#tab-banner')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showActivityListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var activityListView = new ActivityListView({
                    type: type
                });
                activityListView.render().showFirstPage();
                activityListView.$el.appendTo($('#app'));
            } else {
                var activityListView = new ActivityListView({
                    type: type
                });
                activityListView.render();
                activityListView.showByPage(page, type);
                activityListView.$el.appendTo($('#app'));
            }
            $('#tab-activity')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showCategoryDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var categoryView = new CategoryView({
                    model: new CategoryModel()
                });
                categoryView.render().$el.appendTo($('#app'));
            } else {
                var categoryModel = new CategoryModel();
                categoryModel.set('_id', id);
                categoryModel.fetch({
                    success: function () {
                        var categoryView = new CategoryView({
                            model: categoryModel
                        });
                        categoryView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showBrandDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var brandView = new BrandView({
                    model: new BrandModel()
                });
                brandView.render().$el.appendTo($('#app'));
            } else {
                var brandModel = new BrandModel();
                brandModel.set('_id', id);
                brandModel.fetch({
                    success: function () {
                        var brandView = new BrandView({
                            model: brandModel
                        });
                        brandView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showEvent_cmsDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var event_cmsView = new Event_cmsView({
                    model: new Event_cmsModel()
                });
                event_cmsView.render().$el.appendTo($('#app'));
            } else {
                var event_cmsModel = new Event_cmsModel();
                event_cmsModel.set('_id', id);
                event_cmsModel.fetch({
                    success: function () {
                        var event_cmsView = new Event_cmsView({
                            model: event_cmsModel
                        });
                        event_cmsView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showVersion_mangDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var version_mangView = new Version_mangView({
                    model: new Version_mangModel()
                });
                version_mangView.render().$el.appendTo($('#app'));
            } else {
                var version_mangModel = new Version_mangModel();
                version_mangModel.set('_id', id);
                version_mangModel.fetch({
                    success: function () {
                        var version_mangView = new Version_mangView({
                            model: version_mangModel
                        });
                        version_mangView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showRecommendRuleDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var recommendRuleView = new RecommendRuleView({
                    model: new RecommendRuleModel()
                });
                recommendRuleView.render().$el.appendTo($('#app'));
            } else {
                var recommendRuleModel = new RecommendRuleModel();
                recommendRuleModel.set('_id', id);
                recommendRuleModel.fetch({
                    success: function () {
                        var recommendRuleView = new RecommendRuleView({
                            model: recommendRuleModel
                        });
                        recommendRuleView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showRecommendTimeDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var recommendTimeView = new RecommendTimeView({
                    model: new RecommendTimeModel()
                });
                recommendTimeView.render().$el.appendTo($('#app'));
            } else {
                var recommendTimeModel = new RecommendTimeModel();
                recommendTimeModel.set('_id', id);
                recommendTimeModel.fetch({
                    success: function () {
                        var recommendTimeView = new RecommendTimeView({
                            model: recommendTimeModel
                        });
                        recommendTimeView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showNews_cmsDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var news_cmsView = new News_cmsView({
                    model: new News_cmsModel()
                });
                news_cmsView.render().$el.appendTo($('#app'));
            } else {
                var news_cmsModel = new News_cmsModel();
                news_cmsModel.set('_id', id);
                news_cmsModel.fetch({
                    success: function () {
                        var news_cmsView = new News_cmsView({
                            model: news_cmsModel
                        });
                        news_cmsView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showRecommendInfoDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var recommendInfoView = new RecommendInfoView({
                    model: new RecommendInfoModel()
                });
                recommendInfoView.render().$el.appendTo($('#app'));
            } else {
                var recommendInfoModel = new RecommendInfoModel();
                recommendInfoModel.set('_id', id);
                recommendInfoModel.fetch({
                    success: function () {
                        var recommendInfoView = new RecommendInfoView({
                            model: recommendInfoModel
                        });
                        recommendInfoView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showPeopleDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var peopleView = new PeopleView({
                    model: new PeopleModel()
                });
                peopleView.render().$el.appendTo($('#app'));
            } else {
                var peopleModel = new PeopleModel();
                peopleModel.set('_id', id);
                peopleModel.fetch({
                    success: function () {
                        var peopleView = new PeopleView({
                            model: peopleModel
                        });
                        peopleView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showPgcDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var pgcView = new PgcView({
                    model: new PgcModel()
                });
                pgcView.render().$el.appendTo($('#app'));
            } else {
                var pgcModel = new PgcModel();
                pgcModel.set('_id', id);
                pgcModel.fetch({
                    success: function () {
                        var pgcView = new PgcView({
                            model: pgcModel
                        });
                        pgcView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showBannerDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var bannerView = new BannerView({
                    model: new BannerModel()
                });
                bannerView.render().$el.appendTo($('#app'));
            } else {
                var bannerModel = new BannerModel();
                bannerModel.set('_id', id);
                bannerModel.fetch({
                    success: function () {
                        var bannerView = new BannerView({
                            model:bannerModel
                        });
                        bannerView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showActivityDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var activityView = new ActivityView({
                    model: new ActivityModel()
                });
                activityView.render().$el.appendTo($('#app'));
            } else {
                var activityModel = new ActivityModel();
                activityModel.set('_id', id);
                activityModel.fetch({
                    success: function () {
                        var activityView = new ActivityView({
                            model: activityModel
                        });
                        activityView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showLifetagListView: function (page, type) {
            $('#app').off();
            $('#app').empty();
            if (type == null)
                type = '1';
            if (page == null) {
                var lifetagListView = new LifetagListView({
                    type: type
                });
                lifetagListView.render().showFirstPage();
                lifetagListView.$el.appendTo($('#app'));
            } else {
                var lifetagListView = new LifetagListView({
                    type: type
                });
                lifetagListView.render();
                lifetagListView.showByPage(page, type);
                lifetagListView.$el.appendTo($('#app'));
            }
            $('#tab-lifetag')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showLifetagDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var lifetagView = new LifetagView({
                    model: new LifetagModel()
                });
                lifetagView.render().$el.appendTo($('#app'));
            } else {
                var lifetagModel = new LifetagModel();
                lifetagModel.set('_id', id);
                lifetagModel.fetch({
                    success: function () {
                        var lifetagView = new LifetagView({
                            model: lifetagModel
                        });
                        lifetagView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },
        showAreaListView: function (page) {
            $('#app').off();
            $('#app').empty();
            if (page == null) {
                var areaListView = new AreaListView();
                areaListView.render().showFirstPage();
                areaListView.$el.appendTo($('#app'));
            } else {
                var areaListView = new AreaListView();
                areaListView.render();
                areaListView.showByPage(page);
                areaListView.$el.appendTo($('#app'));
            }
            $('#tab-area')
                .addClass('active')
                .siblings().removeClass('active');
        },
        showAreaDetailView: function (id) {
            $('#app').off();
            $('#app').empty();
            if (id == null) {
                var areaView = new AreaView({
                    model: new AreaModel()
                });
                areaView.render().$el.appendTo($('#app'));
            } else {
                var areaModel = new AreaModel();
                areaModel.set('_id', id);
                areaModel.fetch({
                    success: function () {
                        var areaView = new AreaView({
                            model: areaModel
                        });
                        areaView.render().$el.appendTo($('#app'));
                    }
                });
            }
        },

    });
    weego.currentPage = 1;
    weego.sumpages = 1;
    weego.limit = 10;
    weego.z_index = 2000;
    weego.count = 0;
    weego.name;
    weego.globalCurrentUrl = '';
    weego.AttractionsModel = Backbone.Model.extend({
        urlRoot: '/attractions',
        idAttribute: "_id"
    });
    weego.AttractionsColletion = Backbone.Collection.extend({
        //        url:'/getAllAttractions',
        model: weego.AttractionsModel
    });

    weego.LabelModel = Backbone.Model.extend({
        urlRoot: '/addlabel'
    });

    weego.CityModel = Backbone.Model.extend({
        urlRoot: ''
    });
    weego.CityCollection = Backbone.Collection.extend({
        model: weego.CityModel
    });

    weego.AuditingModel = Backbone.Model.extend({
        urlRoot: '/auditing',
        idAttribute: "_id"
    });

    Handlebars.registerHelper('ifCond', function (v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifBig', function (v1, v2, options) {
        if (v1 > v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifHas', function (collection, value, options) {
        var exist = false;
        _.each(collection, function (v) {
            if (v == value)
                exist = true;
        });
        if (exist)
            return options.fn(this);
        return options.inverse(this);
    });
    Handlebars.registerHelper('ifHas', function (v1, v2, options) {
        if (v1.indexOf(v2) >= 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    //------------------------#load------------------------------------------------------------------ 

    $("#hotelDetailView").load("templ/hotel_detail.html", function () {
        console.log('load hotelDetailView over!');
    });
    $("#attractions_template").load("templ/attraction.html", function () {
        console.log('load attractions_template over!');
    });

    $("#attractions_detail_template").load("templ/attraction_editor.html", function () {
        console.log('load attractions_detail_template over!');
    });
    $("#add_city_template").load("templ/city.html", function () {
        console.log('load add_city_template over!');
    });
    $("#city_edit_template").load("templ/city_editor.html", function () {
        console.log('load city_edit_template over!');
    });
    $("#add_label_template").load("templ/label.html", function () {
        console.log('load add_label_template over!');
    });
    $("#label_edit_template").load("templ/label_editor.html", function () {
        console.log('load label_edit_template over!');
    });
    $("#add_user_template").load("templ/user.html", function () {
        console.log('load add_user_template over!');
    });
    $("#edit_user_template").load("templ/user_editor.html", function () {
        console.log('load edit_user_template over!');
    });
    $("#categoryDetailView").load("templ/category_detail.html", function () {
        console.log('load categoryDetailView over!');
    });
    $("#brandDetailView").load("templ/brand_detail.html", function () {
        console.log('load brandDetailView over!');
    });
    $("#event_cmsDetailView").load("templ/event_cms_detail.html", function () {
        console.log('load event_cmsDetailView over!');
    });
    $("#version_mangDetailView").load("templ/version_mang_detail.html", function () {
        console.log('load version_mangDetailView over!');
    });
    $("#recommendRuleDetailView").load("templ/recommendRule_detail.html", function () {
        console.log('load recommendRuleDetailView over!');
    });
    $("#recommendTimeDetailView").load("templ/recommendTime_detail.html", function () {
        console.log('load recommendTimeDetailView over!');
    });
    $("#news_cmsDetailView").load("templ/news_cms.html", function () {
        console.log('load news_cmsDetailView over!');
    });
    $("#recommendInfoDetailView").load("templ/recommendInfo_detail.html", function () {
        console.log('load recommendInfoDetailView over!');
    });
    $("#peopleDetailView").load("templ/people_detail.html", function () {
        console.log('load peopleDetailView over!');
    });
    $("#pgcDetailView").load("templ/pgc_detail.html", function () {
        console.log('load pgcDetailView over!');
    });
    $("#bannerDetailView").load("templ/banner_detail.html", function () {
        console.log('load bannerDetailView over!');
    });
    $("#activityDetailView").load("templ/activity_detail.html", function () {
        console.log('load activityDetailView over!');
    });
    $("#lifetagDetailView").load("templ/lifetag_detail.html", function () {
        console.log('load lifetagDetailView over!');
    });
    $("#lifeDetailView").load("templ/life_detail.html", function () {
        console.log('load lifeDetailView over!');
    });
    $("#areaDetailView").load("templ/area_detail.html", function () {
        console.log('load areaDetailView over!');
    });


    //----------------------------------------------------------------------------------------------   
    //add city view
    weego.AttractionsDetailView = Backbone.View.extend({
        tagName: "div",
        //className:"modal hide fade",
        //"id":"attractionsDialog",
        initialize: function () {
            _.bindAll(this, 'render', 'save');
        },
        render: function (that) {
            this.$el.css({
                width: "100%",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: 'auto',
                position: 'relative'
            });
            this.that = that;
            var _this = this;
            _this.model = new weego.AttractionsModel();
            if (weego_user.globalUser.type == 1) {
                _this.model.set('_show_flag', true);
            } else {
                _this.model.set('_show_flag', false);
            }
            var template = Handlebars.compile($("#attractions_template").html());
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            _this.initSelect();
            return this;
        },
        initSelect: function () {
            $.ajax({
                url: "/getMyToDoTasks",
                success: function (data) {
                    if (data.status) {
                        var results = data.results;
                        var option = '';
                        for (var i = 0; i < results.length; i++) {
                            var one = results[i];
                            option += '<option value="' + one._id + '" >' + one.name + '</option>';
                        }
                        $('#task_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });
        },
        events: {
            'click #save': 'save',
            'change #cityname': 'showCityLocations',
            'change #continents_select': 'selectContinent',
            'change #country_select': 'selectCountry',
            'change #city_select': 'selectCity',
            'click #addOpentime': 'addOpentime',
            'click .li-del': 'delLi',
            //            'change #attractions_en':'showLocations',
            //            'change .labels':'savelabel',
            'click #addlabel': 'addlabel',
            'click .del': 'dellabel',
            'focus .labels': 'autoget',
            'focus #masterLabel': 'autogetMasterLabel',
            'click #allday': 'selectAllDay',
            'click .editwords': 'editwords',
            'click .textareasurebtn': 'textareasure'
        },
        textareasure: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        selectAllDay: function (e) {
            e.preventDefault();
            $('#am').attr('checked', 'checked');
            $('#pm').attr('checked', 'checked');
            $('#ev').attr('checked', 'checked');
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
            $("#city").val(cityname);
        },
        addOpentime: function () {
            var open_day = $('#open-day').val();
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            // if(open_time_begin!='allday' && open_time_begin!='close' &&
            //     open_time_end!='allday' && open_time_end!='close' &&
            //     open_time_end < open_time_begin){
            //     alert('请正确选择！');
            //     return false;
            // }
            var open_time = {
                desc: $('#open-day').find("option:selected").text() + ' ' + this.getOpenTimeDesc(),
                value: open_day + '-' + open_time_begin + '-' + open_time_end
            };
            var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" ' +
                'type="text" value="' + open_time.desc + '" data-value="' + open_time.value + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#opentime-list').last().after($newitem);
        },
        getOpenTimeDesc: function () {
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            if (open_time_begin == 'allday' || open_time_end == 'allday')
                return '全天';
            else if (open_time_begin == 'close' || open_time_end == 'close')
                return '关门';
            else
                return $('#open-time-begin').find("option:selected").text() + '-' + $('#open-time-end').find("option:selected").text();
        },
        delLi: function (e) {
            $(e.target).parent().remove();
        },
        autogetMasterLabel: function (e) {
            var _this = this;
            $("#masterLabel").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLabelByLevel/1",
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label: item.label,
                                            value: item.label,
                                            sublevel_id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#masterLabel").attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        autoget: function (e) {
            var _this = this;
            $(".labels").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLabelByLabelID/" + $("#masterLabel").attr('data-value'),
                        dataType: "json",
                        success: function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label: item.label,
                                            value: item.label,
                                            sublevel_id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $(e.target).attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        dellabel: function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addlabel: function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" datatype="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        //        savelabel:function (e) {
        //            console.log($(e.target).val());
        //            var _this = this;
        //            var newlabel = new weego.LabelModel({label:$(e.target).val()});
        //            newlabel.save(null, {
        //                success:function (model, res) {
        //                    if (!res.isSuccess) {
        //                        console.log("cuole");
        //                    } else {
        //                        console.log(model._id);
        //                    }
        //                }
        //            });
        //        },
        showCityLocations: function () {
            locationCity();
        },
        showLocations: function () {
            codeAddress();
        },
        save: function () {//新增景点信息
            var _this = this;
            var cityid = $("#city_select").val();
            var place_id= $("#place_id").val().trim();
       /*     alert(place_id+'##');
            return false;*/
            var name = $("#attractions").val();
            if (!cityid || !name) {
                alert('城市和景点名称均不能为空！');
                if (!cityid) $("#city_select").focus();
                else $("#attractions").focus();
                return false;
            }

            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                var sublabel_id = $('.labels').eq(i).attr('data-value');
                var sublabel_name = $('.labels').eq(i).attr('value');
                if (sublabel_id != null && sublabel_id != '')
                    var object_label = {_id: sublabel_id, name: sublabel_name};
                array_label.push(object_label);
            }
            var show_flag = $('#show_flag').prop('checked') ? '1' : '0';
            var index_flag = $('#index_flag').prop('checked') ? '1' : '0';
            var opentimes = [];
            for (var i = 0; i < $('.opentimes').length; i++) {
                var item = {};
                item.value = $('.opentimes').eq(i).attr('data-value');
                item.desc = $('.opentimes').eq(i).attr('value');
                opentimes.push(item);
            }
            var conm = confirm('新增POI时需要进行抓数据的操作\n确定要开始抓数据了吗？');
            if (conm == true) {
                alert('那就要耐心等待。。。。');
                //return false;
            } else {
                alert('此次操作失败、请重新填写！');
                return false;
            }

            var newAttractions = new weego.AttractionsModel({
                cityname: $("#city_select").find("option:selected").text(),
                cityid: $("#city_select").val(),
                place_id:place_id,
                attractions_en: $("#attractions_en").val(),
                address: $('#address').val(),
                price: $('#price').val(),
                opentime: opentimes,
                traffic_info: $('#traffic_info').val(),
                tips: $('#tips').val(),
                dayornight: $('input:radio[name="dayornight"]:checked').val(),
                website: $("#website").val(),
                telno: $("#telno").val(),
                //activity: $("#activity").val(),
                attractions: $("#attractions").val(),
                introduce: $("#introduce").val(),
                short_introduce: $("#short_introduce").val(),
                recommand_duration: $('#recommand_duration').val(),
                recommand_reason: $('#recommand_reason').val(),
                recommand_flag: $('input:radio[name="recommand_flag"]:checked').val(),
                show_flag: show_flag,
                index_flag: index_flag,
                am: $('#am').prop('checked'),
                pm: $('#pm').prop('checked'),
                ev: $('#ev').prop('checked'),
                masterLabel: [$("#masterLabel").attr('data-value'), $("#masterLabel").attr('value')],
                subLabel: array_label,
                latitude: $("#latitude").val(),
                longitude: $("#longitude").val()
            });
            newAttractions.save(null, {
                success: function (model, res) {
                    if (!res.isSuccess) {
                        alert('保存失败');
                    } else {
                        var auditingModel = new weego.AuditingModel({
                            city_id: $("#city_select").val(),
                            city_name: $("#city_select").find("option:selected").text(),
                            task_id: $("#task_select").val(),
                            task_name: $("#task_select").find("option:selected").text(),
                            item_id: res._id,
                            editor_id: res.user_id,
                            type: '0',
                            log_type: '0',
                            name: $('#attractions').val()
                        });

                        auditingModel.save(null, {
                            success: function (model, res) {
                                if (!res.isSuccess) {
                                    alert('保存景点成功，但auditing保存失败！');
                                } else
                                    alert('保存成功');
                                self.location = '#attractions';
                                // weego.defaultView.getData(weego.currentPage, model.get('cityname'));
                            },
                            error: function () {
                             /*
                                alert(JSON.stringify(model));
                                alert('*****');
                                alert(JSON.stringify(auditingModel));*/
                                //alert(typeof(model.attractions_en));
                                if(typeof(model.attractions_en)=='undefined'){
                                    alert('保存景点成功、请通过编辑补充未抓取到的数据!!!\n同时auditing也保存失败！');
                                }else{
                                alert('保存景点成功，但auditing保存失败！');
                                }
                            }
                        });
                    }
                },
                error: function () {
                    alert('保存失败');
                }
            });
            return false;
        }
    });
    weego.CityItemView = Backbone.View.extend({
        render: function (countryname, cityname, type) {
            $(this.el).html(Handlebars.compile($('#cityitem').html())({
                countryname: countryname,
                cityname: cityname,
                type: type
            }));
            return this;
        }
    })
    weego.CityPreView = Backbone.View.extend({
        tagName: 'div',
        initialize: function (data) {

        },
        render: function (data) {
            weego.result = data;
            console.log(data);
            var city = data.results.city;
            var currentuser = data.results.currentuser;
            var edituser = data.results.edituser;
            var enedituser = data.results.eneditoruser;
            var audits = data.results.audits;
            var attractionscount = data.results.attractionscount;
            var restaurantscount = data.results.restaurantscount;
            var shopareacount = data.results.shopareacount;
            var shoppingscount = data.results.shoppingscount;
            // var masterLabel         = data.results.masterLabel.label;
            //获得主标签
            this.getLabelByLabelID(city.masterLabel);
            $(this.el).html(Handlebars.compile($('#city_preview').html())({
                city: city,
                currentuser: currentuser,
                edituser: edituser,
                enedituser: enedituser,
                audits: audits,
                attractionscount: attractionscount,
                restaurantscount: restaurantscount,
                shopareacount: shopareacount,
                shoppingscount: shoppingscount,
                // masterLabel         : masterLabel
            }));
            return this;

        },
        events: {
            'click #modify': 'modify',
            'click #submitaudit': 'submitaudit',
            'click #submitenaudit': 'submitenaudit',
            'click #citypass': 'citypass',
            'click #cityunpass': 'cityunpass',
            'click #encitypass': 'encitypass',
            'click #encityunpass': 'encityunpass'
        },
        getLabelByLabelID: function (id) {
            // $.ajax({
            //     method: 'GET',
            //     url: "/getLabelByLabId/" + id,
            //     dataType: "json",
            //     success: function(data) {
            //         console.log('=========>'+data)
            //         // response(
            //         //     $.map(
            //         //         data.label, function(item) {
            //         //             return {
            //         //                 label: item.label,
            //         //                 value: item.label,
            //         //                 sublevel_id: item._id
            //         //             }
            //         //         }));
            //     }
            // });
        },
        modify: function () {
            var EditCityView = new weego.EditCityView();
            var _id = weego.result.results.city._id;
            console.log(weego.result);
            $('#app').html('').append(EditCityView.render(weego.result.results.city).$el);
            var images = weego.result.results.city.image;
            $('#city-dropzone').dropzone({
                addRemoveLinks: true,
                headers: {
                    _id: _id
                },
                init: function () {
                    if (images) {
                        for (var i = 0; i < images.length; i++) {
                            var mockFile = {
                                name: images[i],
                                size: 12345
                            };
                            // Call the default addedfile event handler
                            this.emit("addedfile", mockFile);
                            var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default' data-value='" + images[i] + "'>设为封面</button>");
                            removeButton.addEventListener('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                $el = $(e.currentTarget);
                                var imagename = $el.attr('data-value');
                                $.ajax({
                                    url: '/setCityCoverImg/' + _id + '/' + imagename,
                                    success: function (data) {
                                        if (data) {
                                            for (var i = 0; i < $('.setcover').length; i++) {
                                                $('.setcover').eq(i).removeClass('btn-success');
                                            }
                                            ;
                                            $el.addClass('btn-success');
                                        }
                                    }
                                });
                            })
                            mockFile.previewElement.appendChild(removeButton);

                            // And optionally show the thumbnail of the file:
                            this.emit("thumbnail", mockFile, "http://weegotest.b0.upaiyun.com/city/imgsizeC2/" + images[i]);
                        }
                        ;
                    }


                    this.on("addedfile", function (file) {
                        var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default'>设为封面</button>");
                        removeButton.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            $.ajax({
                                url: '/setCityCoverImg/' + _id + '/' + file.name,
                                success: function (data) {
                                    if (data) {
                                        alert('设置成功');
                                        this.siblings('.setcover').removeClass('btn-success').addClass('btn-success');
                                    }
                                }
                            });
                        })
                        file.previewElement.appendChild(removeButton);
                    });
                    this.on("removedfile", function (file) {
                        $.ajax({
                            url: '/delCoverImage/' + _id + '/' + file.name,
                            success: function (data) {
                                if (data.status == 'success') {
                                    console.log('删除成功');
                                }
                            }
                        })
                    });
                }
            })
            var bgimages = weego.result.results.city.backgroundimage;
            $('#citybgimages-dropzone').dropzone({
                addRemoveLinks: true,
                headers: {
                    _id: weego.result.results.city._id
                },
                init: function () {
                    if (bgimages) {
                        for (var i = 0; i < bgimages.length; i++) {
                            var mockFile = {
                                name: bgimages[i],
                                size: 12345
                            };
                            // Call the default addedfile event handler
                            this.emit("addedfile", mockFile);

                            // And optionally show the thumbnail of the file:
                            this.emit("thumbnail", mockFile, "http://weegotest.b0.upaiyun.com/city/imgsizeC1/" + bgimages[i]);
                        }
                        ;
                    }

                    this.on("removedfile", function (file) {
                        $.ajax({
                            url: '/delBackgroundImage/' + _id + '/' + file.name,
                            success: function (data) {
                                if (data.status == 'success') {
                                    console.log('删除成功');
                                }
                            }
                        })
                    });
                }
            })
            //  $('#dropzone').dropzone({
            //     url: "handle-upload.php",
            //     maxFiles: 10,
            // });
        },
        submitaudit: function () {
            var currentuser = weego.result.results.currentuser;
            var auditmsg = {
                attractionscount: weego.result.results.attractionscount,
                restaurantscount: weego.result.results.restaurantscount,
                shopareacount: weego.result.results.shopareacount,
                shoppingscount: weego.result.results.shoppingscount,
                city_name: weego.result.results.city.cityname,
                item_id: weego.result.results.city._id,
                countryname: weego.result.results.city.countryname,
                editorname: $('#cn_editor').find('option:selected').text(),
                auditorname: $('#auditorname').find('option:selected').text(),
                editdate: new Date().toLocaleString(),
                auditdate: '',
                status: 1,
                type: 'city',
                en_info: {}
            };
            console.log(auditmsg);
            if (auditmsg.editorname && auditmsg.auditorname) {

                if (auditmsg.editorname == auditmsg.auditorname) {
                    alert('编辑和审核不能为同一人');
                    return false;
                } else {
                    auditmsg = JSON.stringify(auditmsg);
                    $.post('/savetoauditing', {
                        auditmsg: auditmsg
                    }, function (data) {
                        if (data.status == 'success') {
                            //改变审核按钮的状态
                            $('#submitaudit').addClass('btn-warning ').text('审核中').attr('disabled', 'disabled');
                        }


                        //使用socket.io来给审核者发送信息
                        // var socket = io.connect();
                        // var message = auditmsg.city_name;
                        // socket.emit('audittask', {
                        //     from    : auditmsg.editorname,
                        //     to      : auditmsg.auditorname,
                        //     message : auditmsg.city_name
                        // });
                        // socket.on('audittask', function(data){
                        //     console.log(data);
                        //     var item  = '<a>'+ message +'</a>';
                        //     $('#app').append(item);
                        // })
                    })
                }
                ;
            }

        },
        submitenaudit: function () {
            var currentuser = weego.result.results.currentuser;
            var auditmsg = {
                attractionscount: weego.result.results.attractionscount,
                restaurantscount: weego.result.results.restaurantscount,
                shopareacount: weego.result.results.shopareacount,
                shoppingscount: weego.result.results.shoppingscount,
                city_name: weego.result.results.city.cityname,
                item_id: weego.result.results.city._id,
                countryname: weego.result.results.city.countryname,
                // editorname       : $('#cn_editor').find('option:selected').text(),
                // auditorname      : $('#auditorname').find('option:selected').text(),
                // editdate         : new Date().toLocaleString(),
                // auditdate        : '',
                type: 'city',
                en_info: {
                    status: 1,
                    editorname: $('#en_editor').find('option:selected').text(),
                    auditorname: $('#enauditorname').find('option:selected').text()
                }
            };
            if (auditmsg.en_info.editorname && auditmsg.en_info.auditorname) {

                if (auditmsg.en_info.editorname == auditmsg.en_info.auditorname) {
                    alert('编辑和审核不能为同一人');
                    return false;
                } else {
                    console.log(auditmsg);
                    auditmsg = JSON.stringify(auditmsg);
                    $.post('/savetoauditing', {
                        auditmsg: auditmsg
                    }, function (data) {
                        if (data.status == 'success') {
                            //改变审核按钮的状态
                            $('#submitenaudit').addClass('btn-warning ').text('审核中').attr('disabled', 'disabled');
                        }
                    })
                }
                ;
            }
        },
        citypass: function () {
            var model = {
                item_id: weego.result.results.city._id + '',
                city_name: weego.result.results.city.cityname,
                status: '2',
                type: 'city',
                attractionscount: weego.result.results.attractionscount,
                restaurantscount: weego.result.results.restaurantscount,
                shopareacount: weego.result.results.shopareacount,
                shoppingscount: weego.result.results.shoppingscount,
                editorname: weego.result.results.audits.editorname,
                editdate: weego.result.results.audits.editdate,
                auditorname: weego.result.results.audits.auditorname,
                auditdate: new Date().toLocaleString(),

            }
            model.auditcomment = $('#auditcomment').val();
            $('#citypass').attr('disabled', 'disabled');
            $('#cityunpass').remove();
            model = JSON.stringify(model);
            console.log(model);
            $.post('/passthiscity/', {
                model: model
            }, function (data) {

            })
        },
        cityunpass: function () {
            var model = {
                item_id: weego.result.results.city._id + '',
                city_name: weego.result.results.city.cityname,
                status: '-1',
                type: 'city',
                attractionscount: weego.result.results.attractionscount,
                restaurantscount: weego.result.results.restaurantscount,
                shopareacount: weego.result.results.shopareacount,
                shoppingscount: weego.result.results.shoppingscount,
                editorname: weego.result.results.audits.editorname,
                editdate: weego.result.results.audits.editdate,
                auditorname: weego.result.results.audits.auditorname,
                auditdate: new Date().toLocaleString(),

            }
            model.auditcomment = $('#auditcomment').val();
            $('#cityunpass').attr('disabled', 'disabled');
            $('#citypass').remove();
            model = JSON.stringify(model);
            $.post('/passthiscity/', {
                model: model
            }, function (data) {

            })
        },
        encitypass: function () {
            var model = {
                item_id: weego.result.results.city._id,
                en_info: {
                    status: '2',
                }
            }
            console.log(model);
            model = JSON.stringify(model);
            $.post('/passthiscity/', {
                model: model
            }, function (data) {

            })
        },
        encityunpass: function () {
            var model = {
                item_id: weego.result.results.city._id,
                en_info: {
                    status: '-1'
                }
            }
            model = JSON.stringify(model);
            $.post('/passthiscity/', {
                model: model
            }, function (data) {

            })
        }
    });

    weego.CityItemPreView = Backbone.View.extend({
        render: function (data, countryname, cityname, type, itemname) {
            weego.result1 = data;
            weego.result1.countryname = countryname;
            weego.type = type;
            if (type == "attractions") {
                $(this.el).html(Handlebars.compile($('#attractionspreview').html())({
                    currentuser: data.currentuser,
                    audits: data.audits,
                    edituser: data.edituser,
                    countryname: countryname,
                    cityname: cityname,
                    type: type,
                    attractions: data.cityitem,
                }));
            }
            if (type == "restaurants") {
                $(this.el).html(Handlebars.compile($('#restaurantpreview').html())({
                    currentuser: data.currentuser,
                    audits: data.audits,
                    edituser: data.edituser,
                    countryname: countryname,
                    cityname: cityname,
                    type: type,
                    restaurant: data.cityitem
                }));
            }
            if (type == "shopareas") {
                $(this.el).html(Handlebars.compile($('#shopareapreview').html())({
                    currentuser: data.currentuser,
                    audits: data.audits,
                    edituser: data.edituser,
                    countryname: countryname,
                    cityname: cityname,
                    type: type,
                    shoparea: data.cityitem
                }));
            }
            if (type == "shoppings") {
                $(this.el).html(Handlebars.compile($('#shoppingpreview').html())({
                    currentuser: data.currentuser,
                    audits: data.audits,
                    edituser: data.edituser,
                    countryname: countryname,
                    cityname: cityname,
                    type: type,
                    shopping: data.cityitem,
                }));
            }
            return this;
        },
        events: {
            'click #modify': 'modify',
            'click #submitaudit': 'submitaudit',
            'click #citypass': 'citypass',
            'click #cityunpass': 'cityunpass'
        },
        modify: function () {
            if (weego.type == "attractions") {
                var attractionview = new weego.EditAttractionsView();
                $('#app').html('').append(attractionview.render(weego.result1.cityitem).$el);
                var images = weego.result1.cityitem.image;
                var _id = weego.result1.cityitem._id;

                $('#attraction-dropzone').dropzone({
                    addRemoveLinks: true,
                    headers: {
                        _id: weego.result1.cityitem._id
                    },
                    init: function () {
                        if (images) {
                            for (var i = 0; i < images.length; i++) {
                                var mockFile = {
                                    name: images[i],
                                    size: 12345
                                };
                                // Call the default addedfile event handler
                                this.emit("addedfile", mockFile);
                                var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default' data-value='" + images[i] + "'>设为封面</button>");
                                removeButton.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $el = $(e.currentTarget);
                                    var imagename = $el.attr('data-value');
                                    $.ajax({
                                        url: '/setCoverImg/' + _id + '/' + imagename,
                                        success: function (data) {
                                            if (data) {
                                                for (var i = 0; i < $('.setcover').length; i++) {
                                                    $('.setcover').eq(i).removeClass('btn-success');
                                                }
                                                ;
                                                $el.addClass('btn-success');
                                            }
                                        }
                                    });
                                })
                                mockFile.previewElement.appendChild(removeButton);

                                // And optionally show the thumbnail of the file:
                                this.emit("thumbnail", mockFile, "http://weegotest.b0.upaiyun.com/attractions/origin/" + images[i]);
                            }
                            ;
                        }

                        this.on("addedfile", function (file) {
                            var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default'>设为封面</button>");
                            var _this = this;
                            removeButton.addEventListener('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                $.ajax({
                                    url: '/setCoverImg/' + _id + '/' + file.name,
                                    success: function (data) {
                                        if (data) {
                                            alert('设置成功');
                                            _this.siblings('.setcover').removeClass('btn-success').addClass('btn-success');
                                        }
                                    }
                                });
                            })
                            file.previewElement.appendChild(removeButton);
                        });
                        this.on("removedfile", function (file) {
                            $.ajax({
                                url: '/delUploadImage/' + _id + '/' + file.name,
                                success: function (data) {
                                    if (data.status == 'success') {
                                        console.log('删除成功');
                                    }
                                }
                            })
                        });
                    }
                })
            }
            if (weego.type == "restaurants" || weego.type == "shoppings") {
                var EditCityItemView = new weego.EditCityItemView();
                $('#app').html('').append(EditCityItemView.render(weego.result1.cityitem).$el);
                var images = weego.result1.cityitem.image;
                var _id = weego.result1.cityitem._id;
                var type = weego.result1.cityitem.type;
                $('#resshop-dropzone').dropzone({
                    addRemoveLinks: true,
                    headers: {
                        _id: weego.result1.cityitem._id,
                        type: type
                    },
                    init: function () {
                        if (images) {
                            for (var i = 0; i < images.length; i++) {
                                var mockFile = {
                                    name: images[i],
                                    size: 12345
                                };
                                // Call the default addedfile event handler
                                this.emit("addedfile", mockFile);
                                var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default' data-value='" + images[i] + "'>设为封面</button>");
                                removeButton.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $el = $(e.currentTarget);
                                    var imagename = $el.attr('data-value');
                                    $.ajax({
                                        url: '/setCoverImgLife/' + _id + '/' + imagename + '/' + type,
                                        success: function (data) {
                                            if (data) {
                                                for (var i = 0; i < $('.setcover').length; i++) {
                                                    $('.setcover').eq(i).removeClass('btn-success');
                                                }
                                                ;
                                                $el.addClass('btn-success');
                                            }
                                        }
                                    });
                                })
                                mockFile.previewElement.appendChild(removeButton);

                                // And optionally show the thumbnail of the file:
                                if (weego.type == "restaurants") {
                                    this.emit("thumbnail", mockFile, "http://weegotest.b0.upaiyun.com/restaurant/origin/" + images[i]);
                                } else if (weego.type == "shoppings") {
                                    this.emit("thumbnail", mockFile, "http://weegotest.b0.upaiyun.com/shopping/origin/" + images[i]);
                                }
                            }
                            ;
                        }

                        this.on("addedfile", function (file) {
                            var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default'>设为封面</button>");
                            var _this = this;
                            removeButton.addEventListener('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                $.ajax({
                                    url: '/setCoverImgLife/' + _id + '/' + imagename + '/' + type,
                                    success: function (data) {
                                        if (data) {
                                            alert('设置成功');
                                            _this.siblings('.setcover').removeClass('btn-success').addClass('btn-success');
                                        }
                                    }
                                });
                            })
                            file.previewElement.appendChild(removeButton);
                        });
                        this.on("removedfile", function (file) {
                            $.ajax({
                                url: '/delUploadImageLife/' + _id + '/' + file.name + '/' + type,
                                success: function (data) {
                                    if (data.status == 'success') {
                                        console.log('删除成功');
                                    }
                                }
                            })
                        });
                    }
                })
            }
            if (weego.type == "shopareas") {
                var EditAreaView = new weego.EditAreaView();
                $('#app').html('').append(EditAreaView.render(weego.result1.cityitem).$el);
                var images = weego.result1.cityitem.image;
                var _id = weego.result1.cityitem._id;
                $('#shoparea-dropzone').dropzone({
                    addRemoveLinks: true,
                    headers: {
                        _id: weego.result1.cityitem._id
                    },
                    init: function () {
                        if (images) {
                            for (var i = 0; i < images.length; i++) {
                                var mockFile = {
                                    name: images[i],
                                    size: 12345
                                };
                                // Call the default addedfile event handler
                                this.emit("addedfile", mockFile);
                                var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default' data-value='" + images[i] + "'>设为封面</button>");
                                removeButton.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    $el = $(e.currentTarget);
                                    var imagename = $el.attr('data-value');
                                    $.ajax({
                                        url: '/setAreaCoverImg/' + _id + '/' + imagename,
                                        success: function (data) {
                                            if (data) {
                                                for (var i = 0; i < $('.setcover').length; i++) {
                                                    $('.setcover').eq(i).removeClass('btn-success');
                                                }
                                                ;
                                                $el.addClass('btn-success');
                                            }
                                        }
                                    });
                                })
                                mockFile.previewElement.appendChild(removeButton);

                                // And optionally show the thumbnail of the file:
                                this.emit("thumbnail", mockFile, "http://weegotest.b0.upaiyun.com/shoparea/origin/" + images[i]);
                            }
                            ;
                        }

                        this.on("addedfile", function (file) {
                            var removeButton = Dropzone.createElement("<button type='button' class='setcover btn btn-default'>设为封面</button>");
                            var _this = this;
                            removeButton.addEventListener('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                $.ajax({
                                    url: '/setAreaCoverImg/' + _id + '/' + file.name,
                                    success: function (data) {
                                        if (data) {
                                            alert('设置成功');
                                            _this.siblings('.setcover').removeClass('btn-success').addClass('btn-success');
                                        }
                                    }
                                });
                            })
                            file.previewElement.appendChild(removeButton);
                        });
                        this.on("removedfile", function (file) {
                            $.ajax({
                                url: '/delareaimg/' + _id + '/' + file.name,
                                success: function (data) {
                                    if (data.status == 'success') {
                                        console.log('删除成功');
                                    }
                                }
                            })
                        });
                    }
                })
            }
        },
        submitaudit: function () {
            console.log(weego.result1.cityitem);
            var auditmsg = {};
            var currentuser = weego.result1.currentuser;
            auditmsg.countryname = weego.result1.countryname;
            auditmsg.item_id = weego.result1.cityitem._id;
            auditmsg.city_name = weego.result1.cityitem.city_name ? weego.result1.cityitem.city_name : weego.result1.cityitem.cityname;
            if (weego.type == "attractions") {
                auditmsg.name = weego.result1.cityitem.attractions;
            } else if (weego.type == "restaurants") {
                auditmsg.name = weego.result1.cityitem.name;
            } else if (weego.type == "shopareas") {
                auditmsg.name = weego.result1.cityitem.area_name;
            } else {
                auditmsg.name = weego.result1.cityitem.name;
            }
            auditmsg.type = weego.type;
            auditmsg.editdate = new Date().toLocaleString();
            auditmsg.auditdate = '';
            auditmsg.editorname = $('#editorname').text();
            auditmsg.auditorname = $('#auditorname').find('option:selected').text();
            // auditmsg.auditcomment = $('#auditcomment').val();
            auditmsg.status = 1;
            if (auditmsg.editorname == auditmsg.auditorname) {
                alert('编辑和审核不能为同一人');
            } else {
                $('#submitaudit').addClass('btn-warning ').text('审核中').attr('disabled', 'disabled');
                // $.ajax({
                //     url: '/savetoauditing',
                //     method: 'POST',
                //     data: auditmsg,
                //     success: function(){
                //         $('#submitaudit').addClass().text('审核中');
                //     }
                // })
                console.log(auditmsg);
                auditmsg = JSON.stringify(auditmsg);
                $.post('/savetoauditing', {
                    auditmsg: auditmsg
                }, function (data) {
                    console.log('改变审核按钮的状态');
                    //改变审核按钮的状态
                    $('#submitaudit').text('审核中');


                    //使用socket.io来给审核者发送信息
                    // var socket = io.connect();
                    // var message = auditmsg.city_name;
                    // socket.emit('audittask', {
                    //     from    : auditmsg.editorname,
                    //     to      : auditmsg.auditorname,
                    //     message : auditmsg.city_name
                    // });
                    // socket.on('audittask', function(data){
                    //     console.log(data);
                    //     var item  = '<a>'+ message +'</a>';
                    //     $('#app').append(item);
                    // })
                })
            }
            ;

        },
        citypass: function () {
            console.log(weego.result1);
            var itemname;
            if (weego.type == "attractions") {
                itemname = weego.result1.cityitem.attractions;
            } else if (weego.type == "restaurants") {
                itemname = weego.result1.cityitem.name;
            } else if (weego.type == "shopareas") {
                itemname = weego.result1.cityitem.area_name;
            } else {
                itemname = weego.result1.cityitem.name
            }
            var model = {
                type: weego.type,
                _id: weego.result1.cityitem._id + '',
                city_name: weego.result1.cityitem.cityname,
                name: itemname,
                status: '2',
                attractionscount: weego.result1.cityitem.attractionscount,
                restaurantscount: weego.result1.cityitem.restaurantscount,
                shopareacount: weego.result1.cityitem.shopareacount,
                shoppingscount: weego.result1.cityitem.shoppingscount,
                editorname: weego.result1.audits.editorname,
                editdate: weego.result1.audits.editdate,
                auditorname: weego.result1.audits.auditorname,
                auditdate: new Date().toLocaleString()
            }
            model.auditcomment = $('#auditcomment').val();
            $('#citypass').attr('disabled', 'disabled');
            $('#cityunpass').remove();
            model = JSON.stringify(model);
            $.post('/passthiscityitem/', {
                model: model
            }, function (data) {

            })
        },
        cityunpass: function () {
            var itemname;
            if (weego.type == "attractions") {
                itemname = weego.result1.cityitem.attractions;
            } else if (weego.type == "restaurants") {
                itemname = weego.result1.cityitem.name;
            } else if (weego.type == "shopareas") {
                itemname = weego.result1.cityitem.area_name;
            } else {
                itemname = weego.result1.cityitem.name
            }
            var model = {
                type: weego.type,
                city_name: weego.result1.cityitem.cityname,
                name: itemname,
                status: '-1',
                attractionscount: weego.result1.cityitem.attractionscount,
                restaurantscount: weego.result1.cityitem.restaurantscount,
                shopareacount: weego.result1.cityitem.shopareacount,
                shoppingscount: weego.result1.cityitem.shoppingscount,
                editorname: weego.result1.audits.editorname,
                editdate: weego.result1.audits.editdate,
                auditorname: weego.result1.audits.auditorname,
                auditdate: new Date().toLocaleString()
            }
            model.auditcomment = $('#auditcomment').val();
            console.log(model);
            $('#cityunpass').attr('disabled', 'disabled');
            $('#citypass').remove();
            model = JSON.stringify(model);
            $.post('/passthiscityitem/', {
                model: model
            }, function (data) {

            })
        }
    })

    weego.EditCityView = Backbone.View.extend({
        tagName: "div",
        // className: "modal fade in",
        initialize: function () {
            _.bindAll(this, 'render', 'save');
        },
        render: function (data) {
            this.$el.css({
                width: "100%",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: 'auto',
                position: 'relative'
            });
            var result = data;
            console.log(result);
            $(this.el).html(Handlebars.compile($('#cityEditView').html())({
                city: result
            }));

            return this;
        },
        events: {
            'click #save': 'save',
            'click #cancel': 'cancel',
            'change #cityname': 'showCityLocations',
            'click #addlabel': 'addlabel',
            'click #addTip': 'addTip',
            'click #addIntr': 'addIntr',
            'click #addTra': 'addTra',
            'focus .labels': 'autogetMasterLabel',
            'focus #masterLabel': 'autogetMasterLabel',
            'click .del': 'dellabel',
            'click .delTip': 'delTip',
            'click .delIntr': 'delIntr',
            'click .delTra': 'delTra',
            'change #continents': 'selectCountry',
            'click .editwords': 'editwords',
            'click .textareasurebtn': 'textareasure'
        },
        textareasure: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        dellabel: function (e) {
            $(e.target).parents('.label-group').remove();
        },
        delTip: function (e) {
            $(e.target).parents('.tip-control').remove();
        },
        delTra: function (e) {
            $(e.target).parents('.tra-control').remove();
        },
        delIntr: function (e) {
            $(e.target).parents('.intr-control').remove();
        },
        autogetMasterLabel: function (e) {
            var _this = this;
            if ($(e.target).attr('id') == 'masterLabel') {
                $("#masterLabel").autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: "/getLabelByLevel/1",
                            dataType: "json",
                            data: request,
                            success: function (data) {
                                response(
                                    $.map(
                                        data.label, function (item) {
                                            return {
                                                label: item.label,
                                                value: item.label,
                                                masterLbale_id: item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select: function (event, ui) {
                        $(e.target).attr('data-value', ui.item.masterLbale_id);
                    }
                });
            } else {
                $(".labels").autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: "/getLabelByLevel/1",
                            dataType: "json",
                            data: request,
                            success: function (data) {
                                response(
                                    $.map(
                                        data.label, function (item) {
                                            return {
                                                label: item.label,
                                                value: item.label,
                                                sublevel_id: item._id
                                            }
                                        }));
                            }
                        });
                    },
                    select: function (event, ui) {
                        $(e.target).attr('data-value', ui.item.sublevel_id);
                    }
                });
            }
        },
        showCityLocations: function () {
            // locationCity();
        },
        addlabel: function (e) {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $el = $(e.currentTarget);
            $el.after($newlabel);
        },
        addTip: function (e) {
            $el = $(e.currentTarget);
            if ($el.attr('data-value')) {
                var $newtip = $('<div class="controls tip-control"><input class="input-xlarge focused en_tipItemTitle"  name="tipItemTitle" data-value="" type="text" id="tipItemTitle">' +
                    '<input type="button" value="删除" class="delTip"><textarea class="en_tipItemContent" id="tipItemContent" style="width:80%;height:50px"></textarea></div>');
            } else {
                var $newtip = $('<div class="controls tip-control"><input class="input-xlarge focused tipItemTitle"  name="tipItemTitle" data-value="" type="text" id="tipItemTitle">' +
                    '<input type="button" value="删除" class="delTip"><textarea class="tipItemContent" id="tipItemContent" style="width:80%;height:50px"></textarea></div>');
            }
            $el.after($newtip);
        },
        addTra: function (e) {
            $el = $(e.currentTarget);
            if ($el.attr('data-value')) {
                var $newtra = $('<div class="controls tra-control"><input class="input-xlarge focused en_traItemTitle"  name="traItemTitle" data-value="" type="text" >' +
                    '<input type="button" value="删除" class="delTra"><textarea class="en_traItemContent" style="width:80%;height:50px"></textarea></div>');
            } else {
                var $newtra = $('<div class="controls tra-control"><input class="input-xlarge focused traItemTitle"  name="traItemTitle" data-value="" type="text" >' +
                    '<input type="button" value="删除" class="delTra"><textarea class="traItemContent" style="width:80%;height:50px"></textarea></div>');

            }
            $el.after($newtra);
        },
        addIntr: function (e) {
            $el = $(e.currentTarget);
            if ($el.attr('data-value')) {
                var $newintr = $('<div class="controls intr-control"><input class="input-xlarge focused en_intrItemTitle"  name="intrItemTitle" data-value="" type="text" >' +
                    '<input type="button" value="删除" class="delIntr"><textarea class="en_intrItemContent" style="width:80%;height:50px"></textarea></div>');
            } else {
                var $newintr = $('<div class="controls intr-control"><input class="input-xlarge focused intrItemTitle"  name="intrItemTitle" data-value="" type="text" >' +
                    '<input type="button" value="删除" class="delIntr"><textarea class="intrItemContent" style="width:80%;height:50px"></textarea></div>');
            }

            $el.after($newintr);
        },
        cancel: function () {
            self.location.reload();
        },
        save: function () {
            //alert("lhb");
            var _this = this;
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                array_label.push($('.labels').eq(i).attr('data-value'));
            }
            //获取tips
            var array_tips = [];
            for (var i = 0; i < $('.tipItemTitle').length; i++) {
                var tipItem = {};
                tipItem.tipItemTitle = $('.tipItemTitle').eq(i).val();
                tipItem.tipItemContent = $('.tipItemContent').eq(i).val();
                array_tips.push(tipItem);
            }
            var array_tips_en = [];
            for (var i = 0; i < $('.en_tipItemTitle').length; i++) {
                var tipItem = {};
                tipItem.tipItemTitle = $('.en_tipItemTitle').eq(i).val();
                tipItem.tipItemContent = $('.en_tipItemContent').eq(i).val();
                array_tips_en.push(tipItem);
            }
            //获取交通
            var array_tra = [];
            for (var i = 0; i < $('.traItemTitle').length; i++) {
                var traItem = {};
                traItem.traItemTitle = $('.traItemTitle').eq(i).val();
                traItem.traItemContent = $('.traItemContent').eq(i).val();
                array_tra.push(traItem);
            }
            var array_tra_en = [];
            for (var i = 0; i < $('.en_traItemTitle').length; i++) {
                var traItem = {};
                traItem.traItemTitle = $('.en_traItemTitle').eq(i).val();
                traItem.traItemContent = $('.en_traItemContent').eq(i).val();
                array_tra_en.push(traItem);
            }
            //获取简介
            var array_intr = [];
            for (var i = 0; i < $('.intrItemTitle').length; i++) {
                var intrItem = {};
                intrItem.intrItemTitle = $('.intrItemTitle').eq(i).val();
                intrItem.intrItemContent = $('.intrItemContent').eq(i).val();
                array_intr.push(intrItem);
            }
            //获取英文简介
            var array_intr_en = [];
            for (var i = 0; i < $('.en_intrItemTitle').length; i++) {
                var intrItem = {};
                intrItem.intrItemTitle = $('.en_intrItemTitle').eq(i).val();
                intrItem.intrItemContent = $('.en_intrItemContent').eq(i).val();
                array_intr_en.push(intrItem);
            }
            ;
            console.log(array_intr_en);
            var recommand_center = {};
            recommand_center.name = $("#recommand_center_name").val();
            recommand_center.latitude = $("#recommand_center_latitude").val();
            recommand_center.longitude = $("#recommand_center_longitude").val();
            recommand_center._id = 'center';

            var citymodel = {
                _id: $('#cityname').attr('data-id'),
                continents: $("#continents").val(),
                countryname: $("#country").val(),
                cityname: $("#cityname").val(),
                cityname_en: $("#cityname_en").val(),
                cityname_py: $("#cityname_py").val(),
                introduce: array_intr,
                short_introduce: $("#short_introduce").val(),
                restaurant_overview: $("#restaurant_overview").val(),
                shopping_overview: $("#shopping_overview").val(),
                attraction_overview: $("#attraction_overview").val(),
                tips: array_tips,
                traffic: array_tra,
                recommand_day: $("#recommand_day").val(),
                recommand_intensity: $("#recommand_intensity").val(),
                recommand_center: recommand_center,
                hot_flag: $('input:radio[name="hot_flag"]:checked').val(),
                show_flag: $('input:radio[name="show_flag"]:checked').val(),
                subLabel: array_label,
                masterLabel: $("#masterLabel").attr('data-value'),
                latitude: $("#latitude").val(),
                longitude: $("#longitude").val(),
                weoid: $("#weoid").val(),
                en_info: {
                    short_introduce: $("#en_short_introduce").val(),
                    attraction_overview: $("#en_attraction_overview").val(),
                    restaurant_overview: $("#en_restaurant_overview").val(),
                    shopping_overview: $("#en_shopping_overview").val(),
                    introduce: array_intr_en,
                    tips: array_tips_en,
                    traffic: array_tra_en
                }
            };
            console.log(citymodel);
            citymodel = JSON.stringify(citymodel);
            $.post('/updatecity', {
                model: citymodel
            }, function (data) {
                if (data) {
                    location.reload();
                } else {
                    alert('更新失败');
                }
            })
            return false;
        },
        selectCountry: function () {
            var continentCode = $("#continents").val();
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
                        $('#country').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }

            });
        }
    });
    //restaurant and shopping
    weego.EditCityItemView = Backbone.View.extend({
        tagName: 'div',
        render: function (data) {
            console.log(data);

            // this.template = Handlebars.compile($('#lifeDetailView').html(data));
            $(this.el).html(Handlebars.compile($('#resEditView').html())({
                cityitem: data
            }));
            return this;
        },
        events: {
            'change #property-type': 'selectType',
            // 'change #continents_select': 'selectContinent',
            // 'change #country_select': 'selectCountry',
            // 'change #city_select': 'selectCity',
            // 'change #area_select': 'selectArea',
            'change #big_select': 'selectBigShopping',
            'click #is_big': 'checkBig',
            'click review': 'review',
            'click #save': 'saveLife',
            'click #top_save': 'saveLife',
            'click #cancel': 'back',
            'click #back': 'back',
            'focus #addCategoryValue': 'autogetCategory',
            'click #addCategoryValue': 'autogetCategory',
            'click #addCategory': 'addCategory',
            'focus #addLifetagValue': 'autogetLifetag',
            'click #addLifetag': 'addLifetag',
            'click #addOpentime': 'addOpentime',
            'click .li-del': 'delLi',
            'click #allday': 'selectAllDay',
            'click .tagsbtn': 'choosetag'
        },
        choosetag: function (e) {
            $el = $(e.currentTarget);
            var flag = $el.hasClass('active');
            if (flag) {
                $el.removeClass('active');
            } else {
                $el.addClass('active');
            }
        },
        initSelect: function () {
            var cityid = this.model.get('city_id');
            var in_big_id = this.model.get('in_big_id');
            var is_big = this.model.get('is_big');
            var area_id = this.model.get('area_id');
            if (cityid) {
                $.ajax({
                    url: "/getAreasByCityId/" + cityid,
                    success: function (data) {
                        if (data.status) {
                            var areas = data.results;
                            var option = '';
                            for (var i = 0; i < areas.length; i++) {
                                var area = areas[i];
                                var selected = "";
                                if (area_id && area._id.toString() == (area_id + ''))
                                    selected = "selected";
                                option += '<option value="' + area._id + '" ' + selected + '>' + area.name + '</option>';
                            }
                            $('#area_select').html(option);
                        } else {
                            alert('数据库异常！');
                        }
                    }
                });

                $.ajax({
                    url: "/getBigShoppingByCityId/" + cityid,
                    success: function (data) {
                        if (data.status) {
                            var bigShoppings = data.results;
                            var option = '';
                            for (var i = 0; i < bigShoppings.length; i++) {
                                var big = bigShoppings[i];
                                var selected = "";
                                if (!is_big && in_big_id && big._id.toString() == (in_big_id + ''))
                                    selected = "selected";
                                option += '<option value="' + big._id + '" ' + selected + '>' + big.name + '</option>';
                            }
                            $('#big_select').html(option);
                        } else {
                            alert('数据库异常！');
                        }
                    }
                });
            }

            // $.ajax({
            //     url: "/getMyToDoTasks",
            //     success: function(data) {
            //         if (data.status) {
            //             var results = data.results;
            //             var option = '';
            //             for (var i = 0; i < results.length; i++) {
            //                 var one = results[i];
            //                 option += '<option value="' + one._id + '" >' + one.name + '</option>';
            //             }
            //             $('#task_select').html(option);
            //         } else {
            //             alert('数据库异常！');
            //         }
            //     }
            // });
        },
        selectAllDay: function (e) {
            e.preventDefault();
            $('#am').attr('checked', 'checked');
            $('#pm').attr('checked', 'checked');
            $('#ev').attr('checked', 'checked');
        },
        selectType: function () {
            var type = $('#property-type').val();
            if (type == '1') {
                $('.services').css('display', 'block');
                $('#big-shopping-show').css('display', 'none');
                $('#belong-to-shopping-show').css('display', 'none');
                $('#rating_food_trust_span').css('display', 'block');
            } else if (type == '2') {
                $('.services').css('display', 'none');
                $('#big-shopping-show').css('display', 'block');
                $('#belong-to-shopping-show').css('display', 'block');
                $('#rating_food_trust_span').css('display', 'block');
            } else {
                $('.services').css('display', 'none');
                $('#big-shopping-show').css('display', 'none');
                $('#belong-to-shopping-show').css('display', 'none');
                $('#rating_food_trust_span').css('display', 'none');
            }

        },
        // selectArea: function() {
        //     var areaname = $("#area_select").find("option:selected").text();
        //     $("#area_name").val(areaname);
        // },
        selectBigShopping: function () {
            var name = $("#big_select").find("option:selected").text();
            $("#in_big_name").val(name);
        },

        checkBig: function () {
            var is_big = $('#is_big').prop('checked');
            if (is_big) {
                $('#belong-to-shopping-show').css('display', 'none');
            } else {
                $('#belong-to-shopping-show').css('display', 'block');
            }
        },
        autogetCategory: function (e) {
            var _this = this;
            var type = $('#property-type').val();
            var name = $('#addCategoryValue').val();
            console.log(type, name);
            $("#addCategoryValue").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getCategorysByQuery/" + type + "/" + $('#addCategoryValue').val(),
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            console.log(data);
                            response(
                                $.map(
                                    data.result, function (item) {
                                        return {
                                            label: item.name,
                                            value: item.name,
                                            _id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addCategoryValue").attr('value', ui.item.label);
                    $("#addCategoryValue").attr('data-value', ui.item._id);
                }
            });
        },
        addCategory: function () {
            var itemName = $('#addCategoryValue').val();
            var itemId = $('#addCategoryValue').attr('data-value');
            if (itemId && itemName) {
                var $newitem = $('<li><input class="input-xlarge focused categorys" readonly style="width:100px" name="categorys" ' +
                    'type="text" value="' + itemName + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#category-list').last().after($newitem);
            } else {
                alert('请不要手动输入！');
            }

        },
        addOpentime: function () {
            var open_day = $('#open-day').val();
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            // if(open_time_begin!='allday' && open_time_begin!='close' &&
            //     open_time_end!='allday' && open_time_end!='close' &&
            //     open_time_end < open_time_begin){
            //     alert('请正确选择！');
            //     return false;
            // }
            var open_time = {
                desc: $('#open-day').find("option:selected").text() + ' ' + this.getOpenTimeDesc(),
                value: open_day + '-' + open_time_begin + '-' + open_time_end
            };
            var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" ' +
                'type="text" value="' + open_time.desc + '" data-value="' + open_time.value + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#opentime-list').last().after($newitem);
        },
        getOpenTimeDesc: function () {
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            if (open_time_begin == 'allday' || open_time_end == 'allday')
                return '全天';
            else if (open_time_begin == 'close' || open_time_end == 'close')
                return '关门';
            else
                return $('#open-time-begin').find("option:selected").text() + '-' + $('#open-time-end').find("option:selected").text();
        },
        autogetLifetag: function (e) {
            var _this = this;
            var type = $('#property-type').val();
            $("#addLifetagValue").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLifetagsByType/" + type,
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            response(
                                $.map(
                                    data.result, function (item) {
                                        return {
                                            label: item.name,
                                            value: item.name,
                                            _id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addLifetagValue").attr('value', ui.item.label);
                    $("#addLifetagValue").attr('data-value', ui.item._id);
                }
            });
        },
        addLifetag: function () {
            var itemName = $('#addLifetagValue').val();
            var itemId = $('#addLifetagValue').attr('data-value');
            if (itemId && itemName) {
                var $newitem = $('<li><input class="input-xlarge focused lifetags" readonly style="width:100px" name="lifetags" ' +
                    'type="text" value="' + itemName + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#lifetag-list').last().after($newitem);
            } else {
                alert('请不手动输入！');
            }

        },
        review: function () {

        },
        delLi: function (e) {
            $(e.target).parent().remove();
        },
        back: function (e) {
            e.preventDefault();
            window.history.back();
        },
        getTextInputValue: function (id) {
            return this.$el.find('#' + id).val();
        },
        saveLife: function (e) {
            e.preventDefault();

            var type = $('#property-type').val();
            var categorys = [];
            for (var i = 0; i < $('.categorys').length; i++) {
                var item = {};
                item._id = $('.categorys').eq(i).attr('data-value');
                item.name = $('.categorys').eq(i).attr('value');
                categorys.push(item);
            }
            var lifetags = [];
            for (var i = 0; i < $('.lifetags').length; i++) {
                var item = {};
                item._id = $('.lifetags').eq(i).attr('data-value');
                item.name = $('.lifetags').eq(i).attr('value');
                lifetags.push(item);
            }
            var opentimes = [];
            for (var i = 0; i < $('.opentimes').length; i++) {
                var item = {};
                item.value = $('.opentimes').eq(i).attr('data-value');
                item.desc = $('.opentimes').eq(i).attr('value');
                opentimes.push(item);
            }
            // var local_flag = $('#local_flag').prop('checked'),
            //     michilin_flag = $('#michilin_flag').prop('checked'),
            //     best_dinnerchoics = $('#best_dinnerchoics').prop('checked'),
            //     most_popular = $('#most_popular').prop('checked');
            // var tags = [];
            // if(local_flag){
            //     tags.push('localflag');
            // }
            // if(michilin_flag){
            //     tags.push('michilin');
            // }
            // if(best_dinnerchoics){
            //     tags.push('bestfordinner');
            // }
            // if(most_popular){
            //     tags.push('popular');
            // }

            var yelp_rating=Number($("#yelp_rating").val().replace(/\s+/,''));
            if(isNaN(yelp_rating)||yelp_rating==''){
                alert('yelp_rating应为整数！');
                return false;

            }

            var tagsElements = $('.tagsbtn.active'),
                tags = [];
            for (var i = 0; i < tagsElements.length; i++) {
                tags.push(tagsElements.eq(i).attr('data-value'));
            }
            console.log(tags);
            var item = {
                name: $('#name').val(),
                _id: $('#name').attr('data-value') + '',
                type: $('#property-type').val(),
                address: $('#address').val(),
                tel: $('#tel').val(),
                city_name: $('#name').attr('cityname'),
                city_id: $('#name').attr('cityid') + '',
                latitude: $('#latitude').val(),
                longitude: $('#longitude').val(),
                // postal_code: $('#postal_code').val(),
                introduce: $('#introduce').val(),
                tips: $('#tips').val(),
                show_flag: $('#show_flag').prop('checked'),
                recommand_flag: $('#recommand_flag').prop('checked'),
                recommand_duration: $('#recommand_duration').val(),
                recommand_reason: $('#recommand_reason').val(),
                index_flag: $('#index_flag').prop('checked'),
                tags: tags, //排名标签
                ranking: $('#ranking').val(),
                rating: $('#rating').val(),
                reviews: $('#reviews').val(),
                price_level: $('#price_level').val(),
                price_desc: $('#price_desc').val(),
                url: $('#url').val(),
                website: $('#website').val(),
                comments: $('#comments').val(),
                comments_url: $('#comments_url').val(),

                yelp_rating: yelp_rating,
                category: categorys,
                lifetag: lifetags,
                open_time: opentimes,

                am: $('#am').prop('checked'),
                pm: $('#pm').prop('checked'),
                ev: $('#ev').prop('checked'),
                en_info: {
                    introduce: $('#en_introduce').val(),
                    tips: $('#en_tips').val(),
                    comments: $('#en_comments').val()
                }
            };
            if (type == '1') {
                var info = {
                    wifi: $('#wifi').prop('checked'),
                    yu_ding: $('#wifi').prop('checked'),
                    delivery: $('#delivery').prop('checked'),
                    take_out: $('#take_out').prop('checked'),
                    card: $('#card').prop('checked'),
                    g_f_kid: $('#g_f_kid').prop('checked'),
                    g_f_group: $('#g_f_group').prop('checked'),
                    out_seat: $('#out_seat').prop('checked'),
                    tv: $('#tv').prop('checked'),
                    waiter: $('#waiter').prop('checked'),
                    g_for: $('#g_for').val(),
                    noise: $('#noise').val(),
                    alcohol: $('#alcohol').val(),
                };
                item.info = info;
            } else if (type == '2') {
                item.is_big = $('#is_big').prop('checked');
                if (!item.is_big) {
                    item.in_big_id = $('#big_select').val();
                }
                item.area_id = $('#area_select').val();
                item.area_name = $('#area_select').find("option:selected").text();
            }
            if (item.name == '' || item.name == null || item.name == undefined) {
                alert('名称不能为空！');
                $('#name').focus();
                return false;
            }

            if (!isInt(item.price_level)) {
                alert('价格level必须是1,2,3,4,5');
                $('#price_level').focus();
                return false;
            }
            if (item.recommand_duration != '' && !isInt(item.recommand_duration)) {
                alert('推荐时间必须是整数！');
                $('#recommand_duration').focus();
                return false;
            }
            console.log(item);
            console.log(typeof item.index_flag);
            item = JSON.stringify(item);
            $.post('/updatecityitem', {
                model: item
            }, function (data) {
                location.reload();
            })
        }
    });

    weego.NewCityItemView = Backbone.View.extend({
        render: function (data) {
            console.log(data);
            $(this.el).html(Handlebars.compile($('#newItemEditView').html())({res: data}));
            return this;
        },
        events: {
            'change #property-type': 'selectType',
            // 'change #continents_select': 'selectContinent',
            // 'change #country_select': 'selectCountry',
            // 'change #city_select': 'selectCity',
            // 'change #area_select': 'selectArea',
            'change #big_select': 'selectBigShopping',
            'click #is_big': 'checkBig',
            'click review': 'review',
            'click #save': 'saveLife',
            'click #top_save': 'saveLife',
            'click #cancel': 'back',
            'click #back': 'back',
            'focus #addCategoryValue': 'autogetCategory',
            'click #addCategoryValue': 'autogetCategory',
            'click #addCategory': 'addCategory',
            'focus #addLifetagValue': 'autogetLifetag',
            'click #addLifetag': 'addLifetag',
            'click #addOpentime': 'addOpentime',
            'click .li-del': 'delLi',
            'click #allday': 'selectAllDay',
            'click .tagsbtn': 'choosetag'
        },
        choosetag: function (e) {
            $el = $(e.currentTarget);
            var flag = $el.hasClass('active');
            if (flag) {
                $el.removeClass('active');
            } else {
                $el.addClass('active');
            }
        },
        initSelect: function () {
            var cityid = this.model.get('city_id');
            var in_big_id = this.model.get('in_big_id');
            var is_big = this.model.get('is_big');
            var area_id = this.model.get('area_id');
            if (cityid) {
                $.ajax({
                    url: "/getAreasByCityId/" + cityid,
                    success: function (data) {
                        if (data.status) {
                            var areas = data.results;
                            var option = '';
                            for (var i = 0; i < areas.length; i++) {
                                var area = areas[i];
                                var selected = "";
                                if (area_id && area._id.toString() == (area_id + ''))
                                    selected = "selected";
                                option += '<option value="' + area._id + '" ' + selected + '>' + area.name + '</option>';
                            }
                            $('#area_select').html(option);
                        } else {
                            alert('数据库异常！');
                        }
                    }
                });

                $.ajax({
                    url: "/getBigShoppingByCityId/" + cityid,
                    success: function (data) {
                        if (data.status) {
                            var bigShoppings = data.results;
                            var option = '';
                            for (var i = 0; i < bigShoppings.length; i++) {
                                var big = bigShoppings[i];
                                var selected = "";
                                if (!is_big && in_big_id && big._id.toString() == (in_big_id + ''))
                                    selected = "selected";
                                option += '<option value="' + big._id + '" ' + selected + '>' + big.name + '</option>';
                            }
                            $('#big_select').html(option);
                        } else {
                            alert('数据库异常！');
                        }
                    }
                });
            }

            // $.ajax({
            //     url: "/getMyToDoTasks",
            //     success: function(data) {
            //         if (data.status) {
            //             var results = data.results;
            //             var option = '';
            //             for (var i = 0; i < results.length; i++) {
            //                 var one = results[i];
            //                 option += '<option value="' + one._id + '" >' + one.name + '</option>';
            //             }
            //             $('#task_select').html(option);
            //         } else {
            //             alert('数据库异常！');
            //         }
            //     }
            // });
        },
        selectAllDay: function (e) {
            e.preventDefault();
            $('#am').attr('checked', 'checked');
            $('#pm').attr('checked', 'checked');
            $('#ev').attr('checked', 'checked');
        },
        selectType: function () {
            var type = $('#property-type').val();
            if (type == '1') {
                $('.services').css('display', 'block');
                $('#big-shopping-show').css('display', 'none');
                $('#belong-to-shopping-show').css('display', 'none');
                $('#rating_food_trust_span').css('display', 'block');
            } else if (type == '2') {
                $('.services').css('display', 'none');
                $('#big-shopping-show').css('display', 'block');
                $('#belong-to-shopping-show').css('display', 'block');
                $('#rating_food_trust_span').css('display', 'block');
            } else {
                $('.services').css('display', 'none');
                $('#big-shopping-show').css('display', 'none');
                $('#belong-to-shopping-show').css('display', 'none');
                $('#rating_food_trust_span').css('display', 'none');
            }

        },
        // selectArea: function() {
        //     var areaname = $("#area_select").find("option:selected").text();
        //     $("#area_name").val(areaname);
        // },
        selectBigShopping: function () {
            var name = $("#big_select").find("option:selected").text();
            $("#in_big_name").val(name);
        },

        checkBig: function () {
            var is_big = $('#is_big').prop('checked');
            if (is_big) {
                $('#belong-to-shopping-show').css('display', 'none');
            } else {
                $('#belong-to-shopping-show').css('display', 'block');
            }
        },
        autogetCategory: function (e) {
            var _this = this;
            var type = $('#property-type').val();
            var name = $('#addCategoryValue').val();
            console.log(type, name);
            $("#addCategoryValue").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getCategorysByQuery/" + type + "/" + $('#addCategoryValue').val(),
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            console.log(data);
                            response(
                                $.map(
                                    data.result, function (item) {
                                        return {
                                            label: item.name,
                                            value: item.name,
                                            _id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addCategoryValue").attr('value', ui.item.label);
                    $("#addCategoryValue").attr('data-value', ui.item._id);
                }
            });
        },
        addCategory: function () {
            var itemName = $('#addCategoryValue').val();
            var itemId = $('#addCategoryValue').attr('data-value');
            if (itemId && itemName) {
                var $newitem = $('<li><input class="input-xlarge focused categorys" readonly style="width:100px" name="categorys" ' +
                    'type="text" value="' + itemName + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#category-list').last().after($newitem);
            } else {
                alert('请不要手动输入！');
            }

        },
        addOpentime: function () {
            var open_day = $('#open-day').val();
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            // if(open_time_begin!='allday' && open_time_begin!='close' &&
            //     open_time_end!='allday' && open_time_end!='close' &&
            //     open_time_end < open_time_begin){
            //     alert('请正确选择！');
            //     return false;
            // }
            var open_time = {
                desc: $('#open-day').find("option:selected").text() + ' ' + this.getOpenTimeDesc(),
                value: open_day + '-' + open_time_begin + '-' + open_time_end
            };
            var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" ' +
                'type="text" value="' + open_time.desc + '" data-value="' + open_time.value + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#opentime-list').last().after($newitem);
        },
        getOpenTimeDesc: function () {
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            if (open_time_begin == 'allday' || open_time_end == 'allday')
                return '全天';
            else if (open_time_begin == 'close' || open_time_end == 'close')
                return '关门';
            else
                return $('#open-time-begin').find("option:selected").text() + '-' + $('#open-time-end').find("option:selected").text();
        },
        autogetLifetag: function (e) {
            var _this = this;
            var type = $('#property-type').val();
            $("#addLifetagValue").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLifetagsByType/" + type,
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            response(
                                $.map(
                                    data.result, function (item) {
                                        return {
                                            label: item.name,
                                            value: item.name,
                                            _id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addLifetagValue").attr('value', ui.item.label);
                    $("#addLifetagValue").attr('data-value', ui.item._id);
                }
            });
        },
        addLifetag: function () {
            var itemName = $('#addLifetagValue').val();
            var itemId = $('#addLifetagValue').attr('data-value');
            if (itemId && itemName) {
                var $newitem = $('<li><input class="input-xlarge focused lifetags" readonly style="width:100px" name="lifetags" ' +
                    'type="text" value="' + itemName + '" data-value="' + itemId + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#lifetag-list').last().after($newitem);
            } else {
                alert('请不手动输入！');
            }

        },
        review: function () {

        },
        delLi: function (e) {
            $(e.target).parent().remove();
        },
        back: function (e) {
            e.preventDefault();
            window.history.back();
        },
        getTextInputValue: function (id) {
            return this.$el.find('#' + id).val();
        },
        saveLife: function (e) {
            e.preventDefault();

            var type = $('#property-type').val();
            var categorys = [];
            for (var i = 0; i < $('.categorys').length; i++) {
                var item = {};
                item._id = $('.categorys').eq(i).attr('data-value');
                item.name = $('.categorys').eq(i).attr('value');
                categorys.push(item);
            }
            var lifetags = [];
            for (var i = 0; i < $('.lifetags').length; i++) {
                var item = {};
                item._id = $('.lifetags').eq(i).attr('data-value');
                item.name = $('.lifetags').eq(i).attr('value');
                lifetags.push(item);
            }
            var opentimes = [];
            for (var i = 0; i < $('.opentimes').length; i++) {
                var item = {};
                item.value = $('.opentimes').eq(i).attr('data-value');
                item.desc = $('.opentimes').eq(i).attr('value');
                opentimes.push(item);
            }
            // var local_flag = $('#local_flag').prop('checked'),
            //     michilin_flag = $('#michilin_flag').prop('checked'),
            //     best_dinnerchoics = $('#best_dinnerchoics').prop('checked'),
            //     most_popular = $('#most_popular').prop('checked');
            // var tags = [];
            // if(local_flag){
            //     tags.push('localflag');
            // }
            // if(michilin_flag){
            //     tags.push('michilin');
            // }
            // if(best_dinnerchoics){
            //     tags.push('bestfordinner');
            // }
            // if(most_popular){
            //     tags.push('popular');
            // }
            var tagsElements = $('.tagsbtn.active'),
                tags = [];
            for (var i = 0; i < tagsElements.length; i++) {
                tags.push(tagsElements.eq(i).attr('data-value'));
            }
            var yelp_rating=Number($("#yelp_rating").val().replace(/\s+/,''));
            if(isNaN(yelp_rating)||yelp_rating==''){
                alert('yelp_rating应为整数！');
                return false;

            }
            var item = {
                name: $('#name').val(),
                type: $('#name').attr('type'),
                address: $('#address').val(),
                tel: $('#tel').val(),
                city_name: $('#name').attr('cityname'),
                city_id: $('#name').attr('cityid'),
                latitude: $('#latitude').val(),
                longitude: $('#longitude').val(),
                // postal_code: $('#postal_code').val(),
                introduce: $('#introduce').val(),
                tips: $('#tips').val(),
                show_flag: $('#show_flag').prop('checked'),
                recommand_flag: $('#recommand_flag').prop('checked'),
                recommand_duration: $('#recommand_duration').val(),
                recommand_reason: $('#recommand_reason').val(),
                index_flag: $('#index_flag').prop('checked'),
                tags: tags, //排名标签
                ranking: $('#ranking').val(),
                rating: $('#rating').val(),
                reviews: $('#reviews').val(),
                price_level: $('#price_level').val(),
                price_desc: $('#price_desc').val(),
                url: $('#url').val(),
                website: $('#website').val(),
                comments: $('#comments').val(),
                comments_url: $('#comments_url').val(),
                yelp_rating: yelp_rating,
                category: categorys,
                lifetag: lifetags,
                open_time: opentimes,

                am: $('#am').prop('checked'),
                pm: $('#pm').prop('checked'),
                ev: $('#ev').prop('checked'),
                en_info: {
                    introduce: $('#en_introduce').val(),
                    tips: $('#en_tips').val(),
                    comments: $('#en_comments').val()
                }
            };
            if (type == 'restaurants') {
                var info = {
                    wifi: $('#wifi').prop('checked'),
                    yu_ding: $('#wifi').prop('checked'),
                    delivery: $('#delivery').prop('checked'),
                    take_out: $('#take_out').prop('checked'),
                    card: $('#card').prop('checked'),
                    g_f_kid: $('#g_f_kid').prop('checked'),
                    g_f_group: $('#g_f_group').prop('checked'),
                    out_seat: $('#out_seat').prop('checked'),
                    tv: $('#tv').prop('checked'),
                    waiter: $('#waiter').prop('checked'),
                    g_for: $('#g_for').val(),
                    noise: $('#noise').val(),
                    alcohol: $('#alcohol').val(),
                };
                item.info = info;
            } else if (type == 'shoppings') {
                item.is_big = $('#is_big').prop('checked');
                if (!item.is_big) {
                    item.in_big_id = $('#big_select').val();
                }
                item.area_id = $('#area_select').val();
                item.area_name = $('#area_select').find("option:selected").text();
            }
            if (item.name == '' || item.name == null || item.name == undefined) {
                alert('名称不能为空！');
                $('#name').focus();
                return false;
            }

            if (!isInt(item.price_level)) {
                alert('价格level必须是1,2,3,4,5');
                $('#price_level').focus();
                return false;
            }
            if (item.recommand_duration != '' && !isInt(item.recommand_duration)) {
                alert('推荐时间必须是整数！');
                $('#recommand_duration').focus();
                return false;
            }
            item = JSON.stringify(item);
            $.post('/addcityitem', item, function (data) {
                location.reload();
            })
        }
    });

    weego.EditAreaView = Backbone.View.extend({
        tagName: 'div',
        render: function (data) {
            console.log(data);
            $(this.el).html(Handlebars.compile($('#areaEditView').html())({
                cityitem: data
            }));
            return this;
        },
        events: {
            'click #save': 'save',
            'click .addareatag': 'addareatag'
        },
        addareatag: function (e) {
            console.log(' value=""');
            $el = $(e.currentTarget);
            var $taginput = '<input type="button">';
            $taginput.appendTo($el);
        },
        save: function () {
            var areamodel = {
                _id: $('#area_name').attr('data-value') + '',
                area_name: $('#area_name').val(),
                area_enname: $('#area_enname').val(),
                area_introduce: $('#area-introduce').val(),
                address: $('#area-address').val(),
                latitude: $('#area-latitude').val(),
                longitude: $('#area-longitude').val(),
                city_id: $('#area_name').attr('cityid') + '',
                city_name: $('#area_name').attr('cityname'),
                en_info: {
                    introduce: $('#en_area-introduce').val(),
                    address: $('#en_area-address').val()
                }
            }
            console.log(areamodel);
            areamodel = JSON.stringify(areamodel);
            $.post('/updateareaitem', {
                model: areamodel
            }, function (data) {
                location.reload();
            })
        }
    });

    weego.EditAttractionsView = Backbone.View.extend({
        tagName: "div",
        initialize: function () {
            _.bindAll(this, 'render', 'save');
        },
        render: function (data) {
            this.$el.css({
                width: "100%",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: 'auto',
                position: 'relative'
            });
            var _this = this;
            var template = Handlebars.compile($("#attractionEditView").html());
            $(template(data)).appendTo(_this.$el);
            this.delegateEvents(this.events);
            _this.initSelect();
            return this;
        },
        initSelect: function () {
            $.ajax({
                url: "/getMyToDoTasks",
                success: function (data) {
                    if (data.status) {
                        var results = data.results;
                        var option = '';
                        for (var i = 0; i < results.length; i++) {
                            var one = results[i];
                            option += '<option value="' + one._id + '" >' + one.name + '</option>';
                        }
                        $('#task_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });
        },
        events: {
            'click #save': 'save',
            'change #cityname': 'showCityLocations',
            'change #continents_select': 'selectContinent',
            'change #country_select': 'selectCountry',
            'change #city_select': 'selectCity',
            'click #addOpentime': 'addOpentime',
            'click .li-del': 'delLi',
            'click #addlabel': 'addlabel',
            'click .del': 'dellabel',
            'focus .labels': 'autoget',
            'focus #masterLabel': 'autogetMasterLabel',
            'click #cancel': 'cancel',
            'click .close': 'cancel',
            'click #allday': 'selectAllDay',
            'click .editwords': 'editwords',
            'click .textareasurebtn': 'textareasure'
        },
        textareasure: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
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
            $("#city").val(cityname);
        },
        addOpentime: function () {
            var open_day = $('#open-day').val();
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            // if(open_time_begin!='allday' && open_time_begin!='close' &&
            //     open_time_end!='allday' && open_time_end!='close' &&
            //     open_time_end < open_time_begin){
            //     alert('请正确选择！');
            //     return false;
            // }
            var open_time = {
                desc: $('#open-day').find("option:selected").text() + ' ' + this.getOpenTimeDesc(),
                value: open_day + '-' + open_time_begin + '-' + open_time_end
            };
            var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" ' +
                'type="text" value="' + open_time.desc + '" data-value="' + open_time.value + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#opentime-list').last().after($newitem);
        },
        delLi: function (e) {
            $(e.target).parent().remove();
        },
        getOpenTimeDesc: function () {
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            if (open_time_begin == 'allday' || open_time_end == 'allday')
                return '全天';
            else if (open_time_begin == 'close' || open_time_end == 'close')
                return '关门';
            else
                return $('#open-time-begin').find("option:selected").text() + '-' + $('#open-time-end').find("option:selected").text();
        },
        selectAllDay: function (e) {
            e.preventDefault();
            $('#am').attr('checked', 'checked');
            $('#pm').attr('checked', 'checked');
            $('#ev').attr('checked', 'checked');
        },
        autogetMasterLabel: function (e) {
            var _this = this;
            $("#masterLabel").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLabelByLevel/1",
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label: item.label,
                                            value: item.label,
                                            sublevel_id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#masterLabel").attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        autoget: function (e) {
            var _this = this;
            $(".labels").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLabelByLabelID/" + $("#masterLabel").attr('data-value'),
                        dataType: "json",
                        success: function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label: item.label,
                                            value: item.label,
                                            sublevel_id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $(e.target).attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        dellabel: function (e) {
            $(e.target).parents('.label-group').remove();
        },
        addlabel: function () {
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels" id="label" name="label" type="text"><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        savelabel: function (e) {
            var _this = this;
            if ($(e.target).val() == '' || $(e.target).val() == null) {
                return false;
            } else {
                var newlabel = new weego.LabelModel({
                    label: $(e.target).val()
                });
                newlabel.save(null, {
                    success: function (model, res) {
                        if (!res.isSuccess) {
                            console.log("cuole");
                        } else {
                            console.log(model.get('_id'));
                        }
                    }
                });
            }
        },
        showCityLocations: function () {
            // locationCity();
        },
        showLocations: function () {
            codeAddress();
        },
        save: function () {
            var _this = this;
            //var array_label = [];
            //for (var i = 0; i < $('.labels').length; i++) {
            //    var tmp_label = $('.labels').eq(i).attr('data-value');
            //    if (tmp_label != null && tmp_label != '')
            //        array_label.push(tmp_label);
            //}
            var array_label = [];
            for (var i = 0; i < $('.labels').length; i++) {
                var sublabel_id = $('.labels').eq(i).attr('data-value');
                var sublabel_name = $('.labels').eq(i).attr('value');
                if (sublabel_id != null && sublabel_id != '')
                    var object_label = {_id: sublabel_id, name: sublabel_name};
                array_label.push(object_label);
            }

            var show_flag = $('#show_flag').prop('checked') ? '1' : '0';
            var index_flag = $('#index_flag').prop('checked') ? '1' : '0';
            var opentimes = [];
            for (var i = 0; i < $('.opentimes').length; i++) {
                var item = {};
                item.value = $('.opentimes').eq(i).attr('data-value');
                item.desc = $('.opentimes').eq(i).attr('value');
                opentimes.push(item);
            }
            var attractionmodel = {
                _id: $("#attractions").attr('data-id'),
                cityname: $("#attractions").attr('data-cityname'),
                cityid: $("#attractions").attr('data-cityid'),
                attractions_en: $("#attractions_en").val(),
                attractions: $("#attractions").val(),
                address: $('#address').val(),
                price: $('#price').val(),
                opentime: opentimes,
                traffic_info: $('#traffic_info').val(),
                dayornight: $('input:radio[name="dayornight"]:checked').val(),
                website: $("#website").val(),
                telno: $("#telno").val(),
                //activity: $("#activity").val(),
                introduce: $("#introduce").val(),
                tips: $('#tips').val(),
                short_introduce: $("#short_introduce").val(),
                recommand_flag: $('input:radio[name="recommand_flag"]:checked').val(),
                recommand_duration: $('#recommand_duration').val(),
                recommand_reason: $('#recommand_reason').val(),
                show_flag: show_flag,
                index_flag: index_flag,
                am: $('#am').prop('checked'),
                pm: $('#pm').prop('checked'),
                ev: $('#ev').prop('checked'),
                masterLabel: [$("#masterLabel").attr('data-value'), $("#masterLabel").attr('value')],
                subLabel: array_label,
                latitude: $("#latitude").val(),
                longitude: $("#longitude").val(),
                en_info: {
                    opentime: opentimes,
                    traffic_info: $('#en_traffic_info').val(),
                    short_introduce: $('#en_short_introduce').val(),
                    introduce: $('#en_introduce').val(),
                    tips: $('#en_tips').val()
                }
            }
            console.log(attractionmodel);
            attractionmodel = JSON.stringify(attractionmodel);
            $.post('/updateattritem', {
                model: attractionmodel
            }, function (data) {
                if (data.status === 'success') {
                    location.reload();
                } else {
                    console.log('save attraction failed');
                }
            })
            return false;
        },
        cancel: function () {
            window.history.back();
            //$("#attractionsDetailDialog").new_modal('hide');
        }
    });
    //edit city view
    weego.ShowAttractionsDetailView = Backbone.View.extend({
        tagName: "div",
        initialize: function () {
            _.bindAll(this, 'render', 'save');
        },
        render: function () {
            this.$el.css({
                width: "100%",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: 'auto',
                position: 'relative'
            });
            var _this = this;
            if (weego_user.globalUser.type == 1) {
                _this.model.set('_show_flag', true);
            } else {
                _this.model.set('_show_flag', false);
            }
            var template = Handlebars.compile($("#attractions_detail_template").html());
            _this.model.set('user', weego_user.globalUser);
            $(template(_this.model.toJSON())).appendTo(_this.$el);
            this.delegateEvents(this.events);
            _this.initSelect();
            return this;
        },
        initSelect: function () {
            $.ajax({
                url: "/getMyToDoTasks",
                success: function (data) {
                    if (data.status) {
                        var results = data.results;
                        var option = '';
                        for (var i = 0; i < results.length; i++) {
                            var one = results[i];
                            option += '<option value="' + one._id + '" >' + one.name + '</option>';
                        }
                        $('#task_select').html(option);
                    } else {
                        alert('数据库异常！');
                    }
                }
            });
        },
        events: {
            'click #save': 'save',
            'change #cityname': 'showCityLocations',
            'change #continents_select': 'selectContinent',
            'change #country_select': 'selectCountry',
            'change #city_select': 'selectCity',
            'click #addOpentime': 'addOpentime',
            'click .li-del': 'delLi',
            'click #addlabel': 'addlabel',
            'focus #addActivitytagValue': 'autogetActivitytag',
            'click #addComment': 'addComment',
            'click #addActivitytag': 'addActivitytag',
            'click .del': 'dellabel',
            'focus .labels': 'autoget',
            //'focus .comments': 'autoget2',//评论获得
            'focus #masterLabel': 'autogetMasterLabel',
            'click #cancel': 'cancel',
            'click .close': 'cancel',
            'click #allday': 'selectAllDay',
            'click .editwords': 'editwords',
            'click .textareasurebtn': 'textareasure'
        },
        textareasure: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var value = $el.siblings('textarea').val();
            $el.parent('.textareawrapper').hide();
            $el.parent().parent().children('.editwords').html(value).show();
        },
        editwords: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            $el.hide();
            $el.next('.textareawrapper').show();
        },
        selectAllDay: function (e) {
            e.preventDefault();
            $('#am').attr('checked', 'checked');
            $('#pm').attr('checked', 'checked');
            $('#ev').attr('checked', 'checked');
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
            $("#city").val(cityname);
        },
        addOpentime: function () {
            var open_day = $('#open-day').val();
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            // if(open_time_begin!='allday' && open_time_begin!='close' &&
            //     open_time_end!='allday' && open_time_end!='close' &&
            //     open_time_end < open_time_begin){
            //     alert('请正确选择！');
            //     return false;
            // }
            var open_time = {
                desc: $('#open-day').find("option:selected").text() + ' ' + this.getOpenTimeDesc(),
                value: open_day + '-' + open_time_begin + '-' + open_time_end
            };
            var $newitem = $('<li><input class="input-xlarge focused opentimes" readonly style="width:150px" name="opentimes" ' +
                'type="text" value="' + open_time.desc + '" data-value="' + open_time.value + '"> <input type="button" value="删除" class="li-del"><li>');
            $('#opentime-list').last().after($newitem);
        },
        getOpenTimeDesc: function () {
            var open_time_begin = $('#open-time-begin').val();
            var open_time_end = $('#open-time-end').val();
            if (open_time_begin == 'allday' || open_time_end == 'allday')
                return '全天';
            else if (open_time_begin == 'close' || open_time_end == 'close')
                return '关门';
            else
                return $('#open-time-begin').find("option:selected").text() + '-' + $('#open-time-end').find("option:selected").text();
        },
        delLi: function (e) {
            $(e.target).parent().remove();
        },
        autogetMasterLabel: function (e) {
            var _this = this;
            $("#masterLabel").autocomplete({
                source: function (request, response) {
                    $.ajax({
                        url: "/getLabelByLevel/1",
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label: item.label,
                                            value: item.label,
                                            sublevel_id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#masterLabel").attr('data-value', ui.item.sublevel_id);
                }
            });
        },
        autoget: function (e) {
            var _this = this;
            //return false;
            //var key = $('#label').val();
            $(".labels").autocomplete({
                source: function (request, response) {
                  var    key = $('.lhb:last').val();
                    if(typeof(key)=='undefined'){
                        key='';
                    }
                    //console.log(key);
                    $.ajax({
                        url: "/getLabelByLabelID/" +2+"/"+key+"%20",
                        dataType: "json",
                        success: function (data) {
                            response(
                                $.map(
                                    data.label, function (item) {
                                        return {
                                            label: item.label,
                                            value: item.label,
                                            sublevel_id: item._id
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $(e.target).attr('data-value', ui.item.sublevel_id);
                }
            });
        },

        dellabel: function (e) {
            $(e.target).parents('.label-group').remove();//正常标签的删除
            $(e.target).parents('.comments-group').remove();//评论标签的删除
        },
        addlabel: function () {
            //alert('Table1');
            var $newlabel = $('<div class="control-group label-group"><label class="control-label" for="label">标签</label><div class="controls">' +
                '<input class="input-xlarge focused labels lhb" id="label" name="label" type="text" ><input type="button" value="删除" class="del"></div></div>');
            $('.label-group').last().after($newlabel);
        },
        addComment: function () {//增加comments_top
            //alert('Table2');
            var $newlabel = $('<div class="control-group comments-group"><label class="control-label"  for="label2"><font  color="green">新增评论</font></label><div class="controls">' +
                'title:<input class="input-xlarge focused " style="width: 8%" name="title" type="text"  >' +
                '&nbsp;rating:&nbsp;<input class="input-xlarge focused " style="width: 8px" name="rating" maxlength="1" type="text" >' +
                ' &nbsp; text: <textarea class="input-xlarge focused comments" name="text"  style="width:30%" ></textarea>' +
                '&nbsp;nickname:&nbsp;<input class="input-xlarge focused " name="nickname" style="width: 6%" type="text"   >' +
                ' date:&nbsp;<input class="input-xlarge focused " name="date" style="width:8%" type="text" onfocus="setday(this)"  readonly="readonly"  >' +
                '<input type="button" value="删除" class="del"></div></div>');
            $('.comments-group').last().after($newlabel);
        },
        /*autogetActivitytag*/
        autogetActivitytag: function (e) {
            var _this = this;
            var type = $('#property-type').val();
            var key = $('#addActivitytagValue').val();
            if (key == "")key = "all";
            $("#addActivitytagValue").autocomplete({
                source: function (request, response) {
                    key = $('#addActivitytagValue').val();
                    if (key == "")key = "all";
                    $.ajax({
                        url: "/getActivitytagsByType2/" + 1 + "/" + key,
                        dataType: "json",
                        data: request,
                        success: function (data) {
                            response(
                                $.map(
                                    data.result, function (item) {
                                        return {
                                            label: item.title,
                                            value: item.title,
                                            _id: item._id,
                                            cover_image: item.cover_image,
                                            desc: item.desc
                                        }
                                    }));
                        }
                    });
                },
                select: function (event, ui) {
                    $("#addActivitytagValue").attr('value', ui.item.label);
                    $("#addActivitytagValue").attr('data-value', ui.item._id);
                    $("#addActivitytagValue").attr('data-value1', ui.item.cover_image);
                    $("#addActivitytagValue").attr('data-value2', ui.item.desc);
                }
            });

        },
        /*addActivitytag*/
        addActivitytag: function () {
            var label = $('#addActivitytagValue').val();
            var itemId = $('#addActivitytagValue').attr('data-value');
            var cover_image = $('#addActivitytagValue').attr('data-value1');
            var desc = $('#addActivitytagValue').attr('data-value2');


            if (itemId && label) {
                var $newitem = $('<li><input class="input-xlarge focused activitytags" readonly style="width:100px" name="Activitytags" ' +
                    'type="text" value="' + label + '" data-value="' + itemId + '" data-value1="' + cover_image + '" data-value2="' + desc + '"> <input type="button" value="删除" class="li-del"><li>');
                $('#activitytag-list').last().after($newitem);
            } else {
                alert('请不手动输入！');
            }
        },


        savelabel: function (e) {
            var _this = this;
            if ($(e.target).val() == '' || $(e.target).val() == null) {
                return false;
            } else {
                var newlabel = new weego.LabelModel({
                    label: $(e.target).val()
                });
                newlabel.save(null, {
                    success: function (model, res) {
                        if (!res.isSuccess) {
                            console.log("cuole");
                        } else {
                            console.log(model.get('_id'));
                        }
                    }
                });
            }
        },
        showCityLocations: function () {
            // locationCity();
        },
        showLocations: function () {
            codeAddress();
        },
        save: function () {
            var _this = this;
            //attractions_sortType    $("#attractions_en").val()
            //alert($("#attractions_sortType").val()+"************");
            var activities1 = [];
            for (var i = 0; i < $('.activitytags').length; i++) {
                var item = {};
                item._id = $('.activitytags').eq(i).attr('data-value');
                item.title = $('.activitytags').eq(i).attr('value');
                //alert(item.title);
                //item.cover_image = $('.activitytags').eq(i).attr('data-value1');
                //item.desc = $('.activitytags').eq(i).attr('data-value2');
                //alert(item.desc);
                activities1.push(item);
            }

            var group = $(".comments-group");
            var array_text = [];
            for (var i = 0; i < group.length; i++) {//置顶评论操作
                var Element = group.eq(i);
                var title_T = Element.find("input[name=title]").val();
                //title_T=title_T.trim();
                var rating_T = Element.find("input[name=rating]").val();
                var text_T = Element.find("textarea[name=text]").val();
                var date_T = Element.find("input[name=date]").val();
                var nickname_T = Element.find("input[name=nickname]").val();
                //alert(title_T+'#'+rating_T+'#'+text_T+'#'+date_T+'#'+nickname_T);
                if (typeof(title_T) == 'undefined' || typeof(rating_T) == 'undefined' || typeof(text_T) == 'undefined' || typeof(date_T) == 'undefined' || typeof(nickname_T) == 'undefined') {
                    continue;
                } else if (title_T == '' || text_T == '' || date_T == '' || nickname_T == '' || rating_T == '') {
                    alert('评论列表信息不能为空，请重新输入！');
                    return false;
                }
                if (isNaN(rating_T)) {
                    alert("rating值必须1-5之间的整数！");
                    return false;
                } else if (!(rating_T >= 1 && rating_T <= 5)) {
                    alert("rating值必须1-5之间的整数！");
                    return false;
                }
                //alert(date_T);
                array_text.push({title: title_T, rating: rating_T, text: text_T, date: date_T, nickname: nickname_T});
            }

            //[$("#masterLabel").attr('data-value'), $("#masterLabel").attr('value')]
            var masterlabel_Tag=[];
            if($("#masterLabel").attr('value')!=null&&$("#masterLabel").attr('value')!=''){
                masterlabel_Tag=[$("#masterLabel").attr('data-value'), $("#masterLabel").attr('value')];
            }
            var array_label_A = [];
            //alert( $('.labels').length);
            for (var i = 0; i < $('.labels').length; i++) {
                var sublabel_id = $('.labels').eq(i).attr('data-value');
                var sublabel_name = $('.labels').eq(i).attr('value');
                if (sublabel_id != null && sublabel_id != '')
                    var object_label = {_id: sublabel_id, name: sublabel_name};
                array_label_A.push(object_label);
            }
            //return false;
            //alert(array_label.length);
            var show_flag = $('#show_flag').prop('checked') ? '1' : '0';
            var index_flag = $('#index_flag').prop('checked') ? '1' : '0';
            var opentimes = [];
            for (var i = 0; i < $('.opentimes').length; i++) {
                var item = {};
                item.value = $('.opentimes').eq(i).attr('data-value');
                item.desc = $('.opentimes').eq(i).attr('value');
                opentimes.push(item);
            }
            if($("#latitude").val()<-90||$("#latitude").val()>90||$("#longitude").val()<-180||$("#longitude").val()>180){
                alert('经纬度输入有误,请重新输入!\n经度的范围：-180-180、纬度的范围：-90-90');
                return false;
            }
            var yelp_rating=Number($("#yelp_rating").val().replace(/\s+/,''));
            if(isNaN(yelp_rating)||yelp_rating==''){
                alert('yelp_rating应为整数！');
                return false;

            }
            _this.model.save({
                cityname: $("#city_select").find("option:selected").text(),
                cityid: $("#city_select").val(),
                attractions_sortType: $("#attractions_sortType").val(),
                attractions_en: $("#attractions_en").val(),
                attractions: $("#attractions").val(),
                address: $('#address').val(),
                price: $('#price').val(),
                opentime: opentimes,
                yelp_rating: yelp_rating,
                traffic_info: $('#traffic_info').val(),
                dayornight: $('input:radio[name="dayornight"]:checked').val(),
                website: $("#website").val(),
                //website: $("#website").val(),
                comments_url: $("#comments_url").val(),
                telno: $("#telno").val(),
                activity: $("#activity").val(),
                introduce: $("#introduce").val(),
                tips: $('#tips').val(),
                short_introduce: $("#short_introduce").val(),
                recommand_flag: $('input:radio[name="recommand_flag"]:checked').val(),
                recommand_duration: $('#recommand_duration').val(),
                recommand_reason: $('#recommand_reason').val(),
                show_flag: show_flag,
                index_flag: index_flag,
                am: $('#am').prop('checked'),
                pm: $('#pm').prop('checked'),
                ev: $('#ev').prop('checked'),
                masterLabel:masterlabel_Tag ,
                subLabel: array_label_A,
                comments_top: array_text,
                activities: activities1,
                latitude: $("#latitude").val(),
                longitude: $("#longitude").val()
            }, {
                success: function (model, res) {
                    if (!res.isSuccess) {
                        console.log("cuole");
                    } else {
                           var auditingModel = new weego.AuditingModel({
                            city_id: $("#city_select").val(),
                            city_name: $("#city_select").find("option:selected").text(),
                            task_id: $("#task_select").val(),
                            task_name: $("#task_select").find("option:selected").text(),
                            item_id: res._id,
                            editor_id: res.user_id,
                            type: '0',
                            log_type: '1',
                            name: $('#attractions').val()
                        });
                        auditingModel.save(null, {
                            success: function (model, res) {

                                if (!res.isSuccess) {
                                    alert('保存景点成功，但auditing保存失败！');
                                } else
                                    alert('保存成功');
                                window.history.back();
                                // self.location="#attractions";
                            },
                            error: function () {
              /*                  var m=JSON.stringify(model);
                                console.log(JSON.stringify(model));
                                console.log(m.attractions_en);*/
                                alert('修改景点成功，但auditing保存失败！');
                                window.history.back();
                            }
                        });
                    }
                },
                error: function () {
                    console.log("添加失败");
                }
            });
            return false;
        },
        cancel: function () {
            window.history.back();
            //$("#attractionsDetailDialog").new_modal('hide');
        }
    });


    weego.AttractionsView = Backbone.View.extend({
        tagName: 'tr',
        render: function () {
            var _this = this;
            _this.model.fetch({
                success: function () {
                    _this.model.set('user', weego_user.globalUser);
                    var template = Handlebars.compile($("#attractionsView").html());
                    $(template(_this.model.toJSON())).appendTo(_this.$el);
                }
            });

            return this;
        },
        events: {
            'click .modify': 'modify',
            'click .delete': 'delete',
            'click .upload': 'upload',
            'click #manageimg': 'manageimg',
            'click #manage_upattr': 'manage_upattr',
            'click #manageattr': 'manageattr'
        },
        manage_upattr: function (e) {
            var manage_Attr = new weego.Manage_UpattrView();
            manage_Attr.model = this.model;
            manage_Attr.render().$el.modal({
                "show": true,
                "z_index": weego.z_index++
            });
            manage_Attr.unloadPic();
        },
        manageattr: function (e) {
            var manageAttr = new weego.ManageAttrView();
            manageAttr.model = this.model;
            manageAttr.render().$el.modal({
                "show": true,
                "z_index": weego.z_index++
            });
            manageAttr.unloadPic();
        },
        manageimg: function (e) {
            var manageImageView = new weego.ManageImageView();
            manageImageView.model = this.model;
            manageImageView.render().$el.new_modal({
                "show": true,
                "z_index": weego.z_index++
            });
            manageImageView.unloadPic();
        },
        modify: function (e) {
            var attractionId = $(e.currentTarget).attr('data-value');
            self.location = '#attraction/' + attractionId;
        },
        delete: function (e) {
            var _this = this;
            var isConfirmed = confirm("是否删除???");
            if (isConfirmed) {
                this.model.destroy({
                    success: function (model, response) {
                        _this.$el.remove();
                    }
                });
            }
        },
        upload: function () {
            var _this = this;
            $('#dialog').dialog();
            new qq.FileUploader({
                element: $('#dialog')[0],
                action: 'upload',
                debug: true,
                params: {
                    attractions_id: _this.model.get('_id')
                },
                onComplete: function (id, fileName, responseJSON) {
                    alert("上传成功");
                    $('#dialog').dialog("close");
                }
            });
        }
    });
    weego.ManageAttrView = Backbone.View.extend({
        tagName: "div",
        className: "modal hide fade",
        "id": "manageAttrDialog",
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
            var imgForlder = 'attractions';
            var spot = _this.model.get('spot');
            if (spot && spot.length > 0) {
                for (var i = 0; i < spot.length; i++) {
                    var uploadAttrView = new weego.UploadAttrViewLife();
                    uploadAttrView.model = {
                        _id: spot[i].cover_image,
                        desc: spot[i].desc,
                        title: spot[i].title,
                        advice: spot[i].advice,
                        imgForlder: imgForlder,
                        type: 'attr',
                        num:i
                    };
                    uploadAttrView.render().$el.appendTo(_this.$("#TempuploadedName"));
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
                url: '/postAttr',
                type: 'attr',
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
                                    '<p><strong>亮点名称</strong></p><textarea id="uploadTitle_' + i + '" class="upload_title_list" style="height:30px;width:500px"></textarea>' +
                                    '<p><strong>推荐标签&nbsp;&nbsp;<font color="red">非必填，参考标签如：编辑推荐、不可错过等，字数少于5字</font></strong></p><textarea id="uploadAdvice_' + i + '" class="upload_desc_list" style="height:30px;width:500px"></textarea>' +
                                    '<p><strong>亮点描述</strong></p><textarea id="uploadDesc_' + i + '" class="upload_desc_list" style="height:200px;width:500px"></textarea>' +
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
    weego.Manage_UpattrView = Backbone.View.extend({
        tagName: "div",
        className: "modal hide fade",
        "id": "manageAttrDialog",
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
            var imgForlder = 'attractions';
            var spot = _this.model.get('image');
            if (spot && spot.length > 0) {
                for (var i = 0; i < spot.length; i++) {
                    var uploadAttrView = new weego.UploadAttrViewLife();
                    uploadAttrView.model = {
                        _id: spot[i],
                        imgForlder: imgForlder,
                        type:"attractions_background",
                        num:i
                    };
                    uploadAttrView.render().$el.appendTo(_this.$("#TempuploadedName"));
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
                url: '/post_Attr',
                type: 'attr',
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
    weego.ManageImageView = Backbone.View.extend({
        tagName: "div",
        className: "modal hide fade",
        "id": "manageImageDialog",
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
            var template = Handlebars.compile($('#manageImageView').html());
            $(template()).appendTo(_this.$el);
            _this.$('#zxx_id').val(_this.model.get('_id'));
            var image = _this.model.get('image');
            if (image && image.length > 0) {
                for (var i = 0; i < image.length; i++) {
                    var uploadImageView = new weego.UploadImageView();
                    uploadImageView.model = {
                        _id: image[i],
                        imgForlder: 'attractions'
                    };
                    uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
                }
            }
            var coverImageName = _this.model.get('coverImageName');
            if (coverImageName) {
                _this.$('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/attractions/origin/' + coverImageName + '?rev=' + Math.random() + '">'));
            }

            return this;
        },
        unloadPic: function () {
            this.initZXXFILE();
            // var _this = this;
            // var oBtn = document.getElementById("unloadPic");
            // var oShow = document.getElementById("uploadedName");
            // new AjaxUpload(oBtn, {
            //     action:"/postimage",
            //     name:"upload",
            //     data:{
            //         _id:_this.$('#zxx_id').val()
            //     },
            //     responseType:"json",
            //     onSubmit:function (file, ext) {
            //     },
            //     onComplete:function (file, response) {
            //         var uploadImageView = new weego.UploadImageView();
            //         uploadImageView.model = response;
            //         uploadImageView.render().$el.appendTo(_this.$("#uploadedName"));
            //     }
            // });
        },
        initZXXFILE: function () {
            var params = {
                fileInput: $("#fileImage").get(0),
                dragDrop: $("#fileDragArea").get(0),
                upButton: $("#fileSubmit").get(0),
                url: $("#uploadForm").attr("action"),
                filter: function (files) {
                    var arrFiles = [];
                    for (var i = 0, file; file = files[i]; i++) {
                        if (file.type.indexOf("image") == 0 || (!file.type && /\.(?:jpg|png|gif)$/.test(file.name) /* for IE10 */ )) {
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
                    var html = '',
                        i = 0;
                    $("#preview").html('<div class="upload_loading"></div>');
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
                            $("#preview").html(html);
                            if (html) {
                                //删除方法
                                $(".upload_delete").click(function () {
                                    ZXXFILE.funDeleteFile(files[parseInt($(this).attr("data-index"))]);
                                    return false;
                                });
                                //提交按钮显示
                                $("#fileSubmit").show();
                            } else {
                                //提交按钮隐藏
                                $("#fileSubmit").hide();
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
                    var eleProgress = $("#uploadProgress_" + file.index),
                        percent = (loaded / total * 100).toFixed(2) + '%';
                    eleProgress.show().html(percent);
                },
                onSuccess: function (file, response) {
                    $("#uploadInf").append("<p>图片" + file.name + "上传成功!</p>");
                },
                onFailure: function (file) {
                    $("#uploadInf").append("<p>图片" + file.name + "上传失败！</p>");
                    $("#uploadImage_" + file.index).css("opacity", 0.2);
                },
                onComplete: function () {
                    //提交按钮隐藏
                    $("#fileSubmit").hide();
                    //file控件value置空
                    $("#fileImage").val("");
                    $("#uploadInf").append("<p>当前图片全部上传完毕，可继续添加上传。</p>");
                }
            };
            ZXXFILE = $.extend(ZXXFILE, params);
            ZXXFILE.init();
        }
    });
    weego.UploadAttrViewLife = Backbone.View.extend({
        tagName: 'li',
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
            var num=_this.model.num;
            var _id = $('#zxx_id_Temp').val();
            var title=$('.txt-title'+num).val();
            var desc=$('.txt-desc'+num).val();
            var advice=$('.txt-advice'+num).val();
            //var data = new FormData();
            //data.append('_id', _this.model._id);
            //data.append('title', _this.title);
            //data.append('desc', _this.desc);
            $.ajax({
                type: 'POST',
                url: '/UpdateUploadAttr',
                data: {'_id': _id, 'name': _this.model._id, 'title': title, 'desc': desc, 'advice':advice},
                success: function (data) {
                    if (data.status == 'success') {
                        alert("save success!");
                    }
                }
            })
        },
        remove: function (e) {
            var _this = this;
            var _id = $('#zxx_id_Temp').val();
            $.ajax({
                url: '/delUploadAttr/' + _id + '/' + _this.model._id,
                success: function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });
    weego.UploadImageView = Backbone.View.extend({
        tagName: 'li',
        initialize: function () {
            _.bindAll(this, 'render', 'remove', 'setCoverImg');
        },
        render: function () {
            var _this = this;
            var template = Handlebars.compile($('#uploadImageView').html());
            $(template(_this.model)).appendTo(_this.$el);
            return this;
        },
        events: {
            'click .btn-remove': 'remove',
            'click .setCoverImg': 'setCoverImg'
        },
        setCoverImg: function () {
            var _this = this;
            var _id = $('#zxx_id').val();
            $.ajax({
                url: '/setCoverImg/' + _id + '/' + _this.model._id,
                success: function (data) {
                    if (data) {
                        $('#coverImageName').empty().append($('<img src="http://weegotest.b0.upaiyun.com/attractions/origin/' + data + '?rev=' + Math.random() + '">'));
                    }
                }
            });
        },
        remove: function (e) {
            var _this = this;
            var _id = $('#zxx_id').val();
            $.ajax({
                url: '/delUploadImage/' + _id + '/' + _this.model._id,
                success: function (data) {
                    if (data.status == 'success') {
                        _this.$el.remove();
                    }
                }
            })
        }
    });

    weego.AllCountriesView = Backbone.View.extend({
        render: function (data) {
            var asCountries = [],
                euCountries = [], //欧洲
                afCountries = [],
                saCountries = [],
                ocCountries = [],
                naCountries = [];
            for (var i = 0; i < data.length; i++) {
                switch (data[i].continentscode) {
                    case 'AS':
                        asCountries.push(data[i].countryname);
                        asCountries = distinct(asCountries);
                        break;
                    case 'EU':
                        euCountries.push(data[i].countryname);
                        euCountries = distinct(euCountries);
                        break;
                    case 'AF':
                        afCountries.push(data[i].countryname);
                        afCountries = distinct(afCountries);
                        break;
                    case 'SA':
                        saCountries.push(data[i].countryname);
                        saCountries = distinct(saCountries);
                        break;
                    case 'OC':
                        ocCountries.push(data[i].countryname);
                        ocCountries = distinct(ocCountries);
                        break;
                    case 'NA':
                        naCountries.push(data[i].countryname);
                        naCountries = distinct(naCountries);
                        break
                }
            }
            $(this.el).html(Handlebars.compile($('#allCountries').html())({
                asCountries: asCountries,
                euCountries: euCountries,
                afCountries: afCountries,
                saCountries: saCountries,
                ocCountries: ocCountries,
                naCountries: naCountries
            }));
            return this;
        }
    })

    weego.CountryCitiesView = Backbone.View.extend({
        render: function (countryname) {
            $(this.el).html(Handlebars.compile($('#countrycities').html())({
                countryname: countryname
            }));
            return this;
        }
    })

    weego.AppView = Backbone.View.extend({
        el: '#app',
        query: {},

        initialize: function (options) {
            var thisView = this;
            thisView.cityname = options.cityname;
            _.bindAll(this, 'render', 'nextPage', 'prePage', 'appendAttractions', 'addAttractions', 'getData');
            this.collection = new weego.AttractionsColletion();
            this.collection.on('add', this.appendAttractions);
        },
        render: function (cityname) {
            var thisView = this;
            $('#app').off();
            $('#app').empty();
            var _this = this;
            var template = Handlebars.compile($("#appView").html());
            $(template({
                user: weego_user.globalUser,
                cityname: thisView.cityname
            })).appendTo(_this.$el);
            _this.delegateEvents(_this.events);
            return this;
        },
        events: {
            'click #addAttractionsButton': 'addAttractions',
            'click #nextPageButton': 'nextPage',
            'click #prePageButton': 'prePage',
            'click #search-city-button': 'search'
        },
        search: function () {
            var cityname = $('#search-city-cityname').val();
            var attrname = $('#search-city-attraction').val();
            self.location = '#attractions/1/q_' + cityname + '/q_' + attrname;
        },
        addAttractions: function () {
            // new weego.AttractionsDetailView().render(this).$el.new_modal({
            //     "show":true,
            //     "z_index":weego.z_index++
            // });
            // initialize();
            self.location = '#attraction/new';
        },
        appendAttractions: function (attractions) {
            var attractionsView = new weego.AttractionsView();
            attractionsView.model = attractions;
            attractionsView.render().$el.appendTo(this.$("tbody"));
        },
        nextPage: function () {
            if (weego.currentPage >= weego.sumpages) {
                alert("没有下一页");
                return;
            }
            weego.currentPage = parseInt(weego.currentPage) + 1;
            // if (weego.name != '') {
            //     self.location = "#city/" + weego.name + "/" + weego.currentPage;
            // } else {
            //     self.location = "#attractions/" + weego.currentPage;
            // }
            self.location = "#attractions/" + weego.currentPage + '/q_' + this.query.cityname + '/q_' + this.query.attrname;
        },
        prePage: function () {
            if (weego.currentPage > 1) {
                weego.currentPage = parseInt(weego.currentPage) - 1;
                self.location = "#attractions/" + weego.currentPage + '/q_' + this.query.cityname + '/q_' + this.query.attrname;
            } else {
                alert("无上一页");
            }
        },
        getData: function (_index, query) {
            this.query = query;
            var _this = this;
            var cityname = name || "";
            $.ajax({
                url: '/getAttractionsByPage/' + weego.limit + '/' + _index + '?cityname=' + query.cityname + '&attrname=' + query.attrname,
                type: 'GET',
                success: function (data) {
                    weego.count = data.count;
                    if (data && data.attractions && data.attractions.length > 0) {
                        _this.collection.reset();
                        _this.render();
                        _this.$('#allattractionsno').html(weego.count);
                        _this.$('#current_page').html(weego.currentPage);
                        weego.sumpages = Math.ceil(weego.count / weego.limit);
                        _this.$('#sum_page').html(weego.sumpages);
                        for (var i = 0; i < data.attractions.length; i++) {
                            _this.collection.add(data.attractions[i]);
                        }
                    } else {
                        if (weego.currentPage == 1) {
                            _this.render();
                            _this.$('#allattractionsno').html('0');
                            _this.$('#current_page').html('1');
                            _this.$('#sum_page').html('1');
                            alert("没有景点");
                        } else {
                            alert("无下一页");
                            weego.currentPage--;
                        }
                    }
                    if (!isNull(query.cityname)) {
                        _this.$('#search-city-cityname').attr('value', query.cityname);
                    }
                    if (!isNull(query.attrname)) {
                        $('#search-city-attraction').val(query.attrname);
                    }
                }
            });
        }
    });
    weego.StatisticsView = Backbone.View.extend({
        el: "#app",
        initialize: function () {
            var thisView = this;
            if (weegoCache.statisticsTpl) {
                thisView.$el.empty().append(weegoCache.statisticsTpl);
                thisView.initBar();
            } else {
                $("<div/>").load("/templ/statistics.handlebars", function () {
                    var template = Handlebars.compile($(this).html());
                    weegoCache.statisticsTpl = template();
                    thisView.$el.empty().append(template());
                    thisView.initBar();
                });
            }
        },
        //fake data
        initBar: function () {
            $('.statistics_bar').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: '数据统计'
                },
                xAxis: {
                    categories: ['城市', '景点', '酒店']
                },
                yAxis: {
                    title: {
                        text: '数量'
                    }
                },
                series: [{
                    name: '总数',
                    data: [50, 200, 54]
                }, {
                    name: '已有',
                    data: [16, 103, 5]
                }]
            });
        },
        events: {}
    });
    var geocoder;
    var map;
    var city_location;
    var marker;

    function initialize() {
        // geocoder = new google.maps.Geocoder();
        // var latlng;
        // if ($("#latitude").val() != '' && $("#longitude").val() != '') {
        //     latlng = new google.maps.LatLng(parseFloat($("#latitude").val()), parseFloat($("#longitude").val()));
        // } else {
        //     latlng = new google.maps.LatLng(39.924482, 116.408386);
        // }

        // var mapOptions = {
        //     zoom: 9,
        //     center: latlng,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        // }
        // map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        // marker = new google.maps.Marker({
        //     position: latlng,
        //     map: map
        // });
    }

    function locationCity() {
        // var address = document.getElementById('cityname').value;
        var address = $("#city_select").find("option:selected").text();
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                city_location = results[0].geometry.location;
                map.setCenter(results[0].geometry.location);
            }
        });
    }

    function codeAddress() {
        marker.setMap(null);
        var address = document.getElementById('attractions_en').value;
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $("#latitude").val(results[0].geometry.location.lat());
                $("#longitude").val(results[0].geometry.location.lat());
                map.setCenter(results[0].geometry.location);
                marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function distinct(data) {
        var b = [];
        var obj = {};
        for (var i = 0; i < data.length; i++) {
            obj[data[i]] = data[i];
        }
        for (var a in obj) {
            b.push(obj[a]);
        }
        return b;
    };


}(weego));
