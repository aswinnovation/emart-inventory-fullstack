package com.emart.backend.service;

import com.emart.backend.model.Invoice;
import com.emart.backend.model.InvoiceItem;
import com.emart.backend.model.Product;
import com.emart.backend.repository.InvoiceRepository;
import com.emart.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InvoiceServiceImpl implements InvoiceServiceInterface {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id).orElse(null);
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        BigDecimal total = BigDecimal.ZERO;

        for (InvoiceItem item : invoice.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + item.getProductId()));

            item.setProductName(product.getName());

            // Convert product price to BigDecimal
            BigDecimal price = BigDecimal.valueOf(product.getPrice());

            // ✅ If setPrice expects double, convert back
            item.setPrice(price.doubleValue());

            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

            // ✅ If setTotal expects double, convert back
            item.setTotal(itemTotal.doubleValue());

            total = total.add(itemTotal);

            item.setInvoice(invoice); // set foreign key relationship
        }

        // Set final invoice total
        invoice.setTotalAmount(total.doubleValue());

        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
