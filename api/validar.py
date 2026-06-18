import os
import json
from http.server import BaseHTTPRequestHandler
from supabase import create_client

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Leer el contenido
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        cuit = data.get('cuit')
        clave = data.get('clave')
        
        # Conexión a Supabase
        supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
        
        # Búsqueda
        response = supabase.table("clientes").select("*").eq("cliente_cuit", cuit).eq("cliente_clave", clave).execute()
        
        if response.data:
            self._responder(200, {"status": "success", "cliente": response.data[0]})
        else:
            self._responder(401, {"status": "error", "message": "Credenciales inválidas"})

    def do_OPTIONS(self):
        # Esto es vital para evitar el error 405 en las peticiones preflight (CORS)
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
