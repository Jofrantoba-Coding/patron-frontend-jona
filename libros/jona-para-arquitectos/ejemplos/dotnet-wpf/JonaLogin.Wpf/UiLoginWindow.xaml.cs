using System.Windows;
using JonaLogin.Services;
using JonaLogin.UiLogin;

namespace JonaLogin.Wpf;

/// <summary>Entrada: crea la Implementación con el servicio recibido y la asigna como DataContext.</summary>
public partial class UiLoginWindow : Window
{
    public UiLoginWindow(InterAuthService auth)
    {
        InitializeComponent();
        DataContext = new UiLoginImpl(auth, session =>
        {
            MessageBox.Show($"Hola, {session.User.Nombre}", "Sesión iniciada");
            Close();
        });
    }
}
