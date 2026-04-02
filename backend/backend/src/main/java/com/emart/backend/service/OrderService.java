package com.emart.backend.service;

import com.emart.backend.model.Order;
import java.util.List;

public interface OrderService {
    Order placeOrder(Order order);
    List<Order> getAllOrders();
    Order getOrderById(Long id);
}
