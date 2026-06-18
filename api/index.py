import json
import os
from supabase import create_client

def handler(request):
    body = request.json

    cuit = body.get("cuit")
    clave = body.get("clave")

    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    supabase = create_client(url, key)

    response = supabase.table("clientes") \
        .select("*") \
        .eq("cliente_cuit", cuit) \
        .eq("cliente_clave", clave) \
        .execute()

    if response.data:
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "status": "success",
                "cliente": response.data[0]
            })
        }

    return {
        "statusCode": 401,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({
            "status": "error",
            "message": "Credenciales inválidas"
        })
    }
