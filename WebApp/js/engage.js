var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies"]);


app.controller("QuestionsController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore', '$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore, $rootScope) {
     
    var roomCode = 0;

    angular.element(document).ready(function () {

            roomCode = $cookieStore.get("roomCode");
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

              var moderatedRef = new Firebase("https://engaged.firebaseio.com/"+roomCode +"/Moderation");

              var obj = $firebaseObject(moderatedRef);
              obj.moderationConstant = 0;
              obj.moderationBoolean= false;
              obj.$save()

            }

            var moderationObject = $firebaseObject(new Firebase("https://engaged.firebaseio.com/"+roomCode+"/Moderation"));



            $scope.moderationConstant = moderationObject;

            var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/"+roomCode+"/questions"));

            
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
           

           function DialogController($scope, $mdDialog, $rootScope) {
             
             

             $scope.roomCode = roomCode;

             $scope.roomPassword =roomPassword;



             $scope.moderation =moderationObject;

             

             $scope.clearQuestion = function()
             {
            

              

              var questionsRef = new Firebase("https://engaged.firebaseio.com/"+roomCode +"/questions");

              questionsRef.remove();
             }

             

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
                moderationObject.moderationConstant = -1;
                moderationObject.moderationBoolean = true;
                moderationObject.$save();

               }
               else 
               {
                $rootScope.modvalue = 0;
                moderationObject.moderationConstant = 0;
                moderationObject.moderationBoolean = false;
                moderationObject.$save();
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