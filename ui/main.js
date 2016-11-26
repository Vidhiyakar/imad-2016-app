var loginformHtml = "<b>Login</b><br>Username : <input type='text' id='username'/><br>Password : <input type='password' id='password'/><br><br><input type='submit' value='Log In' id='login' /> &nbsp;&nbsp; <input type='submit' value='Sign Up' id='signup'/>";

var loginformHtml2= "<br><input type='button' value='Log out' id='logout' onclick='logoutFunction()'/>";
var counterElement = document.getElementById('counter');
var loginform = document.getElementById('loginform');
var request1=new XMLHttpRequest();
request1.onreadystatechange=function()
{
        if(request1.status === 403)
        {
            loginform.innerHTML = loginformHtml;
            signupSetup();
            loginSetup();
        }else if(request1.status ===200){
            loginform.innerHTML = request1.responseText.toString()+loginformHtml2;
        }
};
request1.open('GET','http://vidhiyakar.imad.hasura-app.io/checklogin',true);
request1.send(null);

var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200)
        {
            var counter=request.responseText;
            counterElement.innerHTML=counter.toString();
        }
    }
};
request.open('GET','http://vidhiyakar.imad.hasura-app.io/pagevisited',true);
request.send(null);

function logoutFunction(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                loginform.innerHTML = loginformHtml;
                signupSetup();
                loginSetup();
            }
        }
    };
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/logout',true);
    request.send(null);
}

function signupSetup(){
var signup = document.getElementById('signup');
signup.onclick= function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {        
            if(request.status===200)
            {    
                alert(''+request.responseText.toString());
                var usernameElement = document.getElementById('username');
                var passwordElement = document.getElementById('password');
                usernameElement.value='';
                paasswordElement.value='';
            }else{
                alert('Username not available');
            }
        }}
    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/signupuser/'+(username+'$'+password),true);
    request.send(null);
}
}

function loginSetup(){
var login = document.getElementById('login');
login.onclick= function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {        
            if(request.status===200)
            {    
                loginform.innerHTML=request.responseText.toString()+loginformHtml2;
            }else if(request.status === 403){
                var message = request.responseText.toString();
                if(message === "No user found"){
                    document.getElementById('username').value="";
                    document.getElementById('password').value="";
                }else if(message === "Wrong Password"){
                    document.getElementById('password').value="";
                }
                alert(""+request.responseText.toString());
            }else{
                alert('Sorry.. Something went wrong');
            }
        }}
    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/login/'+(username+'$'+password),true);
    request.send(null);
}
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
