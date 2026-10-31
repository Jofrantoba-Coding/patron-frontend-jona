using System.Windows.Input;

namespace JonaLogin.UiLogin;

/// <summary>Comando asíncrono mínimo: WPF lo invoca con Execute; las pruebas esperan ExecuteAsync.</summary>
public sealed class AsyncCommand(Func<Task> execute, Func<bool> canExecute) : ICommand
{
    public event EventHandler? CanExecuteChanged;

    public bool CanExecute(object? parameter) => canExecute();

    public async void Execute(object? parameter) => await ExecuteAsync();

    public Task ExecuteAsync() => canExecute() ? execute() : Task.CompletedTask;

    public void RaiseCanExecuteChanged() => CanExecuteChanged?.Invoke(this, EventArgs.Empty);
}
