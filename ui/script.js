var loggedinFlag=false;
var request=new XMLHttpRequest();
var loggedinAs="";
var current_article=0;
request.onreadystatechange=function()
{
    if(request.readyState===XMLHttpRequest.DONE)
    {
        if(request.status===200)
        {   
            loggedinFlag=true;
            loggedinAs=request.responseText.toString().substring(13);
        }else{
            loggedinFlag=false;
        }
    }
};
request.open('GET','http://vidhiyakar.imad.hasura-app.io/checklogin',true);
request.send(null);

function updateCommentforArticle(article_id){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if(request.readyState === XMLHttpRequest.DONE){
            if(request.status === 200){
                var jsonstring= JSON.parse(request.responseText.toString());
                var commentTable="<table width='100%'>";
                var count=jsonstring.rows.length;
                for(var i=0;i<count;i++){
                    var comment_row=jsonstring.rows[i];
                    var username = comment_row.username;
                    var comment = comment_row.comment;
                    var date = new Date(comment_row.date.toString()).toDateString();
                    if(loggedinAs === username){
                        username="You";
                    }
                    commentTable+="<tr><td><i>"+username+"</i> on "+date+"</td></tr><tr><td colspan='2'>"+comment+"<hr></td></tr>";
                }
                commentTable+="</table>";
                var commentsection=document.getElementById("article_comments");
                commentsection.innerHTML=commentTable;
            }
        }
    };
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/articlecomment/'+article_id,true);
    request.send(null);
}

function updateArticleView(article_id){
    current_article=article_id;
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status ===200){
                var jsonstring=JSON.parse(request.responseText.toString());
                var article=jsonstring.rows[0];
                var title=article.title, content=article.content,username=article.username,date=new Date(article.date).toDateString();
                if(loggedinAs === username){
                    username = "You";
                }
                document.getElementById("title").innerHTML=title;
                document.getElementById("content").innerHTML=content;
                document.getElementById("whowhen").innerHTML="by <i>"+username+"</i> on "+date;
                updateCommentforArticle(article_id);
            }
        }
    };
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/articlesbyid/'+article_id,true);
    request.send(null);
}

function fetchTimeline(){
    var request=new XMLHttpRequest();
    request.onreadystatechange=function()
    {
        if(request.readyState===XMLHttpRequest.DONE)
        {
            if(request.status ===200){
                var jsonstring=JSON.parse(request.responseText.toString());
                var timelineString="<table width='100%'>";
                var row_count=jsonstring.rows.length;
                for(var i=0;i<row_count;i++){
                    var row=jsonstring.rows[i];
                    var article_id=row.article_id;
                    var username=row.username, title= row.title,date=new Date(row.date);
                    if(loggedinAs==username){
                        username = "You";
                    }
                    var titleString="<span style='cursor:pointer' onclick='updateArticleView("+article_id+")'><u><h3>"+title+"</h3></u></span>";
                    timelineString+="<tr><td>"+titleString+"by <i>"+username+"<i> on "+date.toDateString()+"<hr></td></tr>";
                }
                timelineString+="</table>";
                var timeline=document.getElementById("timeline");
                timeline.innerHTML=timelineString;
                updateArticleView(jsonstring.rows[0].article_id);
            }
        }
    };
    request.open('GET','http://vidhiyakar.imad.hasura-app.io/articles',true);
    request.send(null);
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function commentOnArticle(){
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
                    commentElement.value="";
                    updateCommentforArticle(current_article);
                }else{
                    alert('Comment failed.. Please login to comment..');
                    console.log(''+request.responseText);
                }
            }
        };
        request.open('GET','http://vidhiyakar.imad.hasura-app.io/commentonarticle/'+current_article+"/"+commentText,true);
        request.send(null);
    }else{
        alert('Please Login to comment');
    }
}

function writeArticles(){
  if(loggedinFlag === true){
      var title = document.getElementById('title').value.toString();
      var content = document.getElementById('content').value.toString();
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
                window.location.href="http://vidhiyakar.imad.hasura-app.io/timeline";
            }else{
                window.alert(request.responseText);
            }
        }
      };
      request.open('POST','http://vidhiyakar.imad.hasura-app.io/writearticle',true);
      console.log(title);
      console.log(content);
      request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      request.send(JSON.stringify({"title":title,"content":content}));
  }else{
      window.alert('Please login to Post on my Timeline');
  }
}