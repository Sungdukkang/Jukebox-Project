import soundcloud, json

SC_client = soundcloud.Client(client_id = "9cfb13e8afddd6b2ffcf8902b1dfe087")

def pretty(obj):
	return json.dumps(obj, sort_keys=True, indent=2)

def searchSC(query):
	tracks = SC_client.get("/tracks", q = query, limit = 20)
	return tracks
res = searchSC('xxyyxx')
print res[1].title