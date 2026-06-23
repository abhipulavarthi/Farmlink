package com.faai.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plant {
    @Id
    private Integer id;

    private String name;
    private String officialName;
    private String alsoKnownAs;
    private String origin;
    private String climate;
    private Integer difficulty;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String info;

    @Column(columnDefinition = "TEXT")
    private String howToPlant;

    private String growthTime;

    @Column(columnDefinition = "TEXT")
    private String diseases;

    @Column(columnDefinition = "TEXT")
    private String prevention;

    private String growingSeason;
}
