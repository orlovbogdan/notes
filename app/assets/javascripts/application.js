// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require best_in_place
//= require jquery-ui
//= require best_in_place.jquery-ui
//= require jquery-ui/draggable
//= require jquery.panzoom
//= require_tree .

$(function(){
    $(document).dblclick(function(e){
        $.get($('body').data('new_note'), {ypos: e.pageY, xpos: e.pageX}, null, 'script' );
    });

    initdraggable();

    $(document).on('keydown', 'textarea', function(e) {
        if(e.keyCode == 13 && !e.shiftKey) {
            $(this).closest('form').submit();
            e.preventDefault();
        }
    });

    $(".best_in_place").best_in_place();
});

function initdraggable(){
    $('.note').draggable({
        stop: function( event, ui ) {
            $.ajax({
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                url : $(this).data('update-url'),
                type : 'PATCH',
                data : JSON.stringify({ypos: ui.position.top, xpos: ui.position.left})
            });
        }
    });
}