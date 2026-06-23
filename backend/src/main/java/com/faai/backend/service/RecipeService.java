package com.faai.backend.service;

import com.faai.backend.model.Recipe;
import com.faai.backend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Recipe getRecipeById(Integer id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + id));
    }

    public Recipe addRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Recipe updateRecipe(Integer id, Recipe updates) {
        Recipe recipe = getRecipeById(id);
        if (updates.getName() != null) recipe.setName(updates.getName());
        if (updates.getOfficialType() != null) recipe.setOfficialType(updates.getOfficialType());
        if (updates.getCategory() != null) recipe.setCategory(updates.getCategory());
        if (updates.getAlsoKnownAs() != null) recipe.setAlsoKnownAs(updates.getAlsoKnownAs());
        if (updates.getOrigin() != null) recipe.setOrigin(updates.getOrigin());
        if (updates.getDifficultyRating() != null) recipe.setDifficultyRating(updates.getDifficultyRating());
        if (updates.getDescription() != null) recipe.setDescription(updates.getDescription());
        if (updates.getMainIngredient() != null) recipe.setMainIngredient(updates.getMainIngredient());
        if (updates.getPrepTime() != null) recipe.setPrepTime(updates.getPrepTime());
        if (updates.getServes() != null) recipe.setServes(updates.getServes());
        if (updates.getDifficulty() != null) recipe.setDifficulty(updates.getDifficulty());
        if (updates.getImage() != null) recipe.setImage(updates.getImage());
        if (updates.getInstructions() != null) recipe.setInstructions(updates.getInstructions());
        if (updates.getIngredients() != null) recipe.setIngredients(updates.getIngredients());
        if (updates.getChefTip() != null) recipe.setChefTip(updates.getChefTip());
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(Integer id) {
        recipeRepository.deleteById(id);
    }
}
