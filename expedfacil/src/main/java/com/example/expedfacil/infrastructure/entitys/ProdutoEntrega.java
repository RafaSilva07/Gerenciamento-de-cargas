package com.example.expedfacil.infrastructure.entitys;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "produto_entrega")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoEntrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Código informado pelo usuário (deve existir na tabela de produtos)
    @Column(nullable = false)
    private String codigoProduto;

    // Descrição buscada automaticamente pelo sistema
    @Column(nullable = false)
    private String descricao;

    // Unidade também preenchida automaticamente
    @Column(nullable = false)
    private String unidade;

    @Min(value = 1, message = "A quantidade deve ser no mínimo 1.")
    @Column(nullable = false)
    private Integer quantidade;

    // Peso bruto total já calculado (quantidade x peso unitário)
    @DecimalMin(value = "0.0", inclusive = true,
            message = "O peso bruto total deve ser maior ou igual a zero.")
    @Column(name = "peso_bruto_total", nullable = false)
    private Double pesoBrutoTotal;

    // Relacionamento com a entrega
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrega_id", nullable = false)
    private Entrega entrega;
}
