package com.emart.backend.service;

import com.emart.backend.model.StockMovement;
import com.emart.backend.repository.StockMovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementService {

    @Autowired
    private StockMovementRepository repository;

    public List<StockMovement> getAllMovements() {
        return repository.findAll();
    }

    public List<StockMovement> getMovementsByProductId(Long productId) {
        return repository.findByProductId(productId); // ✅ FIXED
    }

    public void recordMovement(Long productId, int quantityChanged, String type) {
        StockMovement movement = new StockMovement();
        movement.setProductId(productId);
        movement.setQuantity(quantityChanged);
        movement.setType(type);

        repository.save(movement);
    }
}
