angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


.controller('JoinedRooms', function($scope,$firebaseArray) {
  var joinList = $firebaseArray(new Firebase("https://engaged.firebaseio.com/users/simplelogin:5/joinList"));
  $scope.joinList = joinList;
})

.controller('JoinedRoom', function($scope,$firebaseArray) {
  var questions = $firebaseArray(new Firebase("https://engaged.firebaseio.com/rooms/58829/questions"));
  $scope.questions = questions;
})
