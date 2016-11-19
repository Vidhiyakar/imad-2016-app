var addArticles=function(){
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
            window.alert('Post successfull');
        }
    }
  };
  request.open('GET','http://vidhiyakar.imad.hasura-app.io/blogit/'+title+"/"+content+"/"+datestring,true);
  request.send(null);
};
var blogbutton= document.getElementById('blog');
blogbutton.addEventListener('click',addArticles);