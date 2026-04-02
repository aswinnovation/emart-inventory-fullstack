package com.emart.backend.service;

import com.emart.backend.model.Stock;
import java.util.List;

public interface StockServiceInterface {
    List<Stock> getAllStocks();
    Stock getStockById(Long id);
    Stock createStock(Stock stock);
    Stock updateStock(Long id, Stock updatedStock);
    void deleteStock(Long id);
}
