/**
 * @file
 * Admin functional for Kandy live chat feature.
 */

jQuery(document).ready(function ($) {
  'use strict';

  $('#kandyBtnAddAgent').click(function () {
    $.ajax({
      url: ajaxurl + '?action=kandy_add_chat_agent',
      data: {id: $('#kandyUserListForAgents').val()},
      type: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.success) {
          window.location.reload();
        }
      }
    });
  });

  $('.select2').select2({
    width: '200px'
  });

});
