var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('red');
});

app.controller("DashboardController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore', '$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore, $rootScope) {
     
    var ref = new Firebase("https://engaged.firebaseio.com/");
    var user = ref.getAuth();
    //Tab 1 Joining another room

    //var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/"+user.password.email+"/joinList"));

    email = user.password.email;
    email = email.replace(/[^a-zA-Z ]/g, "")

    var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+email+"/joinList"));
    //list.$add({roomName: "My first Room", roomCode : 12345});

    $scope.joinList = joinList;


    //Tab 4: Changing the password
    $scope.changePassword = function() {
      var oldPassword = document.getElementById('oldPassword').value;
      var newPassword = document.getElementById('newPassword').value;

    
    
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