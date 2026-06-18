from fastapi import FastAPI
import os
from supabase import create_client

app = FastAPI()

@app.post("/api/validar")
def validar(data: dict):

    cuit = data.get("cuit")
    clave = data.get("clave")

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
            "status": "success",
            "cliente": response.data[0]
        }

    return {
        "status": "error",
        "message": "Credenciales inválidas"
    }
