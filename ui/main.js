var loginformHtml = '<b>Login</b><br>\
Username : <input type="text" id="username"/><br>\
Password : <input type="password" id="password"/><br>\
<input type="submit" value="Log In" id="login"/>\
';

var loginformHtml1= "Logged in as ";
var loginformHtml2= "<br><input type='button' value='Log out' id='logout' onclick='logout()'/>";
var counterElement = document.getElementById('counter');
var loginform = document.getElementById('loginform');
var request1=new XMLHttpRequest();
request1.onreadystatechange=function()
{
    if(request1.readyState===XMLHttpRequest.DONE)
    {
        if(request1.status===200)
        {
            var resposeString = request.responseText.toString();
            if(responseString === "You are not logged in"){
                console.log('Yes');
            }
        }
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

/*var login = document.getElementById('login');
login.onclick= function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {        
            if(request.status===200)
            {    
                loginform.innerHtml=loginformHtml1+' svidhiyakar '+loginformHtml2;
                var logoutbutton=document.getElementById('logout');
                logout.onclick=logoutFunction();
                
                loginform.innerHtml="senthil";
                alert("Logged in successfully");
            }else if(request.status === 403){
                alert(""+request.responseText.toString());
            }else{
                alert('Sorry.. Something went wrong');
            }
        }}
    var username= document.getElementById('username').value;
    var password= document.getElementById('password').value;
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/login/'+(username+'$'+password),true);
    request.send(null);
}*/

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
