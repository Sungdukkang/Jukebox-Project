$("form#searchbox").submit(function( event ) {
			event.preventDefault();
			url = "/api/results.json?" + $(this).serialize();
			$.getJSON(url).done(function(data) {
				$('#tracks').empty();
				$('#videos').empty();
				$('message').empty();
				if ("message" in data) {
					$("#message").append(data.message);
				};
				if ("query" in data){
					var caption = "<h2> Results for: " + data.query + "</h2>";
					$("#track-name").append(caption)
					
					var tracks = "<h3>Tracks</h3>"
					$("#tracks").append(tracks)
					for (var i = 1; i < data.tracks.length; i++) {
						var trackInfo = $("<div class='search-results'></div>");
						if(data.tracks[i].artwork != 'None') {
							var artwork = "<img class ='artwork' src=" + data.tracks[i].artwork + "></img>"   
						} else {
							var artwork = "<img class ='artwork' src='/assets/default-art.png'></img>"   
						}
						var title = "<p>" + data.tracks[i].track_title + "</p>";
						var user = "<p>" + data.tracks[i].user + "</p>";
						var linebreak = "<br />"
						trackInfo.append(artwork);
						trackInfo.append(title);
						trackInfo.append(user);
						$("#tracks").append(trackInfo);
						$("#tracks").append(linebreak);
					};

					var videos = "<h3>Videos</h3>"
					$("#videos").append(videos)
					for (var i = 1; i < data.videos.length; i++) {
						var trackInfo = $("<div class='search-results'></div>");
						var artwork = "<img class ='artwork' src=" + data.videos[i].artwork + "></img>" 
						var title = "<p>" + data.videos[i].track_title + "</p>";
						var user = "<p>" + data.videos[i].user + "</p>";
						var linebreak = "<br />"
						trackInfo.append(artwork);
						trackInfo.append(title);
						trackInfo.append(user);
						$("#videos").append(trackInfo);
						$("#videos").append(linebreak);
					};
				};	
			});
		});