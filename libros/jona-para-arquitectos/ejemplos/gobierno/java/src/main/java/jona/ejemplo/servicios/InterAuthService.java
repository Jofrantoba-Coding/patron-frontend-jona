package jona.ejemplo.servicios;

/** Contrato de servicio (puerto): la unidad depende de esto, nunca de un adaptador. */
public interface InterAuthService {
    Sesion login(String correo, String clave) throws AuthException;
}
