import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class UiLoginDemoTest {
    @Test
    fun isValidDataExigeCorreoYContrasena() {
        val ui = UiLoginDemo()
        assertTrue(ui.isValidData("ana@ejemplo.com", "secreta123"))
        assertFalse(ui.isValidData("", "secreta123"))
        assertFalse(ui.isValidData("ana@ejemplo.com", ""))
    }

    @Test
    fun lasCapacidadesRegistranLoQueLaPantallaHizo() {
        val ui = UiLoginDemo()
        ui.login("ana@ejemplo.com", "secreta123")
        ui.login("", "")
        ui.goToCreateAccount()
        ui.goToRecoverPassword()
        assertEquals(
            listOf("login:ana@ejemplo.com", "error:datos-incompletos", "crear-cuenta", "recuperar-contrasena"),
            ui.events,
        )
    }
}
