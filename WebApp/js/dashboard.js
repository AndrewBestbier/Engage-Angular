var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('red');
});

app.controller("DashboardController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore', '$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore, $rootScope) {
     
    


    //Tab 4: Changing the password
    $scope.changePassword = function() {
      var oldPassword = document.getElementById('oldPassword').value;
      var newPassword = document.getElementById('newPassword').value;

    var ref = new Firebase("https://engaged.firebaseio.com/");
    var user = ref.getAuth();
    
    ref.changePassword({
      email       : user.password.email,
      oldPassword : oldPassword,
      newPassword : newPassword
    }, function(error) {
      if (error === null) {
        console.log("Password changed successfully");
      } else {
        console.log("Error changing password:", error);
      }
    });
  }

    
  }
]);