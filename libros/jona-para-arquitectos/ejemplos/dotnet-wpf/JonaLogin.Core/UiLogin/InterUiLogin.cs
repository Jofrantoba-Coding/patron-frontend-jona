using System.ComponentModel;
using System.Windows.Input;

namespace JonaLogin.UiLogin;

/// <summary>Contrato de UI (modelo de vista): lo que la vista enlaza.</summary>
public interface InterUiLogin : INotifyPropertyChanged
{
    string Email { get; set; }
    string Password { get; set; }
    string? Error { get; }
    bool IsSubmitting { get; }
    ICommand SubmitCommand { get; }
}
