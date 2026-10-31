// C#
public interface InterUiLogin
{
    void Login(string email, string password);
    void GoToCreateAccount();
    void GoToRecoverPassword();
    bool IsValidData(string email, string password);
}
