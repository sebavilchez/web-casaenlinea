export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Manejo de Preflight (OPTIONS) para CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // Validar método POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Método no permitido' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    try {
      const { username, password } = await request.json()
      
      // Limpiamos espacios y guiones tanto en el usuario como en la contraseña
      const cleanUsername = username.replace(/[- ]/g, '')
      const cleanPassword = password.replace(/[- ]/g, '')

      // ✅ Buscar la contraseña en las variables de entorno usando el objeto `env`
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
}
