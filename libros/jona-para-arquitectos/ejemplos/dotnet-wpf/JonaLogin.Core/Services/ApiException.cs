namespace JonaLogin.Services;

/// <summary>Detalle por campo de un error de validación.</summary>
public sealed record ApiErrorDetail(string Field, string Message);

/// <summary>
/// Único modelo de error: el cuerpo { code, message, details, traceId } del contrato de API,
/// más el estado HTTP (0 cuando no hubo respuesta).
/// </summary>
public sealed class ApiException(int status, string code, string message, IReadOnlyList<ApiErrorDetail> details, string traceId)
    : Exception(message)
{
    public int Status { get; } = status;
    public string Code { get; } = code;
    public IReadOnlyList<ApiErrorDetail> Details { get; } = details;
    public string TraceId { get; } = traceId;
}
