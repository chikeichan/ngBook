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
	$scope.transactions = [];
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
			$scope.transactions.push(transaction);
			console.log($scope.transactions);
		}

});