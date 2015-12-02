class Track:
	def __init__(self, info):
		self.SC = False
		self.title = info['title'].encode('utf-8').decode('utf-8')
		self.user = info['user']['username'].encode('utf-8')
		self.artwork = info['artwork_url']
		self.stream_url = info['stream_url']
		self.likes = info['likes_count']
		self.pb_count = info['playback_count']
		self.duration = info['duration']

class TrackList:
	def __init__(self, query):
		results = searchSC(query)
		tracks = [Track(track) for track in results]
		self.tracks = sorted(tracks, key = lambda x: x.pb_count, reverse = True)