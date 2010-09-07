(function($) {
	$.fn.sorted = function(customOptions) {
		var options = {
			reversed: false,
			by: function(a) {
				return a.text();
			}
		};
		$.extend(options, customOptions);

		$data = $(this);
		arr = $data.get();
		arr.sort(function(a, b) {

		   	var valA = options.by($(a));
		   	var valB = options.by($(b));
			if (options.reversed) {
				return (valA < valB) ? 1 : (valA > valB) ? -1 : 0;
			} else {
				return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
			}
		});
		return $(arr);
	};

})(jQuery);

/*
 * jQuery.gravatar 1.0.1 (2009-01-08)
 *
 * Written by Zach Leatherman
 * http://zachleat.com
 *
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/)
 *
 * Requires jQuery http://jquery.com (1.2.6 at time of release)
 * Requires http://pajhome.org.uk/crypt/md5/md5.js
 */

$.gravatar = function(emailAddress, overrides)
{
    // Defaults are not hardcoded here in case gravatar changes them on their end.
    var options = {
        // integer size: between 1 and 512, default 80 (in pixels)
        size: '',
        // rating: g (default), pg, r, x
        rating: '',
        // url to define a default image (can also be one of: identicon, monsterid, wavatar)
        image: ''
    };

    $.extend(options, overrides);

    var img = $('<img src="http://www.gravatar.com/avatar/' +
        hex_md5(emailAddress) +
        '.jpg?' +
        (options.size ? 's=' + options.size + '&' : '') +
        (options.rating ? 'r=' + options.rating + '&' : '') +
        (options.image ? 'd=' + encodeURIComponent(options.image) : '') +
        '"/>');

    img.bind('error', function()
    {
        $(this).remove();
    });

    return img;
};

var determine_sort = function($buttons) {
    var $selected = $buttons.parent().filter('[class*="selected-"]');
    return $selected.find('a').attr('data-value');
  };

var remove_headers = function(element) {
  $(element).find("h1").remove();
};

$(document).ready(function() {
  var $preferences = {
    duration: 800,
    adjustHeight: false
  };

  var $list = $('#container div.sortable');
  var $data = $list.clone();

  var $filtered_data = $data
  var $sorted_data = $filtered_data.sorted({
    by: function(v) {
      return parseInt($(v).attr('data-id'));
    }
  });

  $("#sort_list_button").click(function() {
    removeHeaders();
    $list.quicksand($sorted_data, $preferences);
  })

  $(".tabbable").tabs();

  $.each($('.Code h2 a.github'), function() {
    var post = $(this).parents(".Code");
    var url = $(this).attr('href');
    var segments = url.split('/');
    var repo = segments.pop();
    var username = segments.pop();
    $.getJSON("http://github.com/api/v2/json/repos/show/"+username+"/"+repo+"?callback=?", function(data){
      var repo_data = data.repository;
      if(repo_data) {
        $(post).find(".github-info .watchers").append($('<a></a>').addClass('watchers').attr('href', url+'/watchers').text(repo_data.watchers));
        $(post).find(".github-info .forks").append($('<a>').addClass('forks').attr('href', url+'/network').text(repo_data.forks));
        $(post).find(".github-info .description").append(repo_data.description);
      }
    });
    $.getJSON("http://github.com/api/v2/json/commits/list/"+username+"/"+repo+"/master?callback=?", function(data){
      var commits = data.commits;
      $.each(commits, function(index, commit_data) {
        if (index >= 10) {
          return false;
        }
        $(post).find(".github-info .commits").append( $('<tr></tr>').append( $('<td></td>').addClass('commit_data').append( $.gravatar(commit_data.author.email, {size: '24'}) ).after($('<td></td>').addClass('commit_data').text(commit_data.message))));
      });
    });
  });

});