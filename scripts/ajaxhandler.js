$("form#searchbox").submit(function( event ) {
	event.preventDefault();
	url = "/api/results.json?" + $(this).serialize();
	$.getJSON(url).done(function(data) {
		$('#tracks-container').hide();
		$('#videos-container').hide();
		$('#tracks').empty()
		$('#videos').empty()
		$('#track-name').empty();


		$(document).on('click', '.search-results.clearfix', function(event) {
			$('#queue').append($(this));
			
			//Loads track from queue
			$(this).click(function(event){
			event.preventDefault();
			$('#SCplayer').hide().attr('src', '');
			$('#YTplayer').hide().attr('src', '');

			if( $(this).hasClass("SC") ) {
				$('#SCplayer').show();
				$('#SCplayer').attr('src', "https://w.soundcloud.com/player/?url="
					+  this.id
					+ "&;auto_play=true"
					+ "&;hide_related=false"
					+ "&;show_comments=true"
					+ "&;show_user=true"
					+ "&;show_reposts=false"
					+ "&;visual=true");

			} else {
				$('#YTplayer').show();
				$('#YTplayer').attr('src', "//www.youtube.com/embed/" + this.id + '/');
			}
			$("#player").append(iframe);		
			});
		
		
		});
        
		
		if ("message" in data) {
			$("#message").append(data.message);
		};
		
		if ("query" in data){
			var caption = "<h2> Results for '" + data.query + "': </h2><h4> Click on a result to add to the queue! </h4>";
			$("#track-name").append(caption)
			
			if (data.tracks.length > 1) {
				$("#tracks-container").show();
				for (var i = 1; i < data.tracks.length; i++) {
					var currTrack = data.tracks[i];
					var container = document.createElement('div');
				    $(container).addClass('search-results clearfix');
				    $(container).addClass('SC');
				    $(container).attr("id", currTrack.stream_url);
					
					var artwork = document.createElement('img');
					$(artwork).addClass('artwork');
					if(currTrack.artwork != 'None') {
						$(artwork).attr('src', currTrack.artwork); 
					} else {
						$(artwork).attr('src', '/assets/default-art.png')
					}

					var trackInfo = document.createElement('div');
					var title = "<p><strong>" + currTrack.track_title + "</strong></p>";
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
				    $(container).attr("id", data.videos[i].stream_url);
				    
					var artwork = document.createElement('img');
					$(artwork).addClass('yt-thumb');
					$(artwork).attr('src', data.videos[i].artwork); 

					var trackInfo = document.createElement('div');						
					var title = "<p><strong>" + data.videos[i].track_title + "</strong></p>";
					var user = "<p>" + data.videos[i].user + "</p>";
					$(trackInfo).append(title);
					$(trackInfo).append(user);

					$(container).append(artwork);
					$(container).append(trackInfo);

					$("#videos").append(container);
				};
			};
		};
		
		/* Loads track directly from search results
		$(".search-results.clearfix").click(function(event){
			event.preventDefault();
			$('#SCplayer').hide().attr('src', '');
			$('#YTplayer').hide().attr('src', '');

			if( $(this).hasClass("SC") ) {
				$('#SCplayer').show();
				$('#SCplayer').attr('src', "https://w.soundcloud.com/player/?url="
					+  this.id
					+ "&;auto_play=true"
					+ "&;hide_related=false"
					+ "&;show_comments=true"
					+ "&;show_user=true"
					+ "&;show_reposts=false"
					+ "&;visual=true");

			} else {
				$('#YTplayer').show();
				$('#YTplayer').attr('src', "//www.youtube.com/embed/" + this.id + '/');
			}
			$("#player").append(iframe);		
		});
		*/

	});
});

