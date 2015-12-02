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
					var caption = "<h2>" + data.query + "</h2>";
					$("#track-name").append(caption)
					
					var tracks = "<h3>Tracks</h3>"
					$("#tracks").append(tracks)
					for (var i = 1; i < data.tracks.length; i++) {
						var trackInfo = $("<div></div>");
						var title = "<p>" + data.tracks[i].track_title + "</p>";
						var user = "<p>" + data.tracks[i].user + "</p>";
						trackInfo.append(title);
						trackInfo.append(user);
						$("#tracks").append(trackInfo);
					};

					var videos = "<h3>Videos</h3>"
					$("#videos").append(videos)
					for (var i = 1; i < data.videos.length; i++) {
						var trackInfo = $("<div></div>");
						var title = "<p>" + data.videos[i].track_title + "</p>";
						var user = "<p>" + data.videos[i].user + "</p>";
						trackInfo.append(title);
						trackInfo.append(user);
						$("#videos").append(trackInfo);
					};
				};	
			});
		});