package com.faai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String officialType;
    private String category;
    private String alsoKnownAs;
    private String origin;
    private Integer difficultyRating;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String mainIngredient;
    private String prepTime;
    private String serves;
    private String difficulty;
    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_instructions", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "instruction", columnDefinition = "TEXT")
    private List<String> instructions;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "ingredient", columnDefinition = "TEXT")
    private List<String> ingredients;

    @Column(columnDefinition = "TEXT")
    private String chefTip;
}
