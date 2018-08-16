 $(document).ready(function(){

$('ul.menu li').click(function() {
   // $('.ul.menu li').removeClass('active');
   if ($(this).hasClass('disabled')){
    return;
   }

    if ($(this).hasClass('active')){
        $(this).removeClass('active');
    }
    else
    {
        $(this).addClass('active');
    }
});

$('.buy-link').click(function() {
    if ($(this).parent("ul.menu li").hasClass('active')){
        $(this).parent("ul.menu li").removeClass('active');
    }
    else
    {
        $(this).parent("ul.menu li").addClass('active');
    }
});


 });
