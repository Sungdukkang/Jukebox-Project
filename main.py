import webapp2, os, urllib, urllib2, json, logging
import jinja2
from apiclient.discovery import build
import soundcloud_key, youtube_key

JINJA_ENVIRONMENT = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

sc_client_id = soundcloud_key.key
YT_DEVELOPER_KEY = youtube_key.key
YT_API_SERVICE_NAME = "youtube"
YT_API_VERSION = "v3"

# ======= Utility functions =======

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

# ======== Soundcloud Functions ========

def searchSC(query, params={}):
	baseurl = "https://api.soundcloud.com/tracks?"
	params = {'client_id': sc_client_id, 'q':query, 'limit': 5}
	url = baseurl + urllib.urlencode(params)
	return safeGet(url)

# ========== YouTube Functions ===========
YouTube = build(YT_API_SERVICE_NAME, YT_API_VERSION, developerKey = YT_DEVELOPER_KEY)

def searchYT(query):
	MUSIC_CATEGORY= "10"
	response = YouTube.search().list(q = query, part = "id", order = "viewCount", type = "video", videoCategoryId = MUSIC_CATEGORY).execute()
	search_videos = []

	#Merge video ids
	for result in response.get("items", []):
		search_videos.append(result["id"]["videoId"])

	video_ids = ",".join(search_videos)
	video_response = YouTube.videos().list(
		id = video_ids,
		part = "snippet, statistics, contentDetails, player"
		).execute()

	return video_response.get("items", [])

# ========= Track Classes ========
class Track:
	def __init__(self, info, YT = False):
		if not YT:
			self.title = info['title'].encode('utf-8').decode('utf-8')
			self.user = info['user']['username'].encode('utf-8')
			self.artwork = info['artwork_url']
			self.stream_url = info['stream_url']
			self.pb_count = info['playback_count']
			self.duration = info['duration']

		else:
			self.title = info["snippet"]["title"].encode('utf-8').decode('utf-8')
			self.user =  info["snippet"]["channelTitle"].encode('utf-8').decode('utf-8')
			self.artwork = info["snippet"]["thumbnails"]["default"]["url"]
			self.stream_url = info["player"]["embedHtml"]
			self.pb_count = info["statistics"]["viewCount"]
			self.duration = info["contentDetails"]["duration"]


class TrackList:
	def __init__(self, query):
		sc_res = searchSC(query)
		yt_res = searchYT(query)
		tracks = [Track(track) for track in sc_res]
		videos = [Track(video, YT = True) for video in yt_res]
		self.tracks = sorted(tracks, key = lambda x: x.pb_count, reverse = True)
		self.videos = sorted(videos, key = lambda x: x.pb_count, reverse = True)

# ===== Request handlers =======

class MainHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}
		template = JINJA_ENVIRONMENT.get_template('index.html')
		self.response.write(template.render(template_values))

class jsonHandler(webapp2.RequestHandler):
	def get(self):
		template_values = {}

		if self.request.get('query', False):
			query = self.request.get('query')
			template_values["query"] = query
			combined_res = TrackList(str(query))
			if combined_res != None:
				template_values['tracks'] = combined_res.tracks
				template_values['videos'] = combined_res.videos
		else:
			template_values["message"] = "Please enter a search term."
		
		template = JINJA_ENVIRONMENT.get_template('results.json')
		resp = template.render(template_values)
		logging.info(resp)
		self.response.write(resp)

application = webapp2.WSGIApplication([('/api/results.json', jsonHandler),('/', MainHandler)], debug=True)
