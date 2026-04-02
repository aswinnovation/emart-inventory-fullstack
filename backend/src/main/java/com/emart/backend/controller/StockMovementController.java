package com.emart.backend.controller;

import com.emart.backend.service.StockMovementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stock/movements")
public class StockMovementController {

    @Autowired
    private StockMovementService movementService;

    @PostMapping("/record")
    public ResponseEntity<String> recordMovement(@RequestParam Long productId,
                                                 @RequestParam int quantity,
                                                 @RequestParam String type) {
        movementService.recordMovement(productId, quantity, type);
        return ResponseEntity.ok("Movement recorded");
    }
}
