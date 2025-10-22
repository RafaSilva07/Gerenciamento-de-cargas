package com.example.expedfacil.infrastructure.entitys;


import com.example.expedfacil.infrastructure.entitys.enums.TipoUnidadeProduto;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(
            regexp = "^\\d{6}\\.\\d{2}$",                   // regra do formato do código
            message = "O código deve seguir o formato 000000.00 (6 dígitos, ponto e 2 dígitos)."
    )
    private String codigo;

    @Column(name="descricao", nullable = false)
    private String descricao;

    @Column(name="quantPorPalete", nullable = false)
    @Min(1)
    private short quantPorPalete;                       // Quantidade por palete que fica armazenado no estoque

    @Column(name="undiadesPorCxFd", nullable = false)
    private short unidadesPorCxFd;

    @Enumerated(EnumType.STRING)
    @Column(name ="tipoUnidade", nullable = false)
    private TipoUnidadeProduto tipoUnidade;
}
