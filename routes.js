var routes = require('./routes/routes');

module.exports = function(app) {
	app.post('/addlabel', routes.label.saveLabel);

	app.post('/label', routes.label.addLabel);
	app.get('/label/:labelID', routes.label.getLabel);
	app.del('/label/:labelID', routes.label.deleteLabel);
	app.put('/label/:labelID', routes.label.updateLabel);
	app.get('/getAllLabel', routes.label.getAllLabel);
	app.get('/getLabelByPage/:pageLimit/:pageIndex', routes.label.getLabelByPage);
	app.get('/getLabelByLevel/:num',routes.label.getLabelByLevel);
	app.get('/getLabelByLabelID/:labelID/:key',routes.label.getLabelByLabelID);
	app.get('/getLabelByLabId/:id', routes.label.getLabelByLabId);
	app.get('/getLabelByID/:id',routes.label.getLabelByID);
	app.get('/attractionsimage/:imageId', routes.attractions.getAttractionsImage);
	app.get('/delUploadImage/:_id/:imageName', routes.attractions.delUploadImage);
	app.get('/delUploadAttr/:_id/:imageName', routes.attractions.delUploadAttr);
	app.get('/setCoverImg/:_id/:imageName', routes.attractions.setCoverImg);
	app.post('/postimage', routes.attractions.postimage);
	app.post('/postAttr', routes.attractions.postattr);
	app.post('/post_Attr', routes.attractions.post_attr);
	app.post('/UpdateUploadAttr',routes.attractions.UpdateUploadAttr);
	//attractions
	app.post('/attractions', routes.attractions.saveAttractions);
	app.get('/attractions/:attractionsID', routes.attractions.getAttractions);
	app.del('/attractions/:attractionsID', routes.attractions.deleteAttractions);
	app.put('/attractions/:attractionsID', routes.attractions.updateAttractions);
	app.get('/getAttractionsImage/:attractionsID', routes.attractions.getAttractionsImage);


	app.get('/getAllAttractions', routes.attractions.getAllAttractions);
	app.get('/getAttractionsByPage/:pageLimit/:pageIndex?', routes.attractions.getAllAttractionsByPage);

	app.get('/getAllUserCreateAttractionsByPage/:pageLimit/:pageIndex/:name?', routes.attractions.getAllUserCreateAttractionsByPage);
	app.get('/checkattractions/:attractionsID', routes.attractions.getAttractions);
	app.put('/checkattractions/:attractionsID',routes.attractions.checkattractions);
	app.post('/upload',routes.attractions.upload);
	app.post('/addMasterLabelToAttractions',routes.attractions.addMasterLabelToAttractions);
	app.post('/addSubLabelToAttractions',routes.attractions.addSubLabelToAttractions);
	app.get('/getAttractionsByLabelID/:labelID/:cityName',routes.attractions.getAttractionsByLabelID);
	//city
	app.post('/city', routes.city.saveCity);
	app.get('/city/:cityID', routes.city.getCity);
	app.del('/city/:cityID', routes.city.deleteCity);
	app.put('/city/:cityID', routes.city.updateCity);
	app.post('/updatecity', routes.city.updateCityNew);
	app.post('/updatecityitem', routes.city.updateResShopItem);
	app.post('/updateattritem', routes.city.updateAttrItem);
	app.post('/updateareaitem', routes.city.updateAreaItem);
	app.get('/getAllCity', routes.city.getAllCity);
	app.get('/getCountryCities/:countryname', routes.city.getCountryCities);
	app.get('/getCountryCities/:countryname/:cityid', routes.city.getCityByName);
	app.get('/getCountryCities/:countryname/:cityname/:type', routes.city.getCityItem);
	app.get('/getCountryCities/:countryname/:cityname/:type/:itemname', routes.city.showCityItem);
	// app.get('/getCountryCities/:countryname?', routes.city.getOneCityByName);
	app.get('/getAllCountries', routes.country.getAllCountries);
	app.get('/getAllCityBaseInfo', routes.city.getAllCityBaseInfo);
	app.get('/getCityByPage/:pageLimit/:pageIndex?', routes.city.getCityByPage);
	app.get('/getCityByLabelID/:labelID', routes.city.getCityByLabelID);
	app.get('/getCountriesByContinent/:continentCode',routes.city.getCountriesByContinent);
	app.get('/getCityByCountry/:countryCode',routes.city.getCityByCountry);
	app.get('/getCountryStatistic/:countryCode',routes.city.getCountryStatistic);

	app.get('/setCityCoverImg/:_id/:imageName', routes.city.setCityCoverImg);
	app.post('/citypic/upload',routes.city.upload);
	app.get('/delCoverImage/:_id/:imageName',routes.city.delCoverImage);

	app.post('/citypic/upload_background_img',routes.city.upload_background_img);
	app.get('/delBackgroundImage/:_id/:imageName',routes.city.delBackgroundImage);
	app.get('/cityCoverimage/:imageId', routes.city.getCityCoverImage);
	app.get('/cityBackimage/:imageId', routes.city.getCitBackImage);
	app.post('/postCityImage',routes.life.postCityImage);
	app.post('/postCityCoverImage',routes.life.postCityCoverImage);
	app.post('/login',routes.editUser.login);

	app.post('/user',routes.editUser.saveUser);
	app.put('/user/:userID',routes.editUser.updateUser);
	app.del('/user/:userID', routes.editUser.deleteUser);
	app.get('/getUserByPage/:pageLimit/:pageIndex', routes.editUser.getUserByPage);
	app.get('/getAllEditor', routes.editUser.getAllEditor);

	app.post('/addMasterLabelToCities',routes.city.addMasterLabelToCities);
	app.post('/addSubLabelToCities',routes.city.addSubLabelToCities);

	//hotel
	app.get('/hotel/:hotelId', routes.hotel.get);
	app.del('/hotel/:hotelId', routes.hotel.remove);
	app.put('/hotel/:hotelId', routes.hotel.update);
	app.post('/hotel', routes.hotel.addNewHotel);
	app.get('/hotel/image/:fileName', routes.hotel.getImage);
	app.post('/hotel/image/:hotelId', routes.hotel.uploadImage);
	app.get('/hotels/:pageLimit/:pageIndex?', routes.hotel.getHotelByPage);
	app.get('/delUploadImageHotel/:_id/:imageName',routes.hotel.delUploadImageHotel);

	//category
	app.get('/category/:categoryId', routes.life.getCategory);
	app.del('/category/:categoryId', routes.life.removeCategory);
	app.put('/category/:categoryId', routes.life.updateCategory);
	app.post('/category', routes.life.addNewCategory);
	app.post('/addcityitem', routes.life.addNewRestaurant);
	app.get('/categorys/:pageLimit/:pageIndex/:type', routes.life.getCategoryByPage);
	app.get('/categorys/:pageLimit/:pageIndex', routes.life.getCategoryByPage);
	app.get('/getCategorysByQuery/:type/:name?',routes.life.getCategorysByQuery);
	//app.get('/getBrandsByQuery/:type/:title?',routes.life.getBrandsByQuery);
    //brand品牌
	app.get('/brand/:brandId', routes.life.getBrand);
	app.del('/brand/:brandId', routes.life.removeBrand);
	app.put('/brand/:brandId', routes.life.updateBrand);
	app.post('/brand', routes.life.addNewBrand);
	app.get('/brands/:pageLimit/:pageIndex/:type', routes.life.getBrandByPage);
	app.get('/brands/:pageLimit/:pageIndex', routes.life.getBrandByPage);
	app.get('/getBrandsByQuery/:type/:name?',routes.life.getBrandsByQuery);
	app.post('/postBrandImage',routes.life.postBrandImage);
	app.get('/delUploadBrandImage/:_id/:image',routes.life.delUploadBrandImage);
	 //h5分享页
	app.get('/event_cms/:event_cmsId', routes.life.getEvent_cms);
	app.del('/event_cms/:event_cmsId', routes.life.removeEvent_cms);
	app.put('/event_cms/:event_cmsId', routes.life.updateEvent_cms);
	app.post('/event_cms', routes.life.addNewEvent_cms);
	app.get('/event_cmss/:pageLimit/:pageIndex/:type', routes.life.getEvent_cmsByPage);
	app.get('/event_cmss/:pageLimit/:pageIndex', routes.life.getEvent_cmsByPage);
	app.post('/postEvent_cmsImage',routes.life.postEvent_cmsImage);
	app.post('/postEvent_cmsDetailImage',routes.life.postEvent_cmsDetailImage);
	app.post('/postEvent_cmsSign_up_Image',routes.life.postEvent_cmsSign_up_Image);
	app.post('/postEvent_cmsPartner_image',routes.life.postEvent_cmsPartner_image);
	app.get('/delUploadEvent_cmsImage/:_id/:image',routes.life.delUploadEvent_cmsImage);
	app.get('/delUploadEvent_Detail_Image/:_id/:image',routes.life.delUploadEvent_Detail_Image);
	app.get('/delUploadEvent_Sign_up_Image/:_id/:image',routes.life.delUploadEvent_Sign_up_Image);
	app.get('/delUploadEvent_Partner_image/:_id/:image',routes.life.delUploadEvent_Partner_image);
	//version
	app.get('/version_mang/:version_mangId', routes.life.getVersion_mang);
	app.del('/version_mang/:version_mangId', routes.life.removeVersion_mang);
	app.put('/version_mang/:version_mangId', routes.life.updateVersion_mang);
	app.post('/version_mang', routes.life.addNewVersion_mang);
	app.get('/version_mangs/:pageLimit/:pageIndex/:type', routes.life.getVersion_mangByPage);
	app.get('/version_mangs/:pageLimit/:pageIndex', routes.life.getVersion_mangByPage);
	//app.get('/getVersion_mangsByQuery/:type/:name?',routes.life.getVersion_mangsByQuery);
	//app.post('/postBrandImage',routes.life.postBrandImage);
	//app.get('/delUploadBrandImage/:_id/:image',routes.life.delUploadBrandImage);
	//recommendRule
	app.get('/recommendRule/:recommendRuleId', routes.life.getRecommendRule);
	app.del('/recommendRule/:recommendRuleId', routes.life.removeRecommendRule);
	app.put('/recommendRule/:recommendRuleId', routes.life.updateRecommendRule);
	app.post('/recommendRule', routes.life.addNewRecommendRule);
	app.get('/recommendRules/:pageLimit/:pageIndex/:type', routes.life.getRecommendRuleByPage);
	app.get('/recommendRules/:pageLimit/:pageIndex', routes.life.getRecommendRuleByPage);
	//recommendTime
	app.get('/recommendTime/:recommendTimeId', routes.life.getRecommendTime);
	app.del('/recommendTime/:recommendTimeId', routes.life.removeRecommendTime);
	app.put('/recommendTime/:recommendTimeId', routes.life.updateRecommendTime);
	app.post('/recommendTime', routes.life.addNewRecommendTime);
	app.get('/recommendTimes/:pageLimit/:pageIndex/:type', routes.life.getRecommendTimeByPage);
	app.get('/recommendTimes/:pageLimit/:pageIndex', routes.life.getRecommendTimeByPage);
	 //news
	app.get('/news_cms/:news_cmsId', routes.life.getNews_cms);
	app.del('/news_cms/:news_cmsId', routes.life.removeNews_cms);
	app.put('/news_cms/:news_cmsId', routes.life.updateNews_cms);
	app.post('/news_cms', routes.life.addNewNews_cms);
	app.get('/news_cmss/:pageLimit/:pageIndex/:type', routes.life.getNews_cmsByPage);
	app.get('/news_cmss/:pageLimit/:pageIndex', routes.life.getNews_cmsByPage);
	app.get('/getNews_cmssByQuery/:type/:name?',routes.life.getNews_cmssByQuery);
	app.post('/postNews_cmsImage',routes.life.postNews_cmsImage);
	app.get('/delUploadNews_cmsImage/:_id/:image',routes.life.delUploadNews_cmsImage);
	//动态推送
	app.get('/recommendInfo/:recommendInfoId', routes.life.getRecommendInfo);
	app.del('/recommendInfo/:recommendInfoId', routes.life.removeRecommendInfo);
	app.put('/recommendInfo/:recommendInfoId', routes.life.updateRecommendInfo);
	app.post('/recommendInfo', routes.life.addNewRecommendInfo);
	app.get('/recommendInfos/:pageLimit/:pageIndex/:type', routes.life.getRecommendInfoByPage);
	app.get('/recommendInfos/:pageLimit/:pageIndex', routes.life.getRecommendInfoByPage);
	app.get('/getRecommendInfosByQuery/:type/:name?',routes.life.getRecommendInfosByQuery);
	app.post('/postRecommendInfoImage',routes.life.postRecommendInfoImage);
	app.get('/delUploadRecommendInfoImage/:_id/:image',routes.life.delUploadRecommendInfoImage);
	 //人物档案管理信息
	app.get('/people/:peopleId', routes.life.getPeople);
	app.del('/people/:peopleId', routes.life.removePeople);
	app.put('/people/:peopleId', routes.life.updatePeople);
	app.post('/people', routes.life.addNewPeople);
	app.get('/peoples/:pageLimit/:pageIndex/:type', routes.life.getPeopleByPage);
	app.get('/peoples/:pageLimit/:pageIndex', routes.life.getPeopleByPage);
	app.get('/getPeoplesByQuery/:type/:name?',routes.life.getPeoplesByQuery);
	app.post('/postPeopleImage',routes.life.postPeopleImage);
	app.post('/postPeopleHead_Image',routes.life.postPeopleHead_Image);
	app.get('/delUploadPeopleImage/:_id/:image',routes.life.delUploadPeopleImage);
	app.get('/delUploadPeopleHead_Image/:_id/:image',routes.life.delUploadPeopleHead_Image);
	 //pgc
	app.get('/pgc/:pgcId', routes.life.getPgc);
	app.del('/pgc/:pgcId', routes.life.removePgc);
	app.put('/pgc/:pgcId', routes.life.updatePgc);
	app.post('/pgc', routes.life.addNewPgc);
	app.get('/pgcs/:pageLimit/:pageIndex/:type', routes.life.getPgcByPage);
	app.get('/pgcs/:pageLimit/:pageIndex', routes.life.getPgcByPage);
	app.get('/getPgcsByQuery/:type/:name?',routes.life.getPgcsByQuery);
	app.post('/postPgcImage',routes.life.postPgcImage);
	app.post('/postPgcOriginImage',routes.life.postPgcOriginImage);
	app.get('/delUploadPgcImage/:_id/:image',routes.life.delUploadPgcImage);
	app.get('/delUploadPgcOriginImage/:_id/:image',routes.life.delUploadPgcOriginImage);
	app.get('/delUploadCiytImage/:_id/:image',routes.life.delUploadCityImage);
	//banner管理
	app.get('/banner/:bannerId', routes.life.getBanner);
	app.del('/banner/:bannerId', routes.life.removeBanner);
	app.put('/banner/:bannerId', routes.life.updateBanner);
	app.post('/banner', routes.life.addNewBanner);
	app.get('/banners/:pageLimit/:pageIndex/:type', routes.life.getBannerByPage);
	app.get('/banners/:pageLimit/:pageIndex', routes.life.getBannerByPage);
	app.get('/getBannersByQuery/:type/:name?',routes.life.getBannersByQuery);
	app.post('/postBannerImage',routes.life.postBannerImage);
	app.post('/postBannerImage_6',routes.life.postBannerImage_6);
	app.post('/postBannerImage_plus',routes.life.postBannerImage_plus);
	app.post('/postBannerImage_android',routes.life.postBannerImage_android);
	app.get('/delUploadBannerImage/:_id/:image/:images_type',routes.life.delUploadBannerImage);
 	//activity活动
	app.get('/activity/:activityId', routes.life.getActivity);
	app.del('/activity/:activityId', routes.life.removeActivity);
	app.put('/activity/:activityId', routes.life.updateActivity);
	app.post('/activity', routes.life.addNewActivity);
	app.get('/activitys/:pageLimit/:pageIndex/:type', routes.life.getActivityByPage);
	app.get('/activitys/:pageLimit/:pageIndex', routes.life.getActivityByPage);
	app.get('/getActivitysByQuery/:type/:name?',routes.life.getActivitysByQuery);
	app.post('/postActivityImage',routes.life.postActivityImage);
	app.get('/delUploadActivityImage/:_id/:image',routes.life.delUploadActivityImage);
	//lifetag
	app.get('/lifetag/:lifetagId', routes.life.getLifetag);
	app.del('/lifetag/:lifetagId', routes.life.removeLifetag);
	app.put('/lifetag/:lifetagId', routes.life.updateLifetag);
	app.post('/lifetag', routes.life.addNewLifetag);
	// app.get('/setResShopCoverImg', routes.life.setResShopCoverImg);
	app.get('/lifetags/:pageLimit/:pageIndex/:type', routes.life.getLifetagByPage);
	app.get('/lifetags/:pageLimit/:pageIndex', routes.life.getLifetagByPage);
	app.get('/getLifetagsByType/:type',routes.life.getLifetagsByType);
	//brand关联
	app.get('/getBrandtagsByType/:type/:key',routes.life.getBrandtagsByType);
	//动态推送关联
	app.get('/getRecommendInfotagsByType/:type/:key',routes.life.getRecommendInfotagsByType);
	//人物信息关联
	app.get('/getPeopletagsByType/:type/:key',routes.life.getPeopletagsByType);
		//关联推荐时间
	 app.get('/getrecommendTimesByType/:key',routes.life.getrecommendTimesByType);
    //城市活动
	app.get('/getCityactivitytagsByType/:type/:key',routes.life.getActivitytagsByType);
	app.get('/getActivitytagsByType/:type/:key',routes.life.getActivitytagsByType);
	app.get('/getActivitytagsByType2/:type/:key',routes.life.getActivitytagsByType);
	app.get('/getShoptagsByType/:type/:key',routes.life.getShoptagsByType);
	app.get('/getRestagsByType/:type/:key',routes.life.getRestagsByType);

	//area
	app.get('/area/:areaId', routes.life.getArea);
	app.del('/area/:areaId', routes.life.removeArea);
	app.put('/area/:areaId', routes.life.updateArea);
	app.post('/area', routes.life.addNewArea);
	app.post('/area/upload', routes.life.uploadAreaImg);
	app.get('/setAreaCoverImg/:id/:imageName', routes.life.setAreaCoverImg);
	app.get('/delareaimg/:id/:imageName', routes.life.delAreaImg);

	app.get('/areas/:pageLimit/:pageIndex', routes.life.getAreaByPage);
	app.get('/getAreasByCityId/:cityId',routes.life.getAreasByCityId);
	app.get('/getAreasByCityName/',routes.life.getAreasByCityName);
	app.get('/getActivitysByName/',routes.life.getActivitysByName);
	app.get('/getPgcsByName/',routes.life.getPgcsByName);
	app.get('/getbrandssByName/',routes.life.getbrandssByName);
	app.get('/getnews_cmsssByName/',routes.life.getnews_cmsssByName);
	app.get('/getrecommendInfossByName/',routes.life.getrecommendInfossByName);

	//restaurant
	app.get('/restaurant/:restaurantId', routes.life.getRestaurant);
	app.del('/restaurant/:restaurantId', routes.life.removeRestaurant);
	app.put('/restaurant/:restaurantId', routes.life.updateRestaurant);
	app.post('/restaurant', routes.life.addNewRestaurant);
	app.get('/restaurants/:pageLimit/:pageIndex?', routes.life.getRestaurantByPage);
	// app.get('/restaurants/:pageLimit/:pageIndex/:city_name/:lifename',routes.life.getRestaurantByPage);
	app.get('/restaurants/:pageLimit/:pageIndex/:city_name/:areaname/:lifename/:tags', routes.life.getRestaurantByPage);

	//shopping
	app.get('/shopping/:shoppingId', routes.life.getShopping);
	app.del('/shopping/:shoppingId', routes.life.removeShopping);
	app.put('/shopping/:shoppingId', routes.life.updateShopping);
	app.post('/shopping', routes.life.addNewShopping);
	app.get('/shoppings/:pageLimit/:pageIndex?', routes.life.getShoppingByPage);
	app.get('/getBigShoppingByCityId/:cityId', routes.life.getBigShoppingByCityId);
	app.post('/shoppings/:areaname', routes.life.getShoppingByPage);

	//entertainment
	app.get('/entertainment/:entertainmentId', routes.life.getEntertainment);
	app.del('/entertainment/:entertainmentId', routes.life.removeEntertainment);
	app.put('/entertainment/:entertainmentId', routes.life.updateEntertainment);
	app.post('/entertainment', routes.life.addNewEntertainment);
	app.get('/entertainments/:pageLimit/:pageIndex?', routes.life.getEntertainmentByPage);

	app.post('/postLifeImage', routes.life.postLifeImage);
	app.post('/postLifeMenu', routes.life.postLifeMenu);
	app.post('/postLifeMenu2', routes.life.postLifeMenu2);
	app.post('/postPgc_image_desc', routes.life.postPgc_image_desc);
	app.post('/postNews_CMS_image_desc', routes.life.postNews_CMS_image_desc);
	app.post('/postLife_Activity', routes.life.postLife_Activity);
	app.post('/UpdateUploadMenu', routes.life.UpdateUploadMenu);
	app.post('/UpdateUploadMenu_people', routes.life.UpdateUploadMenu_people);
	app.post('/UpdateUploadActivity_image', routes.life.UpdateUploadActivity_image);
	app.post('/UpdateUploadPgc_image_desc', routes.life.UpdateUploadPgc_image_desc);
	app.post('/UpdateUploadNews_Cms_image_desc', routes.life.UpdateUploadNews_Cms_image_desc);
	// app.post('/postLifeImage/:_id/:type', routes.life.postLifeImage);
	app.get('/delUploadImageLife/:_id/:imageName/:_type', routes.life.delUploadImageLife);
	app.get('/delUploadMenuLife/:_id/:imageName/:_type',routes.life.delUploadMenuLife);
	app.get('/delUploadMenuLife_people/:_id/:imageName/:_type',routes.life.delUploadMenuLife_people);
	app.get('/delUploadActivity_image/:_id/:imageName/:_type',routes.life.delUploadActivity_image);
	app.get('/delUpload_Pgc_image_desc/:_id/:imageName/:_type',routes.life.delUpload_Pgc_image_desc);
	app.get('/delUpload_News_cms_image_desc/:_id/:imageName/:_type',routes.life.delUpload_News_cms_image_desc);
	app.get('/setCoverImgLife/:_id/:imageName/:_type', routes.life.setCoverImgLife);

	//task
	app.get('/task/:taskId', routes.task.getTask);
	app.del('/task/:taskId', routes.task.removeTask);
	app.put('/task/:taskId', routes.task.updateTask);
	app.post('/task', routes.task.addNewTask);
	app.get('/tasks/:pageLimit/:pageIndex?', routes.task.getTaskByPage);
	app.get('/getMyToDoTasks', routes.task.getMyToDoTasks);
	app.get('/statistic/:taskId',routes.task.statistic);
	app.get('/getAllTasks/:pageLimit/:pageIndex?', routes.task.getAllTasksByPage);

	//auditing
	app.get('/auditing/:auditingId', routes.task.getAuditing);
	app.del('/auditing/:auditingId', routes.task.removeAuditing);
	app.put('/auditing/:auditingId', routes.task.updateAuditing);
	app.post('/auditing', routes.task.addNewAuditing);
	app.get('/auditings/:pageLimit/:pageIndex?', routes.task.getAuditingByPage);
	app.get('/askApproval/:auditingId',routes.task.askApproval);
	app.get('/getApprovalAuditings/:taskId',routes.task.getApprovalAuditings);
	app.post('/approvalAuditings',routes.task.approvalAuditings);

	app.post('/savetoauditing',routes.auditing.addAuditTask);
	app.post('/passthiscity/',routes.auditing.updateAuditTask);
	app.post('/passthiscityitem/',routes.auditing.updatecityitemAuditTask);
	app.get('/getedithistory', routes.auditing.getedithistory);
	app.get('/getaudithistory', routes.auditing.getaudithistory);
	//taskquestion
	app.get('/taskquestion/:taskquestionId', routes.task.getTaskquestion);
	app.del('/taskquestion/:taskquestionId', routes.task.removeTaskquestion);
	app.put('/taskquestion/:taskquestionId', routes.task.updateTaskquestion);
	app.post('/taskquestion', routes.task.addNewTaskquestion);
	app.get('/taskquestions/:pageLimit/:pageIndex?', routes.task.getTaskquestionByPage);
	app.get('/closeTaskquestion/:taskquestionId', routes.task.closeTaskquestion);

	app.get('/dataImport?',routes.dataImport.importCity);
	app.get('/importLifeData?',routes.lifeImport.importLifeData);
	app.get('/getTopCategoryByCity/:cityname',routes.lifeImport.getTopCategoryByCity);
	app.get('/getMichilin',routes.lifeImport.getMichilin);
	// app.get('/importCategoryRestaurantData?',routes.lifeImport.importCategoryRestaurantData);
	// app.get('/importCategoryShoppingData?',routes.lifeImport.importCategoryShoppingData);
	// app.get('/saveRestaurantCategory?',routes.lifeImport.saveRestaurantCategory);

	app.get('/saveSpotToText?',routes.pathImport.saveSpotToText);
	app.get('/importPathToDB?',routes.pathImport.importPathToDB);
	app.get('/importPathToDBSync',routes.pathImport.importPathToDBSync);
	app.get('/runFillTaskQueen',routes.pathImport.runFillTaskQueen);
	app.get('/autoreload',routes.pathImport.autoReloadPage);

	app.get('/showeditors', routes.editUser.showEditors);
	app.get('/geteditors', routes.editUser.getEditors)
	
	app.get('/geteditors', routes.editUser.getEditors);

	app.get('/test', routes.spider.test);
	//google数据抓
	global.javaService="203.88.174.39:8080";


};

routes.lifeImport.initCategoryData();