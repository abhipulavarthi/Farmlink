package com.faai.backend.service;

import com.faai.backend.model.Product;
import com.faai.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProductsBySeller(String sellerId) {
        return productRepository.findBySellerId(sellerId);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product updates) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        if (updates.getName() != null)
            product.setName(updates.getName());
        if (updates.getPrice() != null)
            product.setPrice(updates.getPrice());
        if (updates.getUnit() != null)
            product.setUnit(updates.getUnit());
        if (updates.getStock() != null)
            product.setStock(updates.getStock());
        if (updates.getCategory() != null)
            product.setCategory(updates.getCategory());
        if (updates.getImageUrl() != null)
            product.setImageUrl(updates.getImageUrl());
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
