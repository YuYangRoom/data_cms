$(document).ready(function(){
	var app = angular.module("editors", ['ngRoute']);
	app.config(function ($routeProvider) {
		$routeProvider
			.when('/geteditors', {
				
				controller: 'EditorListCtrl'
			})
	})
	
	app.controller("EditorListCtrl", function($scope, $http){
		$http.get('/geteditors').success(function(data) {
			console.log(data);
			$scope.chineseeditors = data.chineseeditors;
		})
	})
})