




document.getElementById("moderatorButton").addEventListener("click", function() {
    var roomPassword = document.getElementById('moderatorPassword').value;

    /*
    if(test == ''){
    	alert("Please input a password");
    } else {
    	alert(test);
    } */

    

    // Get a reference to our posts
    var ref = new Firebase("https://engaged.firebaseio.com/ModToRoomMap/"+roomPassword+"/");

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
      result = snapshot.val();

      if(result==null){
      	alert("This room does not exist");
      } else {
      	document.cookie="roomCode=" + snapshot.val().roomCode;
      	window.location.href = 'moderator.html';
      }


    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    }); 


	

	

	

    
});


