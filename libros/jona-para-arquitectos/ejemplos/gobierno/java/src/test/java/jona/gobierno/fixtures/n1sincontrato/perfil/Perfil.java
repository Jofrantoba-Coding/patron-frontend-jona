package jona.gobierno.fixtures.n1sincontrato.perfil;

public final class Perfil {
    private Perfil() { }

    public static String crear() { return new PerfilView().pintar(new PerfilImpl().nombre()); }
}
