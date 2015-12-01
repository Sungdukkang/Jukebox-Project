$("form#searchbox").submit(function( event ) {
			event.preventDefault();
			url = "/api/results.json?" + $(this).serialize();
			$.getJSON(url).done(function(data) {
				$('#results').empty();
				$('#message').empty();
				if ("message" in data) {
					$("message").append(data.message);
				};
				if ("query" in data){
					var caption = "<strong>Results for: " + data.query + "</strong>";
					$("#results").append(caption)
					
					for (var i = 1; i <= data.tracks.length; i++) {
						var trackInfo = $("<div></div>");
						var title = "<p>" + data.tracks[i].track_title + "</p>";
						var user = "<p>" + data.tracks[i].user + "</p>";
						trackInfo.append(title);
						trackInfo.append(user);
						$("#message").append(trackInfo);
					};
				};	
			});
		});