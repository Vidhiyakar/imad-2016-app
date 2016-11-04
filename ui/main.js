function setPageVisits(){
    var counterElement = document.getElementById('counter');
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status===200)
            {
                var counter =request.responseText;
                var span=document.getElementById('count');
                counterElement.innerHTML=counter.toString();
            }
        }
    };
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/pagevisited',true);
    request.send(null);

}
setPageVisites();