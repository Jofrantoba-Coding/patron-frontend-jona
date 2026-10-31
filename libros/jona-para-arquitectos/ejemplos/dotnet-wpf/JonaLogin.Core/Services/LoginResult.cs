namespace JonaLogin.Services;

/// <summary>Tipo de dominio que devuelve el inicio de sesión.</summary>
public sealed record LoginResult(string Token, LoginUser User);

public sealed record LoginUser(int Id, string Usuario, string Nombre);
