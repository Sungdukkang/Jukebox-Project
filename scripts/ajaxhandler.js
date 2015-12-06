$("form#searchbox").submit(function( event ) {
	event.preventDefault();
	url = "/api/results.json?" + $(this).serialize();
	$.getJSON(url).done(function(data) {
		$('#tracks-container').hide();
		$('#videos-container').hide();
		$('#tracks').empty()
		$('#videos').empty()
		$('#track-name').empty();
		
		if ("message" in data) {
			$("#message").append(data.message);
		};
		
		if ("query" in data){
			var caption = "<h2> Results for '" + data.query + "': </h2>";
			$("#track-name").append(caption)
			
			if (data.tracks.length > 1) {
				$("#tracks-container").show();
				for (var i = 1; i < data.tracks.length; i++) {
					var currTrack = data.tracks[i];
					var container = document.createElement('div');
				    $(container).addClass('search-results clearfix');
				    $(container).addClass('SC');
				    $(container).attr("id", currTrack.uri);
					
					var artwork = document.createElement('img');
					$(artwork).addClass('artwork');
					if(currTrack.artwork != 'None') {
						$(artwork).attr('src', currTrack.artwork); 
					} else {
						$(artwork).attr('src', '/assets/default-art.png')
					}

					var trackInfo = document.createElement('div');
					var title = "<p>" + currTrack.track_title + "</p>";
					var user = "<p>" + currTrack.user + "</p>";
					$(trackInfo).append(title);
					$(trackInfo).append(user);

					$(container).append(artwork);
					$(container).append(trackInfo);

					$("#tracks").append(container);
				};
			};
			
			if (data.videos.length > 1) {
				$('#videos-container').show();
				for (var i = 1; i < data.videos.length; i++) {					    
					var container = document.createElement('div');
				    $(container).addClass('search-results clearfix');
				    $(container).addClass('YT');
				    $(container).attr("id", data.videos[i].uri);
				    
					var artwork = document.createElement('img');
					$(artwork).addClass('yt-thumb');
					$(artwork).attr('src', data.videos[i].artwork); 

					var trackInfo = document.createElement('div');						
					var title = "<p>" + data.videos[i].track_title + "</p>";
					var user = "<p>" + data.videos[i].user + "</p>";
					$(trackInfo).append(title);
					$(trackInfo).append(user);

					$(container).append(artwork);
					$(container).append(trackInfo);

					$("#videos").append(container);
				};
			};
		};
		
		$(".search-results.clearfix").click(function(event){
			event.preventDefault();
			var iframe = ""
			if( $(this).hasClass("SC") ) {
				iframe = "<iframe width=\"100%\" height=\"450\" scrolling=\"no\" frameborder=\"no\" src="
				+ "https://w.soundcloud.com/player/?url="
				+  this.id
				+ "&amp;auto_play=true"
				+ "&amp;hide_related=false"
				+ "&amp;show_comments=true"
				+ "&amp;show_user=true"
				+ "&amp;show_reposts=false"
				+ "&amp;visual=true\"></iframe>"; 
			} else {
				iframe = "<iframe width=\"100%\" height=\"360\" src=\"//www.youtube.com/embed/" + this.id + "\" " + "frameborder=\"0\" allowfullscreen></iframe>";
			}
			$("#player").append(iframe);		
		});

	});
});

// TODO: Use this to add to the queue
function addToQueue(trackObj) {
	var item = document.createElement('li');
	var title = "<p>" + trackObj+ "</p>";
	$(item).append(title);
	$('#queue').append(item);
};

