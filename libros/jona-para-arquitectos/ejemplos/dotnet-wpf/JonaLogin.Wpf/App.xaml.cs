using System.Globalization;
using System.Windows;
using System.Windows.Data;
using JonaLogin.Services;

namespace JonaLogin.Wpf;

/// <summary>
/// Raíz de composición. Sin argumentos usa el servidor mock (http://127.0.0.1:4010);
/// con una URL, ese servidor; con --fake, el servicio falso.
/// </summary>
public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);
        var mode = e.Args.FirstOrDefault() ?? "http://127.0.0.1:4010";
        InterAuthService auth = mode == "--fake" ? new AuthServiceFake() : new AuthServiceHttp(mode);
        new UiLoginWindow(auth).Show();   // la aplicación solo conoce la entrada
    }
}

/// <summary>Invierte un booleano para enlazar IsEnabled con IsSubmitting.</summary>
public sealed class NotConverter : IValueConverter
{
    public object Convert(object value, Type targetType, object parameter, CultureInfo culture) => !(bool)value;
    public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture) => !(bool)value;
}
