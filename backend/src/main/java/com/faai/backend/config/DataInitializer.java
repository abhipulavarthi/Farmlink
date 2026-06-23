package com.faai.backend.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.faai.backend.model.Plant;
import com.faai.backend.model.Recipe;
import com.faai.backend.repository.PlantRepository;
import com.faai.backend.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Plants
        if (plantRepository.count() == 0) {
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<Plant>> typeReference = new TypeReference<List<Plant>>(){};
            try (InputStream inputStream = getClass().getResourceAsStream("/plants.json")) {
                if (inputStream == null) {
                    System.out.println("Could not find plants.json in resources!");
                } else {
                    List<Plant> plants = mapper.readValue(inputStream, typeReference);
                    plantRepository.saveAll(plants);
                    System.out.println("Successfully saved " + plants.size() + " initial plants to the database!");
                }
            } catch (Exception e) {
                System.out.println("Unable to save plants: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Plants table already has data. Skipping initialization.");
        }

        // 2. Seed Recipes
        if (recipeRepository.count() == 0) {
            try {
                List<Plant> plants = plantRepository.findAll();
                String[] productsList = {
                    "Tomatoes", "Potatoes", "Spinach", "Mangoes", "Carrots",
                    "Apples", "Bananas", "Strawberries", "Onions", "Garlic",
                    "Grapes", "Oranges", "Strawberries", "Watermelon", "Pineapple",
                    "Blueberries", "Raspberries", "Pomegranate", "Kiwi", "Papaya",
                    "Guava", "Pear", "Peach", "Cherry", "Avocado", "Lemons"
                };
                String[] types = {
                    "Curry", "Salad", "Stew", "Pasta", "Roast", "Stir-fry",
                    "Soup", "Sauté", "Bake", "Grill", "Smoothie", "Tart",
                    "Sorbet", "Parfait", "Chutney", "Glazed"
                };
                String[] methods = {
                    "Slow cooked", "Zesty", "Spicy", "Garlic butter", "Creamy",
                    "Fresh", "Traditional", "Quick", "Oven-baked", "Pan-seared",
                    "Honey-infused", "Cinnamon-spiced", "Chilled", "Caramelized"
                };
                String[] origins = {"Mediterranean", "Indian", "Italian", "French", "Mexican", "Asian Fusion", "Country Style"};

                List<Recipe> recipesToSave = new ArrayList<>();
                Random random = new Random(42); // Seed to make it deterministic

                for (int i = 0; i < 200; i++) {
                    String mainIng = productsList[i % productsList.length];
                    String type = types[random.nextInt(types.length)];
                    String method = methods[random.nextInt(methods.length)];
                    String origin = origins[random.nextInt(origins.length)];

                    String finalMainIng = mainIng;
                    Plant matchingPlant = plants.stream()
                        .filter(p -> finalMainIng.toLowerCase().contains(p.getName().toLowerCase()) ||
                                     p.getName().toLowerCase().contains(finalMainIng.toLowerCase()))
                        .findFirst()
                        .orElse(null);
                    String category = matchingPlant != null ? matchingPlant.getCategory() : "Other";

                    Recipe recipe = new Recipe();
                    recipe.setName(method + " " + mainIng + " " + type);
                    recipe.setOfficialType(type + " / " + origin);
                    recipe.setCategory(category);
                    recipe.setAlsoKnownAs(method + " Style " + mainIng);
                    recipe.setOrigin(origin);
                    recipe.setDifficultyRating((i % 5) + 1);
                    recipe.setDescription("A sophisticated " + method.toLowerCase() + " dish featuring farm-fresh " + mainIng.toLowerCase() + ". Perfect for those seeking a balance of " + origin.toLowerCase() + " flavors and local ingredients.");
                    recipe.setMainIngredient(mainIng);
                    recipe.setPrepTime((15 + (i * 3) % 45) + " mins");
                    recipe.setServes((2 + (i % 4)) + " people");
                    recipe.setDifficulty(i % 3 == 0 ? "Easy" : i % 3 == 1 ? "Medium" : "Hard");
                    recipe.setImage("https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600");

                    recipe.setInstructions(Arrays.asList(
                        "Carefully wash and prepare your fresh " + mainIng.toLowerCase() + ".",
                        "Heat a heavy-bottomed pan with a blend of olive oil and butter.",
                        "Sauté aromatics until they release their natural oils and turn golden.",
                        "Incorporate the " + mainIng.toLowerCase() + " and toss gently to coat.",
                        "Simmer for " + (10 + (i % 20)) + " minutes, allowing flavors to meld.",
                        "Season with sea salt, cracked pepper, and fresh garden herbs."
                    ));

                    recipe.setIngredients(Arrays.asList(
                        "500g Fresh " + mainIng,
                        "High-quality cold-pressed oil",
                        "Aromatics (Onion, Garlic, Ginger)",
                        "Seasonal spice blend",
                        "Filtered water or vegetable stock",
                        "Freshly harvested herbs for garnish"
                    ));

                    recipe.setChefTip("The secret to this dish lies in the temperature of the pan. Let the ingredients sear before stirring to lock in the field-fresh sweetness.");

                    recipesToSave.add(recipe);
                }
                recipeRepository.saveAll(recipesToSave);
                System.out.println("Successfully generated and saved 200 initial recipes to the database!");
            } catch (Exception e) {
                System.out.println("Unable to generate/save recipes: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Recipes table already has data. Skipping initialization.");
        }
    }
}
