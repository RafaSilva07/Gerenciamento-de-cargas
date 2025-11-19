package com.example.expedfacil.infrastructure.entitys;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "entrega")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ordem de carregamento única por romaneio
    @Column(name = "ordem_carregamento", nullable = false)
    @Min(value = 1, message = "A ordem de carregamento deve ser um número inteiro positivo.")
    private Integer ordemCarregamento;

    @Column(name = "cidade_destino", nullable = false)
    private String cidadeDestino;

    // UF com 2 letras
    @Pattern(regexp = "^[A-Za-z]{2}$", message = "O estado deve ser uma sigla de 2 letras.")
    @Column(name = "estado_destino", nullable = false, length = 2)
    private String estadoDestino;

    // Observações opcionais
    @Column(name = "observacao_entrega")
    private String observacaoEntrega;

    @Column(name = "observacao_embarque")
    private String observacaoEmbarque;

    // Pesos
    @DecimalMin(value = "0.0", inclusive = true, message = "O peso líquido deve ser maior ou igual a zero.")
    @Column(name = "peso_liquido", nullable = false)
    private Double pesoLiquido;

    @DecimalMin(value = "0.0", inclusive = true, message = "O peso bruto deve ser maior ou igual a zero.")
    @Column(name = "peso_bruto", nullable = false)
    private Double pesoBruto;

    // Total de caixas calculado ao criar o romaneio
    @Column(name = "total_caixas", nullable = false)
    private Integer totalCaixas;

    // Relacionamento com Romaneio (muitas entregas para 1 romaneio)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "romaneio_id", nullable = false)
    @JsonBackReference
    private Romaneio romaneio;

    // Relacionamento com ProdutoEntrega (1 entrega -> N produtos)
    @OneToMany(
            mappedBy = "entrega",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<ProdutoEntrega> produtos;
}
