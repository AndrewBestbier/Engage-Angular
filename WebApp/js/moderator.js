var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue-grey');
});

app.controller("QuestionsController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore) {
     
    var roomCode = 0;

    angular.element(document).ready(function () {

    roomCode = $cookieStore.get("roomCode");





    var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/questions"));
    $scope.list = list;

    

    var moderationObject = $firebaseObject(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/Moderation"));
    $scope.moderationConstant = moderationObject;

         


           

     $scope.sorter = '-count';

     $scope.navigate = function() {
       window.location.href = 'dashboard.html';
     }

     
     
     $scope.vote = function(item){

      var voted = $cookieStore.get(item.$id);
      var userRef = new Firebase("https://engaged.firebaseio.com/");
      var user = userRef.getAuth();
      

      var ref = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/questions/"+item.$id);
      ref.transaction(function(current_val) {
      current_val['count']++;
      return current_val;
      });

      
      


         

         
        
      
      }


        });




    


    
  }
]);