app.controller('Form', ['$scope', 'eventService', function($scope, eventService) {
    $scope.notification = {};
    $scope.notification.detail = {};

    $scope.invokeNotification = function(e) {
        e.preventDefault();

        eventService.broadcast([$scope.notification]);
    };
}]);