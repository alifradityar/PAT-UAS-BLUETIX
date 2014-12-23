'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2/:id_penerbangan', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', function($scope, $rootScope, $location, $http, $routeParams) {
	var paramValue = $routeParams.id_penerbangan;
	$scope.id_penerbangan = paramValue;
	$scope.nama = '';
	$scope.email = '';
	$scope.hp = '';
	$scope.seat = '';
	$scope.bagasi = '';
	$scope.cemilan = '';
	$scope.permintaan = '';
	console.log($scope.id_penerbangan);
	$scope.confirm = function(){
		$http.post('http://localhost:3000/reservation/new', {
	  		id_penerbangan: $scope.id_penerbangan,
			nama: $scope.nama,
			email: $scope.email,
			hp: $scope.hp,
			seat: $scope.seat,
			bagasi: $scope.bagasi,
			cemilan: $scope.cemilan,
			permintaan: $scope.permintaan
	  	})
	  	.success(function(data) {
	  		console.log(data);
	  		$location.path('view3/' + $scope.id_penerbangan + '/' + $scope.email);
	  	});
	};
});