var app = angular.module("Andrew", ["firebase","ngMaterial","ngAnimate","ngCookies"]);
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('blue-grey');
});

app.controller("DashboardController", ["$scope", "$firebaseArray","$firebaseObject", "$mdToast","$mdDialog", '$cookieStore', '$rootScope',
  function($scope, $firebaseArray,$firebaseObject,$mdToast,$mdDialog,$cookieStore, $rootScope) {
     
    var ref = new Firebase("https://engaged.firebaseio.com/");
    var user = ref.getAuth();

    $scope.selectedIndex = 0;

    $scope.navigate = function() {
      window.location.href = 'index.html';
    }
    
    //Tab 1 Joining another room

    var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/joinList"));
    $scope.joinList = joinList;

    $scope.joinRoom = function(item)
    {
      $cookieStore.put("studentRoomCode", item.roomCode);
      window.location.href = 'student.html'; 
    }

    //Tab 2: Creating a room
    var createList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/createList"));
    $scope.createList = createList;


    $scope.joinCreateRoom = function(item)
    {
      $cookieStore.put("roomCode", item.roomCode);
      $cookieStore.put("roomPassword", item.roomPassword);
      window.location.href = 'lecturer.html';
    }

    //Tab 3: Moderating a room
    var modList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/modList"));
    $scope.modList = modList;

    $scope.joinModRoom = function(item)
    {
      $cookieStore.put("roomCode", item.roomCode);
      $cookieStore.put("roomPassword", item.roomPassword);
      window.location.href = 'moderator.html';
    }


    $scope.isFabTab = true;

    $scope.hideFab = function(){
      $scope.isFabTab = false;
    }

    $scope.showFab = function(){
      $scope.isFabTab = true;
    }

    if (document.getElementsByTagName('body')[0] !== undefined) {
                console.log("done");
            }


    $scope.showDashboardDialog = function() 
    {
      selectedIndex = $scope.selectedIndex;

      if(selectedIndex == 0)
      {
        //Join a room
        $mdDialog.show({
           templateUrl: 'joinRoomDialog.html',
           controller: DialogController
         });

      }
      else if (selectedIndex == 1)
      {
        //Create a room
        $mdDialog.show({
           templateUrl: 'createRoomDialog.html',
           controller: DialogController
         });
      } else if (selectedIndex ==2)
      {
        //Moderation
        //Create a room
        $mdDialog.show({
           templateUrl: 'moderateRoomDialog.html',
           controller: DialogController
         });
      }

      
    }

    function DialogController($scope, $mdDialog, $rootScope) 
    {
        $scope.create = function(roomName)
        {
          //Link room to user name
          var createList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/createList"));
          roomCode = Math.floor(Math.random() * 1000000) + 1;
          roomPassword = Math.floor(Math.random() * 1000000) + 1;
          createList.$add({roomName: roomName, roomCode : roomCode, roomPassword : roomPassword});
          
          //Link room to database
          var roomRef = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode);
          var obj = $firebaseObject(roomRef);
          obj.roomName = roomName;
          obj.$save();

          var roomModRef = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode +"/Moderation");
          var obj = $firebaseObject(roomModRef);
          obj.moderationConstant = 0;
          obj.moderationBoolean= false;
          obj.$save();

          //Link room to moderation
          moderatorFirebaseRef = new Firebase("https://engaged.firebaseio.com/ModToRoomMap/"+roomPassword+"/");
          var obj = $firebaseObject(moderatorFirebaseRef);
          obj.roomCode = roomCode;
          obj.roomName = roomName;
          obj.$save()

          //Close the dialog
          $mdDialog.hide();
        }

        $scope.moderate = function(roomPassword)
        {
          if(roomPassword == '')
          {
            alert("Please input a password");
          }
          else 
          {
            var ref = new Firebase("https://engaged.firebaseio.com/ModToRoomMap/"+roomPassword+"/");

            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function(snapshot) {
              result = snapshot.val();

              if(result==null){
                alert("This room does not exist");
              } else {
                roomCode = snapshot.val().roomCode;
                roomName = snapshot.val().roomName;

                var modList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/modList"));
                modList.$add({roomName: roomName, roomCode : roomCode});
                //Close the dialog
                $mdDialog.hide();
              }


            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            }); 
          }
        }

        $scope.join = function (roomCode)
        {
          if(roomCode == ''){
            alert("Please input a room code");
          } else {
            // Get a reference to our posts
            var ref = new Firebase("https://engaged.firebaseio.com/rooms/"+roomCode+"/");

            // Attach an asynchronous callback to read the data at our posts reference
            ref.on("value", function(snapshot) {
              result = snapshot.val();

              if(result==null){
                alert("This room does not exist");
              } else {
                var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/"+user.uid+"/joinList"));
                joinList.$add({roomName: snapshot.val().roomName, roomCode : roomCode});
                //Close the dialog
                $mdDialog.hide();
              }


            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            }); 
          }  
        }

        $scope.hide = function()
        {
          //Link room to user name
          //Link room to database
          //Close the dialog
          $mdDialog.hide();
        }
    }

    //Tab 3: Moderating a room



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
          alert("Password changed successfully");
        } else {
          alert("Error changing password:", error);
        }
      });
  }

    
  }
]);