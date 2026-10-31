package jona.ejemplo.servicios;

/** Adaptador falso en memoria: el mismo contrato que el HTTP, sin red. */
public class AuthServiceFake implements InterAuthService {
    @Override
    public Sesion login(String correo, String clave) throws AuthException {
        if (correo.equals("ana@ejemplo.com") && clave.equals("secreta123")) return new Sesion("falso", "Ana Torres");
        throw new AuthException("Correo o contraseña incorrectos.");
    }
}
