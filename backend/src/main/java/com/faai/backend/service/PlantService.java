package com.faai.backend.service;

import com.faai.backend.model.Plant;
import com.faai.backend.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlantService {
    @Autowired
    private PlantRepository plantRepository;

    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }

    public Plant getPlantById(Integer id) {
        return plantRepository.findById(id).orElseThrow(() -> new RuntimeException("Plant not found"));
    }

    public Plant addPlant(Plant plant) {
        return plantRepository.save(plant);
    }

    public List<Plant> saveAllPlants(List<Plant> plants) {
        return plantRepository.saveAll(plants);
    }

    public Plant updatePlant(Integer id, Plant updates) {
        Plant plant = plantRepository.findById(id).orElseThrow(() -> new RuntimeException("Plant not found"));
        if (updates.getName() != null) plant.setName(updates.getName());
        if (updates.getOfficialName() != null) plant.setOfficialName(updates.getOfficialName());
        if (updates.getAlsoKnownAs() != null) plant.setAlsoKnownAs(updates.getAlsoKnownAs());
        if (updates.getOrigin() != null) plant.setOrigin(updates.getOrigin());
        if (updates.getClimate() != null) plant.setClimate(updates.getClimate());
        if (updates.getDifficulty() != null) plant.setDifficulty(updates.getDifficulty());
        if (updates.getCategory() != null) plant.setCategory(updates.getCategory());
        if (updates.getInfo() != null) plant.setInfo(updates.getInfo());
        if (updates.getHowToPlant() != null) plant.setHowToPlant(updates.getHowToPlant());
        if (updates.getGrowthTime() != null) plant.setGrowthTime(updates.getGrowthTime());
        if (updates.getDiseases() != null) plant.setDiseases(updates.getDiseases());
        if (updates.getPrevention() != null) plant.setPrevention(updates.getPrevention());
        if (updates.getGrowingSeason() != null) plant.setGrowingSeason(updates.getGrowingSeason());
        return plantRepository.save(plant);
    }

    public void deletePlant(Integer id) {
        plantRepository.deleteById(id);
    }
}
