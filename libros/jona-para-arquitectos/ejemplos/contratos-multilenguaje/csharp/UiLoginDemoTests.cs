using Xunit;

public class UiLoginDemoTests
{
    [Fact]
    public void IsValidDataExigeCorreoYContrasena()
    {
        var ui = new UiLoginDemo();
        Assert.True(ui.IsValidData("ana@ejemplo.com", "secreta123"));
        Assert.False(ui.IsValidData("", "secreta123"));
        Assert.False(ui.IsValidData("ana@ejemplo.com", ""));
    }

    [Fact]
    public void LasCapacidadesRegistranLoQueLaPantallaHizo()
    {
        var ui = new UiLoginDemo();
        ui.Login("ana@ejemplo.com", "secreta123");
        ui.Login("", "");
        ui.GoToCreateAccount();
        ui.GoToRecoverPassword();
        Assert.Equal(
            new[] { "login:ana@ejemplo.com", "error:datos-incompletos", "crear-cuenta", "recuperar-contrasena" },
            ui.Events);
    }
}
