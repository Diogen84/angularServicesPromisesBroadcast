app.controller('List', ['$scope', '$http', '$location',  'data', 'dataOutput', 'eventService', function($scope, $http, $location, data, dataOutput, eventService) {
    $scope.data = data;

    var items = [];
    angular.forEach($scope.data, function(item) {
        if(item.notification !== undefined) {
            var itemArguments = {
                "detail" : {
                    "category": item.notification.category,
                    "title": item.notification.title,
                    "body": item.notification.body
                }
            };
            items.push(itemArguments);
        }
    });

    eventService.broadcast(items);

    $scope.openArticle = function(id, e) {
        e.preventDefault();
        $location.path('/data/' + id);
    };
}]);