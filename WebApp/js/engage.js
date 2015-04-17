var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","angularMoment","ngCookies",'chart.js']);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('orange');
});

app.controller("QuestionsController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore', '$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore, $rootScope) {
     
    var roomCode = 0;

    //Tabs

    $scope.isFabTab = false;

    $scope.hideFab = function(){
      $scope.isFabTab = false;
    }

    $scope.showFab = function(){
      $scope.isFabTab = true;
    }

    angular.element(document).ready(function () {

            roomCode = $cookieStore.get("roomCode");
            roomPassword = $cookieStore.get("roomPassword");

            var moderationObject = $firebaseObject(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/Moderation"));




            //Questions
            $scope.moderationConstant = moderationObject;
            var list = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/questions"));
            $scope.list = list;

            //Polls
            var polls = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/polls"));
            $scope.polls = polls;

            
            


            $scope.viewPoll = function(item)
            {

              $rootScope.pollId = item.$id;

                $mdDialog.show({
                    templateUrl: 'pollDialog.html',
                    controller: pollController  
              })

              
          };

          $scope.showPollDialog = function() {

              $mdDialog.show({
                  templateUrl: 'createPollDialog.html',
                  controller: createPollController  
            })
          }



            function pollController($scope, $mdDialog, $rootScope) {
               var pollxx = $firebaseObject(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/polls/"+$rootScope.pollId));
             
               var counter = 0; //After the second time, watch is called
               pollxx.$bindTo($scope, "datax").then(function() {
                 
                 $scope.pollQuestion = $scope.datax.Question;
                 $scope.labels = [$scope.datax.option1, $scope.datax.option2, $scope.datax.option3, $scope.datax.option4];
                 $scope.data = [$scope.datax.option1Value, $scope.datax.option2Value, $scope.datax.option3Value, $scope.datax.option4Value ];

               });

               var unwatch = pollxx.$watch(function() {
                if(counter>0){
                  $scope.labels = [$scope.datax.option1, $scope.datax.option2, $scope.datax.option3, $scope.datax.option4];
                 $scope.data = [$scope.datax.option1Value, $scope.datax.option2Value, $scope.datax.option3Value, $scope.datax.option4Value ];
                }
                counter +=1;
                 
               });
    
            } 

            function createPollController($scope, $mdDialog, $rootScope) {
                  $scope.createPoll = function(pollQuestion,pollAnswer1,pollAnswer2,pollAnswer3,pollAnswer4) {
                  
                  var poll = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/polls"));
                  poll.$add({Question: pollQuestion, option1: pollAnswer1, option1Value: 0, option2: pollAnswer2, option2Value: 0,option3: pollAnswer3, option3Value: 0, option4: pollAnswer4, option4Value: 0  });

                  $mdDialog.hide();
            } 
          }





            //////
            var date = new Date();

            var milliSeconds = date.getTime();

            $mdDialog.show({
               templateUrl: 'optionsDialog.html',
               controller: DialogController
             });

            $scope.navigate = function() {
              window.location.href = 'dashboard.html';
            }

            

           $scope.showOptionsDialog = function() {
              $mdDialog.show({
                 templateUrl: 'optionsDialog.html',
                 controller: DialogController
               });
           }

           $rootScope.sorter = '-count';

           

           



           function DialogController($scope, $mdDialog, $rootScope) {
             
             //Poll Related
             $scope.pollQuestion = $rootScope.pollQuestion;


             

            

            

            



             
             



             //Question Related
             $scope.roomCode = roomCode;

             $scope.roomPassword =roomPassword;



             $scope.moderation =moderationObject;

             

             $scope.clearQuestion = function()
             {
            

              

              var questionsRef = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode +"/questions");

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