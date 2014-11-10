var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider
		.when('/accounting/journal', {
			controller: 'JECtrl',
			templateUrl: '../views/journal.html'
		})
		.when('/accounting/accountMaintenance', {
			controller: 'AMCtrl',
			templateUrl: '../views/accountMaintenance.html'
		})
		.when('/reports/detail', {
			controller:'controller',
			templateUrl: '../views/detail.html'
		})
		.when('/reports/PL', {
			controller:'controller',
			templateUrl: '../views/PL.html'
		})
		.otherwise({redirectTo:'/'});
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
			$('#rtab').attr('clicked','no');
				$('.rNav').animate({
					left: '-60px'
				},200);
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

		$('#rtab').click(function(){
			$('#atab').attr('clicked','no');
				$('.aNav').animate({
					left: '-60px'
				},200);
			if($(this).attr('clicked') !== 'yes') {
				$(this).attr('clicked','yes');
				$('.rNav').animate({
					left: '15px'
				},500);
			} else {
				$(this).attr('clicked','no');
				$('.rNav').animate({
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



app.factory('accountingService', function(){
	var factory = {};
	factory.transactions=[{
		glDate: '11/01/2014',
		glCode: '2100',
		glDesc: 'Accounts Payable',
		debit: 21434.96,
		credit: null,
		desc: 'Check Run'
	},{
		glDate: '11/01/2014',
		glCode: '1100',
		glDesc: 'Cash',
		debit: null,
		credit: 21434.96,
		desc: 'Check Run'
	},{
		glDate: '11/01/2014',
		glCode: '2100',
		glDesc: 'Accounts Payable',
		debit: null,
		credit: 543,
		desc: 'COGS'
	},{
		glDate: '11/01/2014',
		glCode: '5000',
		glDesc: 'Cost of Goods',
		debit: 543,
		credit: null,
		desc: 'COGS'
	}];

	factory.gls=[{
		code: '1100',
		desc: 'Cash',
		type: 'Asset'
	},{code: '2100',
		desc: 'Accounts Payable',
		type: 'Liability'
	},{code: '3100',
		desc: 'Contributions',
		type: 'Equity'
	},{code: '4000',
		desc: 'Revenue',
		type: 'Income'
	},{code: '5000',
		desc: 'Cost of Goods',
		type: 'Expense'
	}];

	factory.searchGL = function(query){
		var result = _.find(this.gls, function(gl){return query === gl.code});
		return result;
	}

	factory.addJE = function(JEs){
		_.each(JEs, function(JE,i){
			factory.transactions.push(JE);
		})
	}

	return factory;

})

app.controller('AMCtrl', function($scope, accountingService){
	$scope.gls = accountingService.gls;
	$scope.transactions = accountingService.transactions;
	$scope.searchGL = accountingService.searchGL;

	$scope.searchResults = function(){
		var gl = $scope.searchGL($scope.glCode);
		if(gl){
			$scope.glDesc = gl.desc;
			$scope.glType = gl.type;
		}
	};

	$scope.submitGL = function(){
		var gl = {
			code: $scope.glCode,
			desc: $scope.glDesc,
			type: $scope.glType
		}
		var index;
		var existing = _.find($scope.gls, function(glAccount, i){
			if( glAccount.code === gl.code){
				index = i;
			}
			return glAccount.code === gl.code;
		});
		if(!existing){
			$scope.gls.push(gl);
		} else {
			$scope.gls[index] = gl;
		}
		$scope.glCode = null;
		$scope.glDesc = null;
		$scope.glType = null;

		console.log(accountingService.gls)
	};
});

app.directive('amWidget', function(){
	function link(scope,element,attrs){
		
	};
	return {
		restrict: 'EA',
		scope: false,
		templateUrl: '../views/AMWidget.html',
		link: link
	}
})

app.directive('coaWidget', function(){
	function link(scope,element,attrs){
		
	};
	return {
		restrict: 'EA',
		scope: false,
		templateUrl: '../views/COAWidget.html',
		link: link
	}
})

app.controller('JECtrl', function($scope, accountingService){
	$scope.gls = accountingService.gls;
	$scope.transactions = accountingService.transactions;

	$scope.lines = ['0','1'];
	$scope.glDebit = {};
	$scope.glCode = {};
	$scope.glCredit = {};
	$scope.glDesc = {};

	$scope.addJE = accountingService.addJE;
	
	$scope.addTransaction = function(){
		$scope.lines.push($scope.lines.length.toString());
	};

	$scope.emptyLine = function(line){
		if (!$scope.glCode[line] && !$scope.glDebit[line] && !$scope.glCredit[line] && !$scope.glDesc[line]) {
			return true;
		} 
		return false;
	}

	$scope.submit = function(){
		var JEs = [];
		var balance = 0;
		if(!$scope.glDate){
			$scope.message = 'Need Posting Date';
			return;
		}
		_.each($scope.lines, function(x){
			console.log($scope.emptyLine(x));
			if(!$scope.emptyLine(x)){
				JEs.push({
					glDate: $scope.glDate,
					glCode: $scope.glCode[x],
					glDesc: $scope.glDesc[x],
					debit: $scope.glDebit[x] || null,
					credit: $scope.glCredit[x] || null,
					desc: $scope.glDesc[x]
				})
			}

			if(typeof $scope.glDebit[x] === 'number'){
				balance = balance + $scope.glDebit[x];
			} 

			if(typeof $scope.glCredit[x] === 'number'){
				balance = balance - $scope.glCredit[x];
			} 

		})

		console.log(balance);

		if(balance === 0) {
			$scope.addJE(JEs);
			$scope.lines = ['0','1'];
			_.each($scope.lines, function(x){
				$scope.glCode[x] = null;
				$scope.glDesc[x] = null;
				$scope.glDebit[x] = null;
				$scope.glCredit[x] = null;
				$scope.glDesc[x] = null;
			})
		} else {
			$scope.message = 'Out of Balance';
			balance = 0;
			JEs = [];

			return;
		}
	}

	$scope.empty = function(selected, z, zeroed){
		if(selected !== 0 && selected !== null){
			if(zeroed === "Credit"){
				$scope.glCredit[z] = null;
			}
			if (zeroed === "Debit"){
				$scope.glDebit[z] = null;
			}
		}
	}

});

app.directive('jeWidget', function(){
	return {
		restrict: 'EA',
		templateUrl: '../views/JEWidget.html'
	}
})