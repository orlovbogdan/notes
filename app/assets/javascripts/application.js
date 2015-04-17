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
//= require jquery-ui/resizable
//= require jquery.panzoom
//= require_tree .

$(function(){
    $('html').dblclick(function(e){
        if (Object.prototype.toString.call(e.target) == '[object HTMLHtmlElement]')
            $.get($('body').data('new_note'), {ypos: e.pageY, xpos: e.pageX}, null, 'script' );
    });

    initnotes();

    $(document).on('keydown', 'textarea', function(e) {
        if(e.keyCode == 13 && !e.shiftKey) {
            $(this).closest('form').submit();
            e.preventDefault();
        }
    });

    $(".best_in_place").best_in_place({
        event: 'dblclick'
    });


    $(document).on('keydown', 'textarea', function(e){
        if(e.keyCode == 27) {
            $(this).closest('form').remove();
            e.preventDefault();
        }
    })

});

function initnotes(){
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
    $('.note').resizable({
        handles: "se",
        stop: function (event, ui) {
            $.ajax({
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                url : $(this).data('update-url'),
                type : 'PATCH',
                data : JSON.stringify({width: ui.size.width, height: ui.size.height})
            });
        }
    });
}