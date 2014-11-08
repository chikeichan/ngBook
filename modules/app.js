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

var transactions=[{
	glCode: '2100',
	glDesc: 'Accounts Payable',
	debit: 21434.96,
	credit: null,
	desc: 'Check Run'
},{
	glCode: '1100',
	glDesc: 'Cash',
	debit: null,
	credit: 21434.96,
	desc: 'Check Run'
},{
	glCode: '2100',
	glDesc: 'Accounts Payable',
	debit: null,
	credit: 543,
	desc: 'COGS'
},{
	glCode: '5000',
	glDesc: 'Cost of Goods',
	debit: 543,
	credit: null,
	desc: 'COGS'
}];
var gls=[{code: '1100',
					desc: 'Cash',
					type: 'Asset'},
					{code: '2100',
					desc: 'Accounts Payable',
					type: 'Liability'},
					{code: '3100',
					desc: 'Contributions',
					type: 'Equity'},
					{code: '4000',
					desc: 'Revenue',
					type: 'Income'},
					{code: '5000',
					desc: 'Cost of Goods',
					type: 'Expense'}];

app.controller('controller', function($scope){
	$scope.transactions = transactions;
	$scope.gls = gls;

	$scope.addTransaction = function(){
		var offBalance = $scope.debit+$scope.debit2-$scope.credit-$scope.credit2;
		if(offBalance) {
			$scope.message = 'The JE is off-balanced!';
			return;
		}

		var transaction = {
			glCode: parseInt($scope.glCode),
			glDesc: _.find(gls, function(gl){return gl.code === $scope.glCode;}).desc,
			debit: $scope.debit,
			credit: $scope.credit,
			desc: $scope.desc,
		}
		transactions.push(transaction);

		var transaction = {
			glCode: parseInt($scope.glCode2),
			glDesc: _.find(gls, function(gl){return gl.code === $scope.glCode2;}).desc,
			debit: $scope.debit2,
			credit: $scope.credit2,
			desc: $scope.desc2
		}
		transactions.push(transaction);

		$scope.glCode = null;
		$scope.debit = null;
		$scope.credit = null;
		$scope.desc = null;
		$scope.glCode2 = null;
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

	$scope.submitGL = function(){
		var gl = {
			code: $scope.glCode,
			desc: $scope.glDesc,
			type: $scope.glType
		}
		var index;

		var existing = _.find(gls, function(glAccount, i){
			if( glAccount.code === gl.code){
				index = i;
			}
			return glAccount.code === gl.code;
		});

		if(!existing){
			gls.push(gl);
			console.log(gls);
		} else {
			gls[index] = gl;
		}

		$scope.glCode = null;
		$scope.glDesc = null;
		$scope.glType = null;

	}

	$scope.searchGL = function(){
		var query = $scope.glCode;
		var gl = _.find(gls, function(gl){
			return gl.code === query;
		});
		if(gl){
			$scope.glDesc = gl.desc;
			$scope.glType = gl.type;
		} else {
			$scope.glDesc = null;
			$scope.glType = null;
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