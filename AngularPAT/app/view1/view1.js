'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1/', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',function($scope, $rootScope, $location, $http) {
  $scope.dataBandara = [];
  $scope.stringBandara = [];
  $scope.asal = '';
  $scope.tgl  = '';
  $scope.tujuan  = '';
  $scope.resultCount = 0;
  $scope.searchResult = [];

  $scope.search = function(){
  	console.log($scope.asal);
  	$http.post('http://localhost:3000/schedule/find', {
  		keberangkatan:$scope.dataBandara[$scope.asal.id].kode,
  		kedatangan:$scope.dataBandara[$scope.tujuan.id].kode,
  		tgl_berangkat:$scope.tgl
  	})
  	.success(function(data) {
  		$scope.searchResult = data;
  		$scope.resultCount = data.length;
  		console.log(data);
  	});
  }

  $scope.select = function(selected){
  	console.log(selected);
  	$location.path('view2/' + selected);
  }

  $http.get('http://localhost:3000/bandara/all').success(function(data) {
  	$scope.dataBandara = data.bandara;
  	for (var i=0;i<$scope.dataBandara.length;i++){
  		var newData =  {
	  	  	id: i,
	  	  	name: $scope.dataBandara[i].name + ' (' + $scope.dataBandara[i].kode + ')'
  	  	}
      	$scope.stringBandara.push(newData);
  	}
  	console.log($scope.stringBandara);
  });

});