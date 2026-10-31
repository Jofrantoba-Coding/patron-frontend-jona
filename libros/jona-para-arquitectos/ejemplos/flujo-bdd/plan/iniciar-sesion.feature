# language: es
Característica: Iniciar sesión

  @mock:exitoso
  Escenario: Credenciales válidas
    Dado un usuario activo "ana@ejemplo.com" con la clave "secreta123"
    Cuando envía el formulario de inicio de sesión
    Entonces la API responde 200 con un token
    Y la interfaz abre la pantalla de inicio

  @mock:credencialesInvalidas
  Escenario: Credenciales incorrectas
    Dado un usuario que escribe una clave incorrecta
    Cuando envía el formulario de inicio de sesión
    Entonces la API responde 401 con el código INVALID_CREDENTIALS
    Y la interfaz muestra "Correo o contraseña incorrectos."

  @mock:usuarioBloqueado
  Escenario: Usuario bloqueado
    Dado un usuario bloqueado por el administrador
    Cuando envía el formulario de inicio de sesión
    Entonces la API responde 403 con el código USER_DISABLED
    Y la interfaz muestra "Su usuario está bloqueado. Contacte al administrador."

  @mock:errorServidor
  Escenario: Falla del servidor
    Dado que el servicio de autenticación no está disponible
    Cuando envía el formulario de inicio de sesión
    Entonces la API responde 500 con el código INTERNAL_ERROR
    Y la interfaz muestra "No se pudo iniciar sesión. Intente de nuevo."
