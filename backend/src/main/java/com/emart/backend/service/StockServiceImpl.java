package com.emart.backend.service;

import com.emart.backend.model.Stock;
import com.emart.backend.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl implements StockServiceInterface {

    @Autowired
    private StockRepository stockRepository;

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Override
    public Stock getStockById(Long id) {
        return stockRepository.findById(id).orElse(null);
    }

    @Override
    public Stock createStock(Stock stock) {
        return stockRepository.save(stock);
    }

    @Override
    public Stock updateStock(Long id, Stock updatedStock) {
        Stock existing = stockRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setProductName(updatedStock.getProductName());
            existing.setQuantity(updatedStock.getQuantity());
            existing.setPrice(updatedStock.getPrice());
            return stockRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }
}
