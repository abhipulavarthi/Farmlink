package com.faai.backend.controller;

import com.faai.backend.model.Plant;
import com.faai.backend.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plants")
@CrossOrigin(origins = "*")
public class PlantController {
    @Autowired
    private PlantService plantService;

    @GetMapping
    public List<Plant> getAllPlants() {
        return plantService.getAllPlants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlantById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(plantService.getPlantById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public Plant addPlant(@RequestBody Plant plant) {
        return plantService.addPlant(plant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlant(@PathVariable Integer id, @RequestBody Plant updates) {
        try {
            return ResponseEntity.ok(plantService.updatePlant(id, updates));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlant(@PathVariable Integer id) {
        plantService.deletePlant(id);
        return ResponseEntity.ok().build();
    }
}
