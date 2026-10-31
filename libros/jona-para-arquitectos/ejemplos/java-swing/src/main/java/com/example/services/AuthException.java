package com.example.services;

import java.util.List;

/**
 * Único modelo de error del contrato de servicio: el cuerpo { code, message, details, traceId }
 * del contrato de API, más el estado HTTP (0 cuando no hubo respuesta).
 */
public class AuthException extends Exception {
    public record Detail(String field, String message) { }

    private final int status;
    private final String code;
    private final List<Detail> details;
    private final String traceId;

    public AuthException(int status, String code, String message, List<Detail> details, String traceId) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = List.copyOf(details);
        this.traceId = traceId;
    }

    public int getStatus() { return status; }
    public String getCode() { return code; }
    public List<Detail> getDetails() { return details; }
    public String getTraceId() { return traceId; }
}
