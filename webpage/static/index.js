// change text when link is clicked 
// adapted from https://stackoverflow.com/questions/16407315/changing-content-in-a-div-when-a-link-is-clicked
$(document).ready(function() {
    $('.question1').click(function(){
        $('.new_member_box_display').text($('.answer1 ').text());
    });

    // $('.question2').click(function(){
    //     $('.new_member_box_display').text($('.answer2').text());
    // });

    // $('.question3').click(function(){
    //  $('.new_member_box_display').text($('.answer3').text());
    // });

    // $('.question4').click(function(){
    //  $('.new_member_box_display').text($('.answer4').text());
    // });
});