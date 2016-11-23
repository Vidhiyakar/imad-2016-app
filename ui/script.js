function addArticles(){
  var title = document.getElementById('title').value.toString();
  var content = document.getElementById('content').value.toString();
  var date = new Date();
  var datestring=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate(); 
  var request=new XMLHttpRequest();
  request.onreadystatechange=function()
  {
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200)
        { 
            document.getElementById('title').value="";
            document.getElementById('content').value="";
            window.alert('Post successfull');
        }else{
            window.alert(request.responseText);
        }
    }
  };
  request.open('GET','http://vidhiyakar.imad.hasura-app.io/blogit/'+title+"/"+content+"/"+datestring,true);
  request.send(null);
}