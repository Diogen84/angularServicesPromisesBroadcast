app.controller('ListItem', ['$scope','$rootScope', 'data', 'eventService', function($scope, $rootScope, data, eventService) {
    $scope.item = data;
    var item = $scope.item;
    var items = [];
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
    eventService.broadcast(items);
}]);