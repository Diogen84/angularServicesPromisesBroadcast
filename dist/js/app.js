var app = angular.module('App', ['ngRoute']);

app.service('dataOutput', ['$http', function($http) {
    this.getAllData = function() {
        var promise = $http.get('./data/testData.json').then(function(response) {
            return response.data;
        });
        return promise;
    };
    this.getItemData = function(id) {
        var promise = $http.get('./data/' + id + '.json').then(function(response) {
            return response.data[0];
        });
        return promise;
    };
}]);

app.service("eventService", ['$rootScope', function($rootScope) {
    this.broadcast = function(data) {
        $rootScope.$broadcast('invokeNotification', data);
    };
    this.listen = function(callback) {
        $rootScope.$on("invokeNotification", callback);
    };
}]);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partial/list.html',
                controller: 'List',
                resolve : {
                    data: ['dataOutput', function(dataOutput) {
                        return dataOutput.getAllData();
                    }]
                }
            })
            .when('/data/:id', {
                templateUrl: 'partial/listItem.html',
                controller: 'ListItem',
                resolve: {
                    data: ['$route', 'dataOutput', function($route, dataOutput) {
                        return dataOutput.getItemData($route.current.params.id)
                    }]
                }
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
app.controller('Form', ['$scope', 'eventService', function($scope, eventService) {
    $scope.notification = {};
    $scope.notification.detail = {};

    $scope.invokeNotification = function(e) {
        e.preventDefault();

        eventService.broadcast([$scope.notification]);
    };
}]);
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
app.controller('Nav', ['$scope', function($scope) {
    $scope.nav = false;
    $scope.openClose = function(e) {
        e.preventDefault();
        $scope.nav =  !$scope.nav;
    }
}]);
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
// ordinary script
function popupInit() {
    var btn = document.querySelectorAll('.btn');
    var popup = document.querySelectorAll('.popup');
    var shadow = document.querySelector('.shadow');
    var close = document.querySelectorAll('.popup .close');

    for(var i = 0 ; i < btn.length; i++) {
        btn[i].onclick = function(x) {
            return function() {
                for(var j = 0; j < popup.length; j++) {
                    if(popup[j].getAttribute('data-modal') === btn[x].getAttribute('data-modal-open')) {
                        shadow.className += ' active';
                        popup[j].className += ' active';
                    }
                }
                return false;
            }
        }(i);
    }
    for(var i = 0 ; i < close.length; i++) {
        close[i].onclick = function(x) {
            return function() {
                shadow.className = 'shadow';
                for(var j = 0; j < popup.length; j++) {
                    popup[j].className = 'popup';
                }
                return false;
            }
        }(i);
    }
}
popupInit();