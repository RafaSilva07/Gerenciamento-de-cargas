package com.example.expedfacil.infrastructure.entitys;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "romaneio")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Romaneio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Número de embarque: único, mínimo 6 dígitos, apenas números
    @Column(name = "numero_embarque", unique = true, nullable = false)
    @Pattern(regexp = "^[0-9]{6,}$", message = "O número de embarque deve ter no mínimo 6 dígitos numéricos.")
    private String numeroEmbarque;

    // Data de criação do romaneio
    @Column(name = "data_criacao", nullable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private String transportadora;

    @Column(nullable = false)
    private String motorista;

    // Placa com 7 dígitos alfanuméricos
    @Pattern(regexp = "^[A-Za-z0-9]{7}$", message = "A placa deve conter 7 caracteres alfanuméricos.")
    @Column(nullable = false, length = 7)
    private String placa;

    // Campo que pode ser editado
    @Column(name = "observacao_embarque")
    private String observacaoEmbarque;

    // Relacionamento com Entregas (1 Romaneio -> N Entregas)
    @OneToMany(
            mappedBy = "romaneio",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<Entrega> entregas;
}
