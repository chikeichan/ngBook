var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/accounting/journal', {
			controller: 'controller',
			templateUrl: '../views/journal.html'
		})
		.when('/reports', {
			controller:'controller',
			templateUrl: '../views/reportView.html'
		})
		.otherwise({redirectTo:'/'});
});

var transactions=[];

app.controller('controller', function($scope){
	$scope.transactions = transactions;
	$scope.addTransaction = function(){
		var transaction = {
				gl: $scope.gl,
				debit: $scope.debit,
				credit: $scope.credit,
				desc: $scope.desc,

				gl2: $scope.gl2,
				debit2: $scope.debit2,
				credit2: $scope.credit2,
				desc2: $scope.desc2
			}
			transactions.push(transaction);
		};
		

});