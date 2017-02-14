app.controller('Nav', ['$scope', function($scope) {
    $scope.nav = false;
    $scope.openClose = function(e) {
        e.preventDefault();
        $scope.nav =  !$scope.nav;
    }
}]);