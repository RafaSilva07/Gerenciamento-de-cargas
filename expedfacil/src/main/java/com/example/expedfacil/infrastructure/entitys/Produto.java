package com.example.expedfacil.infrastructure.entitys;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="produto")
@Entity

public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "codigo", unique = true, nullable = false, length = 9)
    private String codigo;

    @Column(name="descricao", nullable = false)
    private String descricao;
}
