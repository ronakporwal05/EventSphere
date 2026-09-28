package com.eventsphere.capacity.service;

public interface ExportService {

    byte[] exportRegistrationsCsv(String eventId);

    byte[] exportRegistrationsExcel(String eventId);
}
