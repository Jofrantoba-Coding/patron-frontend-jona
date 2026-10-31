using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;
using JonaLogin.Services;

namespace JonaLogin.UiLogin;

/// <summary>Implementación: el modelo de vista de WPF, que recibe el contrato de servicio.</summary>
public sealed class UiLoginImpl : InterUiLogin
{
    private readonly InterAuthService _auth;
    private readonly Action<LoginResult> _onAuthenticated;
    private string _email = "";
    private string _password = "";
    private string? _error;
    private bool _isSubmitting;

    public UiLoginImpl(InterAuthService auth, Action<LoginResult> onAuthenticated)
    {
        _auth = auth;
        _onAuthenticated = onAuthenticated;
        SubmitCommand = new AsyncCommand(SubmitAsync, () => !IsSubmitting);
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    public string Email { get => _email; set => Set(ref _email, value); }
    public string Password { get => _password; set => Set(ref _password, value); }
    public string? Error { get => _error; private set => Set(ref _error, value); }

    public bool IsSubmitting
    {
        get => _isSubmitting;
        private set
        {
            Set(ref _isSubmitting, value);
            ((AsyncCommand)SubmitCommand).RaiseCanExecuteChanged();   // el comando deshabilitado evita el doble envío
        }
    }

    public ICommand SubmitCommand { get; }

    private async Task SubmitAsync()
    {
        if (!LoginRules.IsValidData(Email, Password)) { Error = LoginRules.MissingDataError; return; }
        Error = null;                                  // limpia el error del intento anterior
        IsSubmitting = true;
        LoginResult? result = null;
        try { result = await _auth.LoginAsync(Email, Password); }
        catch (ApiException ex) { Error = LoginRules.MessageFor(ex.Code); }
        finally { IsSubmitting = false; }
        if (result is not null) _onAuthenticated(result);
    }

    private void Set<T>(ref T field, T value, [CallerMemberName] string? name = null)
    {
        if (EqualityComparer<T>.Default.Equals(field, value)) return;
        field = value;
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
    }
}
