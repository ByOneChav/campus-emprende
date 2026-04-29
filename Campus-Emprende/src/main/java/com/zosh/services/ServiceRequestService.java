package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceRequestCreate;
import com.zosh.payload.response.ServiceRequestResponse;

import java.util.List;

public interface ServiceRequestService {
    ServiceRequestResponse sendRequest(ServiceRequestCreate request) throws UserException;
    ServiceRequestResponse accept(Long id) throws UserException;
    ServiceRequestResponse decline(Long id) throws UserException;
    ServiceRequestResponse markInProgress(Long id) throws UserException;
    ServiceRequestResponse markCompleted(Long id) throws UserException;
    ServiceRequestResponse confirmCompletion(Long id) throws UserException;
    ServiceRequestResponse cancel(Long id) throws UserException;
    List<ServiceRequestResponse> getSentRequests() throws UserException;
    List<ServiceRequestResponse> getReceivedRequests() throws UserException;
    long countAll();
}
