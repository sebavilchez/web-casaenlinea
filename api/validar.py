import json
import os
from supabase import create_client

def handler(request):
    body = request.json

    return {
        "debug": True,
        "recibido": body
    }
