var loggedinFlag=false;
var request=new XMLHttpRequest();
request.onreadystatechange=function()
{
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200)
        {   
            loggedinFlag=true;
        }else{
            loggedinFlag=false;
        }
    }
};
request.open('GET','http://vidhiyakar.imad.hasura-app.io/checklogin',true);
request.send(null);
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
function fetchComments(){
    var commentsElement = document.getElementById("comments");
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status ===200){
                commentsElement.innerHTML = request.responseText.toString();
            }
        }
    };
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/getcomments',true);
    request.send(null);
}
function addComment(){
    if(loggedinFlag === true){
        var commentElement=document.getElementById('commenttext');
        var commentText=commentElement.value.toString();
        var request=new XMLHttpRequest();
        request.onreadystatechange=function()
        {
            if(request.readyState===XMLHttpRequest.DONE)
            {
                if(request.status===200)
                {
                    fetchComments();
                    commentElement.value="";
                }else{
                    alert('Comment failed.. Please login to comment..');
                }
            }
        };
        request.open('GET','http://vidhiyakar.imad.hasura-app.io/addcomments/'+commentText,true);
        request.send(null);
    }else{
        alert('Please Login to comment');
    }
}
function addArticles(){
  var title = document.getElementById('title').value.toString();
  var content = document.getElementById('content').value.toString();
  var date = new Date();
  var datestring=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(); 
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