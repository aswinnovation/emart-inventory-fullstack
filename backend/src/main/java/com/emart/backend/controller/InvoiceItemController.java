package com.emart.backend.controller;

import com.emart.backend.model.InvoiceItem;
import com.emart.backend.repository.InvoiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoice-items")
@CrossOrigin(origins = "*")
public class InvoiceItemController {

    @Autowired
    private InvoiceItemRepository invoiceItemRepository;

    @GetMapping
    public List<InvoiceItem> getAllItems() {
        return invoiceItemRepository.findAll();
    }

    @GetMapping("/{id}")
    public InvoiceItem getItemById(@PathVariable Long id) {
        return invoiceItemRepository.findById(id).orElse(null);
    }

    @PostMapping
    public InvoiceItem createItem(@RequestBody InvoiceItem item) {
        return invoiceItemRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        invoiceItemRepository.deleteById(id);
    }
}
