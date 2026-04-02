package com.emart.backend.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private Double totalAmount;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date(); // default time

    // ✅ Link to InvoiceItem
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "invoice_id") // foreign key in invoice_items table
    private List<InvoiceItem> items;

    // ✅ Constructors
    public Invoice() {}

    public Invoice(String customerName, Double totalAmount, List<InvoiceItem> items) {
        this.customerName = customerName;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<InvoiceItem> getItems() {
        return items;
    }

    public void setItems(List<InvoiceItem> items) {
        this.items = items;
    }
}
