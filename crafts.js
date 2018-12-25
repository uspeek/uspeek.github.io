let itemclass={
    "1hm":"One-handed melee",
    "1hr":"One-handed ranged",
    "2hm":"Two-handed melee",
    "2hr":"Two-handed ranged",
    "shield":"Shield",
    "helm":"Helmet",
    "body":"Body armour",
    "gloves":"Gloves",
    "boot":"Boots",
    "ring":"Ring",
    "amulet":"Amulet",
    "belt":"Belt",
    "flask":"Flask",
    "quiver":"Quiver"
}, lcat={
    "prefix":"Prefixes",
    "prefixveil":"Veiled Prefixes",
    "suffix":"Suffixes",
    "suffixveil":"Veiled Suffixes"
},acr=[],cn=0,cf='';



$.each(itemclass,function(k,v){
    $("#classfilter").append('<li class="nav-item filtericon c'+k+'" data-filter="'+k+'" title="'+v+'"></li>');
});

$.getJSON("crafts.json", function(data){
    $.each(data, function(section,crafts){
        let crc=0;
        $.each(crafts, function(cr,att){
            let icons="", template='',tier='',locked='',warning='';
            crc+=1;
            if(att['applies'][0]=="!flasks"){
                $.each(itemclass,function(k,v){
                    if(k!="flask"){
                        icons+="<li class='filtericon c"+v+"' style='display: none;' data-filter='"+v+"' title='"+itemclass[v]+"'></li>";
                    }
                });
                icons+="Everything except Flasks"
            }else{
                $.each(att['applies'],function(k,v){
                    icons+="<li class='filtericon c"+v+"' data-filter='"+v+"' title='"+itemclass[v]+"'></li>";
                });
            }
            if(att['tier']==0){tier='';}else{tier=att['tier'];}
            if(att['locked']==1){locked=' table-warning';warning=' <i>(Will be available soon™)</i>';}
            template='<tr id="'+section+crc+'" class="tbcraft'+locked+'">' +
                '<td>'+att['price'][0]+' <span class="price '+att['price'][1]+'"></span></td>' +
                '<td><span class="rank">'+tier+'</span>'+cr+warning+'</td>'+
                '<td class="applies">'+icons+'</td></tr>';
            acr[cn]={value: section+crc, label: cr.replace("<br/>",". "),category:lcat[section]};
            cn++;
            $("#b"+section).before(template);
        });
    });
});

$("#jumpm a").click(function(){
    let target = $(this).data('scroll');
    $('html, body').animate({
        scrollTop: $('#'+target).offset().top -150
    },500);
});

$("#searchform").click(function (){this.select();}).autocomplete({
    source: acr,
    minLength: 3,
    focus: function(event,ui){
        return false;
    },
    //position: { my: "left bottom", at: "left top", of: "#searchfield"},
    select: function(event,ui) {
        $('html, body').animate({
            scrollTop: $('#' + ui.item.value).offset().top - 150
        }, 500);
        setTimeout(function(){
            $('#' + ui.item.value).animate({backgroundColor:"#d4f0cd"},500).animate({backgroundColor:"none"},500);
        },500);
        $("#searchform").val('');
        return false;
    }
});

$("#qcp").click(function(){
    this.select();
    document.execCommand("copy");
    $(this).tooltip('show');
    setTimeout(function(){
        $("#qcp").tooltip('dispose');
    },3000);
});
$("#ho").click(function(){
    if($(this).hasClass("oi-arrow-thick-bottom")){
        $(this).removeClass("oi-arrow-thick-bottom").addClass("oi-arrow-thick-top");
        $("#hideout").animate({height:"700px"},500);
    }else{
        $(this).removeClass("oi-arrow-thick-top").addClass("oi-arrow-thick-bottom");
        $("#hideout").animate({height:"240px"},500);
    }
});
$('span[data-toggle="tooltip"]').tooltip({
    animated: 'fade',
    placement: 'right',
    html: true,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner" style="background:none;" ></div></div>'
});

function showhide(ic){
    if(cf==ic){
       ic='all';
    }
    cf=ic;
    $.each(itemclass, function(k){
        if(k==ic || ic=='all'){
            $(".c"+k).css("opacity","1");
        }else{
            $(".c"+k).css("opacity",".25");
        }
    });
    $.each(acr,function(k,v){
        let cur="#"+v['value'];
        if(($(cur).has("td li[data-filter='"+ic+"']")).length > 0 || ic=='all'){
            $(cur).css("display","");
        }else{
            $(cur).css("display","none");
        }
    });
}

$("#classfilter li").click(function(){
    showhide($(this).data("filter"));
});