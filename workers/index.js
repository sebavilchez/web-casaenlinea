// Corregir: globalThis[cleanUsername] no funciona con Variables de Entorno
// Usar el objeto de env que receives en el handler

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Método no permitido' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { username, password } = await request.json()
    const cleanUsername = username.replace(/[- ]/g, '')
    const cleanPassword = password.replace(/[- ]/g, '')

    // ✅ CORRECTO: Buscar en variables de entorno directamente
    const PASSWORD_EN_SISTEMA = globalThis[cleanUsername]

    if (PASSWORD_EN_SISTEMA && PASSWORD_EN_SISTEMA === cleanPassword) {
      const tokenSession = btoa(cleanUsername + '_' + Date.now())

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Acceso concedido',
        token: tokenSession,
        cuit: cleanUsername  // ← Devolver CUIT para usar en el dashboard
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
