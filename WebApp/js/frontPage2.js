document.getElementById("createAccount").addEventListener("click", function() {
    var email = document.getElementById('registerEmail').value;
    var password = ((1<<24)*Math.random()|0).toString(16)

    var ref = new Firebase("https://engaged.firebaseio.com/");
    ref.createUser({
      email    : email,
      password : password
    }, function(error, userData) {
      if (error) {
        alert("There was an error creating your account, please try again"+error);
      } else {
        ref.resetPassword({
            email : email
          }, function(error) {
          if (error === null) {
            console.log("Password reset email sent successfully");
          } else {
            console.log("Error sending password reset email:", error);
          }
        });
      }
    });
    
    
});


document.getElementById("loginButton").addEventListener("click", function() {

    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    var ref = new Firebase("https://engaged.firebaseio.com");
    ref.authWithPassword({
      email    : email,
      password : password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        window.location.href = 'dashboard.html';
        document.cookie="userEmail=" + email;
      }
    });
});

