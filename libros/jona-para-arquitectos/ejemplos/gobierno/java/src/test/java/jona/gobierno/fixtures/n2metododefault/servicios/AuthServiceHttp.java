package jona.gobierno.fixtures.n2metododefault.servicios;

public class AuthServiceHttp implements InterAuthService {
    @Override public String login(String correo) {
        return java.net.URI.create("http://127.0.0.1:4010/" + correo).toString();
    }
}
