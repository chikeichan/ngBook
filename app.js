var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'controller',
			templateUrl: './accountingView.html'
		})
		.otherwise({redirectTo:'/'});
});

app.controller('controller', function($scope){
	$scope.testing = [1,2,3,4,5];
});