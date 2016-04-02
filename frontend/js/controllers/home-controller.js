/*global, app, settings*/
app.controller('home-controller', ['$scope', function ($scope){
  $scope.forumActive = settings.forumActive;
}]);
