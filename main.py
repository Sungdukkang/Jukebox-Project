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
	params = {'client_id': sc_client_id, 'q':query, 'limit': 25}
	url = baseurl + urllib.urlencode(params)
	return safeGet(url)

class Track:
	def __init__(self, info):
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

# ========== YouTube Functions ===========
def searchYT(query, params = {}):
	YouTube = build(YT_API_SERVICE_NAME, YT_API_VERSION, developerKey = YT_DEVELOPER_KEY)

	params = {"q" : query, 
			"part" : "id,snippet",
			"order" : "viewCount", 
			"type" : "video", 
			"videoCategoryId" : "10",
			"maxResults" : 10}

	response = YouTube.search().list(q = query, part = "id,snippet", order = "viewCount", type = "video", videoCategoryId = "10").execute()

	return response

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
			sc_res = TrackList(str(query))
			yt_res = searchYT(query)
			logging.info(yt_res)
			if sc_res != None:
				template_values['tracks'] = sc_res.tracks
		else:
			template_values["message"] = "Please enter a search term."
		
		template = JINJA_ENVIRONMENT.get_template('results.json')
		resp = template.render(template_values)
		logging.info(resp)
		self.response.write(resp)

application = webapp2.WSGIApplication([('/api/results.json', jsonHandler),('/', MainHandler)], debug=True)
