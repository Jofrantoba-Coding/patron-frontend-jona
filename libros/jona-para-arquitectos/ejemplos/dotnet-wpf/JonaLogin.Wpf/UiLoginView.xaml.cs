using System.Windows;
using System.Windows.Controls;
using JonaLogin.UiLogin;

namespace JonaLogin.Wpf;

/// <summary>Vista: sin lógica. La única línea reenvía la contraseña, que PasswordBox no permite enlazar.</summary>
public partial class UiLoginView : UserControl
{
    public UiLoginView() => InitializeComponent();

    private void OnPasswordChanged(object sender, RoutedEventArgs e) =>
        ((InterUiLogin)DataContext).Password = passwordBox.Password;
}
