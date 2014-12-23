'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3/:id_penerbangan/:email', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])

.controller('View3Ctrl', function($scope, $rootScope, $location, $http, $routeParams) {
	$scope.id_penerbangan = $routeParams.id_penerbagnan;
	$scope.email = $routeParams.email;
	$scope.dataPenumpang = '';
	$scope.dataPenerbangan = '';
	$http.post('http://localhost:3000/reservation/new', {
  		id_penerbangan: $scope.id_penerbangan,
		email: $scope.email
	  	})
	  	.success(function(data) {
	  		console.log(data);
	  		$scope.dataPenumpang = data[data.length-1];
  	});
	$http.post('http://localhost:3000/schedule/id', {
  		id_penerbangan: $scope.id_penerbangan
	  	})
	  	.success(function(data) {
	  		console.log(data);
	  		$scope.dataPenerbangan = data[data.length-1];
  		});
});