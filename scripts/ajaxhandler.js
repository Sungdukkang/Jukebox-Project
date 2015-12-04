$("form#searchbox").submit(function( event ) {
			event.preventDefault();
			url = "/api/results.json?" + $(this).serialize();
			$.getJSON(url).done(function(data) {
				$('#tracks').empty();
				$('#videos').empty();
				$('#track-name').empty();
				if ("message" in data) {
					$("#message").append(data.message);
				};
				if ("query" in data){
					var caption = "<h2> Results for '" + data.query + "': </h2>";
					$("#track-name").append(caption)
					
					var tracks = "<h3>Tracks</h3>"
					$("#tracks").append(tracks)
					for (var i = 1; i < data.tracks.length; i++) {
						var container = document.createElement('div');
					    $(container).addClass('search-results clearfix');
						
						var artwork = document.createElement('img');
						$(artwork).addClass('artwork');
						if(data.tracks[i].artwork != 'None') {
							$(artwork).attr('src', data.tracks[i].artwork); 
						} else {
							$(artwork).attr('src', '/assets/default-art.png')
						}

						var trackInfo = document.createElement('div');
						var title = "<p>" + data.tracks[i].track_title + "</p>";
						var user = "<p>" + data.tracks[i].user + "</p>";
						$(trackInfo).append(title);
						$(trackInfo).append(user);

						$(container).append(artwork);
						$(container).append(trackInfo);

						$("#tracks").append(container);
					};

					var videos = "<h3>Videos</h3>"
					$("#videos").append(videos)
					for (var i = 1; i < data.videos.length; i++) {					    
						var container = document.createElement('div');
					    $(container).addClass('search-results clearfix');
					    
						var artwork = document.createElement('img');
						$(artwork).addClass('thumbnail');
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
			});
		});