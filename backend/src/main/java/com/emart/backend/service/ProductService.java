package com.emart.backend.service;

import com.emart.backend.model.Product;

public interface ProductService {

    Product createProduct(Product product);

    Iterable<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);
}
