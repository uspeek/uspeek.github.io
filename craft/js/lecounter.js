var curr=null;
var curs=null;
var clicks=[];
var sections=[];

setText = function(id,write=true){
  if(curr!=id){
    $("#m"+curr).removeClass("mcurr");
    $("#"+curr).removeClass("active show");
    $("#"+id).addClass("active show");
    curr = id;
    if(write==true){
      clicks.push(id);
      localStorage.setItem("clicks",JSON.stringify(clicks));
    }
  }
}

setSection = function(id,write=true){
  if(curr!=id){
    $("#m"+curs).removeClass("active");
    $("#m"+id).addClass("active");
    setText(id,write);
    if(write==true){
      sections.push(id);
      localStorage.setItem("sections",JSON.stringify(sections));
    }
    curs=id;
  }
}
setSub = function(id){
  if(curr!=id){
    $("#m"+id).addClass("mcurr");
    setText(id);
  }
}

$("#themenew div ul a").click(function(){
  setSection($(this).data('link'));
});
$("#questions a").click(function(){setSub($(this).data('link'));});
$("#vozres a").click(function(){setSub($(this).data('link'));});

function send(newstatus){
  $('#cmmnt').val('');
  $('#cmmnt').prop('disabled', true);
  $.ajax({
    type: "POST",
    url: "/task.php",
    data: {
      task_id: $("#taskid").html(),
      status: newstatus,
      clicks: JSON.stringify(clicks),
      comment: $('#cmmnt').val()
    },
    dataType: 'text',
    success: function(data){
      if(data == 'success'){
        localStorage.removeItem("clicks");
        localStorage.removeItem("sections");
        location.reload();
      }else{
        if ($('#alert').length==0){
          $('body').append('<div id="alert" class="alert alert-danger alert-dismissible fade show" role="alert">\
            <span id="alertxt">'+ data +'</span>\
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
              <span aria-hidden="true">&times;</span>\
            </button>\
          </div>');
        }
      }
    }
  });
}



$("#stuttons button").click(function(){
  if($(this).data("status")==7 && $("#cmmnt").is(':disabled')){
    $("#cmmnt").prop('disabled',false);
  }else{
    if($(this).data("status")!=7){
      $("#cmmnt").prop('disabled',true);
      $("#cmmnt").val('');
    }
    if(($(this).data("status")==7 && $('#cmmnt').val().length>0)||$(this).data("status")!=7){
      //if(($(this).data("status")!=7&&comment!=null)||($(this).data("status")==7&&comment!=null)){
        if($(this).data("status")==7){var comment = " ("+$("#cmmnt").val()+")";}else{var comment = "";}
        if(confirm("Подтвердите статус задания: " + $(this).html() + comment)){
          $.ajax({
            type: "POST",
            url: "/task.php",
            data: {
              task_id: $("#taskid").html(),
              status: $(this).data("status"),
              clicks: JSON.stringify(clicks),
              comment: $('#cmmnt').val()
            },
            dataType: 'text',
            success: function(data){
              if(data == 'success'){
                localStorage.removeItem("clicks");
                localStorage.removeItem("sections");
                location.reload();
              }else{
                if ($('#alert').length==0){
                  $('body').append('<div id="alert" class="alert alert-danger alert-dismissible fade show" role="alert">\
                    <span id="alertxt">'+ data +'</span>\
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">\
                      <span aria-hidden="true">&times;</span>\
                    </button>\
                  </div>');
                }
              }
            }
          });
        }
      //}
    }else{
      if($(this).data("status")==7 && $('#cmmnt').val().length==0){
        alert('Введите комментарий');
      }
    }
  }
});

$(function(){
  if(localStorage.getItem("clicks") && localStorage.getItem("sections")){
    clicks=JSON.parse(localStorage.getItem("clicks"));
    sections=JSON.parse(localStorage.getItem("sections"));
    setSection(sections[sections.length-1],false);
  }else{
    localStorage.removeItem("clicks");
    localStorage.removeItem("sections");
    setSection("cat1id1");
  }
  $("#cmmnt").prop('disabled',true);
  $("#cmmnt").val('');
});
