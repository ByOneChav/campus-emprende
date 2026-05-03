package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceRequestCreate;
import com.zosh.payload.response.ServiceRequestResponse;

import java.util.List;

// 🧠 Interfaz del servicio de ServiceRequest
// Define todas las operaciones del flujo cliente ↔ proveedor
public interface ServiceRequestService {

    // 🆕 Enviar solicitud (cliente → proveedor)
    ServiceRequestResponse sendRequest(ServiceRequestCreate request) throws UserException;

    // ✅ Aceptar solicitud (proveedor)
    ServiceRequestResponse accept(Long id) throws UserException;

    // ❌ Rechazar solicitud (proveedor)
    ServiceRequestResponse decline(Long id) throws UserException;

    // 🚀 Marcar como en progreso
    ServiceRequestResponse markInProgress(Long id) throws UserException;

    // 🏁 Marcar como completado (proveedor)
    ServiceRequestResponse markCompleted(Long id) throws UserException;

    // ✔ Confirmar finalización (cliente)
    ServiceRequestResponse confirmCompletion(Long id) throws UserException;

    // 🚫 Cancelar solicitud
    ServiceRequestResponse cancel(Long id) throws UserException;

    // 📤 Obtener solicitudes enviadas (cliente)
    List<ServiceRequestResponse> getSentRequests() throws UserException;

    // 📥 Obtener solicitudes recibidas (proveedor)
    List<ServiceRequestResponse> getReceivedRequests() throws UserException;

    // 📊 Contar total de solicitudes (métrica)
    long countAll();
}