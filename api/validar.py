import os
import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

```
def do_POST(self):
    try:
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")

        self._responder(
            200,
            {
                "status": "ok",
                "supabase_url": url,
                "tiene_key": bool(key)
            }
        )

    except Exception as e:
        self._responder(
            500,
            {
                "status": "error",
                "message": str(e)
            }
        )

def do_OPTIONS(self):
    self.send_response(200)
    self.send_header('Access-Control-Allow-Origin', '*')
    self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    self.send_header('Access-Control-Allow-Headers', 'Content-Type')
    self.end_headers()

def _responder(self, status, data):
    self.send_response(status)
    self.send_header('Content-Type', 'application/json')
    self.send_header('Access-Control-Allow-Origin', '*')
    self.end_headers()
    self.wfile.write(json.dumps(data).encode('utf-8'))
```
