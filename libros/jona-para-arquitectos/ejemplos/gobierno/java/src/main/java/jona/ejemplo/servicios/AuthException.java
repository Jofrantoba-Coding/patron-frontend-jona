package jona.ejemplo.servicios;

/** Única falla del contrato de servicio. */
public class AuthException extends Exception {
    public AuthException(String mensaje) {
        super(mensaje);
    }
}
