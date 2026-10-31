// Kotlin
interface InterUiLogin {
    fun login(email: String, password: String)
    fun goToCreateAccount()
    fun goToRecoverPassword()
    fun isValidData(email: String, password: String): Boolean
}
