/** Implementación mínima: registra lo que la pantalla hizo, sin interfaz gráfica ni servicios. */
class UiLoginDemo : InterUiLogin {
    val events = mutableListOf<String>()

    override fun login(email: String, password: String) {
        events += if (isValidData(email, password)) "login:$email" else "error:datos-incompletos"
    }

    override fun goToCreateAccount() {
        events += "crear-cuenta"
    }

    override fun goToRecoverPassword() {
        events += "recuperar-contrasena"
    }

    override fun isValidData(email: String, password: String): Boolean = email.isNotEmpty() && password.isNotEmpty()
}
