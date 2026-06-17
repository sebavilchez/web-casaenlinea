export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://www.casaenlinea.com.ar', // ← Tu dominio real y seguro
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400', // Cachea la respuesta por 24 horas
    }

    // 1. Responder INMEDIATAMENTE al Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      })
    }

    // 2. Si la petición es para el validador de Login (POST)
    if (request.method === 'POST') {
      try {
        const { username, password } = await request.json()
        
        const cleanUsername = username.replace(/[- ]/g, '')
        const cleanPassword = password.replace(/[- ]/g, '')

        const PASSWORD_EN_SISTEMA = env[cleanUsername]

        if (PASSWORD_EN_SISTEMA && PASSWORD_EN_SISTEMA === cleanPassword) {
          const tokenSession = btoa(cleanUsername + '_' + Date.now())

          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Acceso concedido',
            token: tokenSession,
            cuit: cleanUsername  
          }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else {
          return new Response(JSON.stringify({ 
            success: false, 
            message: 'El CUIT/DNI o la contraseña son incorrectos.' 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

      } catch (error) {
        return new Response(JSON.stringify({ success: false, message: 'Error interno en el validador.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    // 3. Si piden otra cosa que no es POST ni OPTIONS, dejamos que siga su curso
    return new Response(JSON.stringify({ success: false, message: 'Ruta no encontrada' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
