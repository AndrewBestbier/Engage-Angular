var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);


app.controller("TestController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore', '$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore, $rootScope) {
     
    var roomCode = 0;

    angular.element(document).ready(function () {

            roomCode = $cookieStore.get("roomCode");

            //For the moderator
            roomPassword = $cookieStore.get("roomPassword");

            if(roomCode == undefined){
              roomCode = Math.floor(Math.random() * 1000000) + 1;
              $cookieStore.put("roomCode", roomCode);

              //For the moderator
              roomPassword = Math.floor(Math.random() * 1000000) + 1;
              $cookieStore.put("roomPassword", roomPassword);

              moderatorFirebaseRef = new Firebase("https://engaged.firebaseio.com/ModToRoomMap/"+roomPassword+"/");

              var obj = $firebaseObject(moderatorFirebaseRef);
              obj.roomCode = roomCode;
              obj.$save()

            }

            var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/"+roomCode));

            $scope.list = list;



            var date = new Date();

            var milliSeconds = date.getTime();

            $mdDialog.show({
               templateUrl: 'optionsDialog.html',
               controller: DialogController
             });



     
    




           

           $scope.showOptionsDialog = function() {
              

              $mdDialog.show({
                 templateUrl: 'optionsDialog.html',
                 controller: DialogController
               });
           }

           $rootScope.sorter = '-count';
           $rootScope.modvalue = 0;

           



            


           function DialogController($scope, $mdDialog, $rootScope) {
             
             $scope.roomCode = roomCode;

             $scope.roomPassword =roomPassword;

             

             $scope.onSortChange = function(cbState){
               
               

               if(cbState)
               {
                $rootScope.sorter = '-time';
               }
               else 
               {
                $rootScope.sorter = '-count';
               }

               };


             $scope.onModChange = function(cbState){
               
               

               if(cbState)
               {
                $rootScope.modvalue = -1;
               }
               else 
               {
                $rootScope.modvalue = 0;
               }

               };



             

             $scope.hide = function() {
               $mdDialog.hide();
             };
             $scope.cancel = function() {
               $mdDialog.cancel();
             };
             $scope.ask = function(answer) {
               $mdDialog.hide(answer);
             }};

     $scope.vote = function(item){

      var voted = $cookieStore.get(item.$id);
      $mdToast.showSimple('You cannot vote on questions');

      
      }


        });




    


    
  }
]);