/*global app, DATA*/
app.controller('cv-controller', ['$scope', function ($scope){
	$scope.schools = DATA.SCHOOLS;
	$scope.uploadFile = function(){
		var file = $scope.myFile;
		console.log('file is ' );
		console.dir(file);
		var uploadUrl = "/fileUpload";
		fileUpload.uploadFileToUrl(file, uploadUrl);
};
}]);
