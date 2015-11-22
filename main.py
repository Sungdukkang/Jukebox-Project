import webapp2, os, urllib, urllib2, json, logging
import jinja2
import soundcloud_key

JINJA_ENVIRONMENT = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
	extensions=['jinja2.ext.autoescape'],
	autoescape=True)

### Utility Functions

def pretty(obj):
	return json.dumps(obj, sort_keys=True, indent=2)

def safeGet(url):
	try:
		return urllib2.urlopen(url)
	except urllib2.URLError, e:
		if hasattr(e, 'reason'):
			print 'We failed to reach a server'
			print 'Reason: ', e.reason
		elif hasattr(e, 'code'):
			print "The server couldn\'t fulfill the request."
			print 'Error code: ', e.code
		return None


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
		#TODO: Make a helper method that takes in the query as a parameter
		#		and uses the soundcloud and youtube search functions

		else:
			template_values["message"] = "Please enter a search term."
		
		template = JINJA_ENVIRONMENT.get_template('results.json')
		self.response.write(template.render(template_values))



application = webapp2.WSGIApplication([('/api/results.json', jsonHandler),('/', MainHandler)], debug=True)
