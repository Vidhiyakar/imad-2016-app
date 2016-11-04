var counterElement = document.getElementById('counter');
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

var login = document.getElementById('login');
login.onclick= function(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function(){
        if(request.readyState===XMLHttpRequest.DONE)
        {        
            if(request.status===200)
            {            
                console.log('success');
                alert("Logged in successfully")
            }else{
                console.log('invalid');
                alert('invalid');
            }
        }};
    var usernameval= document.getElementById('username').value;
    var passwordval= document.getElementById('password').value;
    console.log(usernameval);
    console.log(passwordval);
    request.open('POST','http://vidhiyakar.imad.hasura-app.io/logincheck',true);
    var jsonobject={};
    request.send(JSON.stringify({username:usernameval,password:passwordval}));
}
