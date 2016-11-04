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
                var counter=request.responseText;
                counterElement.innerHTML=counter.toString();
            }    
        }};
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/pagevisited',true);
    request.send(null);
}
