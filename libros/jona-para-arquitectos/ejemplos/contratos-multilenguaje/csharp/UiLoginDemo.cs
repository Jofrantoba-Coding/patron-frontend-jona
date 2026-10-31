using System.Collections.Generic;

/// <summary>Implementación mínima: registra lo que la pantalla hizo, sin interfaz gráfica ni servicios.</summary>
public class UiLoginDemo : InterUiLogin
{
    public List<string> Events { get; } = new();

    public void Login(string email, string password) =>
        Events.Add(IsValidData(email, password) ? $"login:{email}" : "error:datos-incompletos");

    public void GoToCreateAccount() => Events.Add("crear-cuenta");

    public void GoToRecoverPassword() => Events.Add("recuperar-contrasena");

    public bool IsValidData(string email, string password) => email != "" && password != "";
}
