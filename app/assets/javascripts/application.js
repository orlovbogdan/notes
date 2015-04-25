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
//= require jquery.mjs.nestedSortable
//= require_tree .

$(function(){
    $('html').dblclick(function(e){
        if (e.target.getAttribute('id') == 'selectable'){
            $.get($('body').data('new_note'), {ypos: e.pageY, xpos: e.pageX}, null, 'script' );
        }
    });

    $('html').click(function(e){
        if (e.target.getAttribute('id') == 'selectable'){
            $("*").removeClass("ui-selected");
        }
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
    });

    $('.new-sub-note').on('click', function(e){
        var th = this;
        var pos =  2;
        $.get($(this).attr('href'), { parent_id: $(this).attr('data-note-id'), position: pos}, function(data){
            $(th).closest('.note').find('.sub-notes').append(data);
        });
        e.preventDefault();
    });









    $('li').on('click', function (e) {
        e.stopPropagation();
        $(this).toggleClass('selected');
    });
    var ns = $('ol.sub-notes, ol.moved').nestedSortable({

        connectWith: 'ol.moved, ol.sortable, #selectable',

        forcePlaceholderSize: true,
        handle: 'div',
        helper: function (e, item) {
            console.log('parent-helper');
            console.log(item);
            if (!item.hasClass('selected'))
                item.addClass('selected');
            var elements = $('.selected').not('.ui-sortable-placeholder').clone();
            var helper = $('<ul/>');
            item.siblings('.selected').addClass('hidden');
            return helper.append(elements);
        },
        start: function (e, ui) {
            var elements = ui.item.siblings('.selected.hidden').not('.ui-sortable-placeholder');
            ui.item.data('items', elements);
        },
        receive: function (e, ui) {
            ui.item.before(ui.item.data('items'));
        },
        stop: function (e, ui) {
            ui.item.siblings('.selected').removeClass('hidden');
            $('.selected').removeClass('selected');
        },
        items: 'li',
        opacity: .6,
        placeholder: 'placeholder',
        revert: 250,
        tabSize: 25,
        tolerance: 'pointer',
        toleranceElement: '> div',
        maxLevels: 4,
        isTree: true,
        expandOnHover: 700,
        startCollapsed: false,
        change: function () {
            console.log('Relocated item');
        }
    });

    $('.disclose').on('click', function () {
        $(this).closest('li').toggleClass('mjs-nestedSortable-collapsed').toggleClass('mjs-nestedSortable-expanded');
        $(this).toggleClass('ui-icon-plusthick').toggleClass('ui-icon-minusthick');
    });



});

function initnotes(){


    /*$('.sub-notes').nestedSortable({
        items: 'li',
        toleranceElement: '> div'
    });*/



    $('html, body, #selectable').height($(document).height());
    $('html, body, #selectable').width($(document).width());

    offset = {top:0, left:0};

    $("#selectable > .note").draggable({
        stop: function (event, ui) {
            if ($(this).hasClass("ui-selected")) {
                var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
                $(".note.ui-selected").each(function () {
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: $(this).data('update-url'),
                        type: 'PATCH',
                        data: JSON.stringify({ypos: $(this).data("offset").top + dt, xpos: $(this).data("offset").left + dl})
                    });
                })
            } else {
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    url: $(this).data('update-url'),
                    type: 'PATCH',
                    data: JSON.stringify({ypos: ui.position.top, xpos: ui.position.left})
                });
            };
            $('html, body, #selectable').height($(document).height());
        },
        start: function(ev, ui) {
            if ($(this).hasClass("ui-selected")){
                $(".note.ui-selected").each(function() {
                    $(this).data("offset", $(this).offset());
                });
            }
            else {
                $("*").removeClass("ui-selected");
            }
            offset = $(this).offset();
        },
        drag: function(ev, ui) {
            var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
            $(".note.ui-selected").not(this).each(function() {
                $(this).css({top: $(this).data("offset").top + dt, left: $(this).data("offset").left + dl});
            });
        }
    });

    $("#selectable").selectable({
        distance: 1
    });

    $("#selectable > div").click( function(e){
        if (e.metaKey == false) {
            $("*").removeClass("ui-selected");
            $(this).addClass("ui-selecting");
        }
        else {
            if ($(this).hasClass("ui-selected")) {
                $(this).removeClass("ui-selected");
                $(this).find('*').removeClass("ui-selected");
            }
            else {
                $(this).addClass("ui-selecting");
            }
        }

        $("#selectable").data("ui-selectable")._mouseStop(null);
    });


    $('#selectable > .note').resizable({
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