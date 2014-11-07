var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/accounting/journal', {
			controller: 'controller',
			templateUrl: '../views/journal.html'
		})
		.when('/accounting/accountMaintenance', {
			controller: 'controller',
			templateUrl: '../views/accountMaintenance.html'
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
		var offBalance = $scope.debit+$scope.debit2-$scope.credit-$scope.credit2;
		if(offBalance) {
			$scope.message = 'The JE is off-balanced!';
			return;
		}

		var transaction = {
			gl: $scope.gl,
			debit: $scope.debit,
			credit: $scope.credit,
			desc: $scope.desc,
		}
		transactions.push(transaction);

		var transaction = {
			gl: $scope.gl2,
			debit: $scope.debit2,
			credit: $scope.credit2,
			desc: $scope.desc2
		}
		transactions.push(transaction);

		$scope.gl = null;
		$scope.debit = null;
		$scope.credit = null;
		$scope.desc = null;
		$scope.gl2 = null;
		$scope.debit2 = null;
		$scope.credit2 = null;
		$scope.desc2 = null;
		$scope.message = null;

	};

	$scope.zero = function(current,target){
		if($scope[current]){
			$scope[target] = null;
		}
	}

});

app.directive('appHeader', function(){
	function link(scope,element,attrs){
		$('nav.navbar>div.tab').mouseenter(function(){
			$(this).animate({
				top: '0px',
				left: '5px'
			},500);
		});

		$('nav.navbar>div.tab').mouseleave(function(){
			$(this).animate({
				top: '-26px',
				left: '0px'
			},200);
		});

		$('#atab').click(function(){
			if($(this).attr('clicked') !== 'yes') {
				$(this).attr('clicked','yes');
				$('.aNav').animate({
					left: '15px'
				},500);
			} else {
				$(this).attr('clicked','no');
				$('.aNav').animate({
					left: '-60px'
				},200);
			}
		});
	};
	return {
		restrict: 'EA',
		templateUrl: '../views/header.html',
		link: link
	}
})