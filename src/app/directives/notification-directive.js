app.directive('notificationProvider', function(eventService) {
    return {
        restrict : "E",
        replace: true,
        scope: {},
        controller: function($scope, eventService, $rootScope) {
            $scope.itemsToDisplay = 3;
            $scope.itemsAll = [];
            $scope.items = [];

            eventService.listen(function(event, obj) {
                console.log(obj)
                angular.forEach(obj, function(item, i) {
                    $scope.itemsAll.push({"details" : item.detail});
                });
                $scope.updateItemList();
            });

            $scope.updateItemList = function() {
                var itemsLength = $scope.items.length,
                    i = 0;

                if(itemsLength < $scope.itemsToDisplay) {
                    while(i < $scope.itemsToDisplay - itemsLength && i < $scope.itemsAll.length) {
                        $scope.itemsAll.reverse();
                        $scope.items.push($scope.itemsAll.pop());
                        $scope.itemsAll.reverse();
                        i++;
                    }
                }
            };

            $scope.removeElement = function(array, index) {
                array.splice(index, 1);
                $scope.updateItemList();
            };
        },
        template:'<div class="notifications">'+
            '<div notification data-ng-repeat="item in items" data-ng-model="item" data-remove-item="removeElement(items, $index)"></div>' +
        '</div>'
    }
});
app.directive('notification', function($timeout) {
    return {
        restrict: "A",
        scope: {
            model : "=ngModel",
            removeItem:"&"
        },
        link: function(scope, element, attr){
            var category = scope.model.details.category;
            $timeout(function() {
                if(category == 'info') {
                    scope.class += ' hide';
                }
            },89000);
            $timeout(function() {
                if(category == 'info' && !(scope.isManuallyDeleted)) {
                    scope.removeItem();
                }
            }, 90000);
        },
        controller: function($scope) {
            $scope.isManuallyDeleted = false;
            $scope.class = $scope.model.details.category;
            $scope.removeNotification = function() {
                $scope.isManuallyDeleted = true;
                $scope.removeItem();
            };
        },
        template:   '<div class="notification" data-ng-class="class">' +
                        '<div class="header-notification">' +
                            '<h3>{{model.details.title}}</h3>' +
                        '</div>' +
                        '<div class="body-notification">' +
                            '<p>{{model.details.body}}</p>' +
                            '<div class="close-notification"><a href="" data-ng-click="removeNotification()">Close</a></div>' +
                        '</div>' +
                    '</div>'
    }
});