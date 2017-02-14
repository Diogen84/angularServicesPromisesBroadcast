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