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
					var caption = "<h3> Results for '" + data.query + "': </h3>";
					$("#track-name").append(caption)
					
					if (data.tracks.length > 1) {
						$("#tracks-container").show();
						for (var i = 1; i < data.tracks.length; i++) {
							var currTrack = data.tracks[i];
							var container = document.createElement('div');
						    $(container).attr('id', currTrack.stream_url);
						    $(container).addClass('search-results clearfix');
							
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

					/* TODO: Fix this 
					    for(var j = 1; j < data.tracks.length; j++) {
					    	var temp = data.tracks[j];
					    	$(document.getElementById(temp.stream_url)).click(function() {
						    	addToQueue(temp.track_title);
						    });
					    };
					*/
					};

					if (data.videos.length > 1) {
						$('#videos-container').show();
						for (var i = 1; i < data.videos.length; i++) {					    
							var container = document.createElement('div');
						    $(container).addClass('search-results clearfix');
						    
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
			});
		});

// TODO: Use this to add to the queue
function addToQueue(trackObj) {
	var item = document.createElement('li');
	var title = "<p>" + trackObj+ "</p>";
	$(item).append(title);
	$('#queue').append(item);
};