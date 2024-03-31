package com.hhr.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique=true)
    private String name;
    private String description;
    private Double price;

    @ManyToMany
    @JoinTable(
            name = "product_category",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonManagedReference
    private Set<Category> categories;

    @ManyToMany
    @JoinTable(
            name = "product_feature",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "feature_id")
    )
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonManagedReference
    private Set<Feature> features;

    @ManyToMany
    @JoinTable(
            name = "product_image",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "image_id")
    )
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonManagedReference
    private Set<Image> images;

    @ManyToMany
    @JoinTable(
            name = "product_related",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "product_related_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<Product> related;

    private Boolean deleted;
    private Boolean active;

}
