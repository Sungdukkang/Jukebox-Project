import json, urllib, urllib2, webbrowser
import soundcloud_key

sc_client_id = soundcloud_key.key

def pretty(obj):
	return json.dumps(obj, sort_keys=True, indent = 2)

def safeGet(url):
    try:
        return json.load(urllib2.urlopen(url))
    except urllib2.HTTPError, e:
        print "The server couldn't fulfill the request." 
        print "Error code: ", e.code
    except urllib2.URLError, e:
        print "We failed to reach a server"
        print "Reason: ", e.reason
    return None

def searchSC(query, params={}):
	baseurl = "https://api.soundcloud.com/tracks?"
	params = {'client_id': sc_client_id, 'q':query, 'limit': 100}
	url = baseurl + urllib.urlencode(params)
	return safeGet(url)

class Track:
	def __init__(self, info):
		self.title = info['title'].encode('utf-8')
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

test = TrackList('hiatus kaiyote')

for track in test.tracks:
	print "%s: %d likes" % (track.title, track.likes)
	print "User: " + track.user
