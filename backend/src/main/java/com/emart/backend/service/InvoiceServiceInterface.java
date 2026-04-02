package com.emart.backend.service;

import com.emart.backend.model.Invoice;
import java.util.List;

public interface InvoiceServiceInterface {
    List<Invoice> getAllInvoices();
    Invoice getInvoiceById(Long id);
    Invoice createInvoice(Invoice invoice);
    Invoice saveInvoice(Invoice invoice);
    void deleteInvoice(Long id);
}
