package com.example.expedfacil.bussiness;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.expedfacil.bussiness.exception.ConflitoException;
import com.example.expedfacil.infrastructure.entitys.Entrega;
import com.example.expedfacil.infrastructure.entitys.ProdutoEntrega;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EntregaService {

    private final ProdutoEntregaService produtoEntregaService;


    public void prepararEntregas(List<Entrega> entregas) {

        if (entregas == null || entregas.isEmpty()) {
            throw new ConflitoException("O romaneio deve conter ao menos uma entrega.");
        }

        Set<Integer> ordensUsadas = new HashSet<>();

        for (Entrega entrega : entregas) {

            // Validar ordem de carregamento única
            if (!ordensUsadas.add(entrega.getOrdemCarregamento())) {
                throw new ConflitoException(
                        "A ordem de carregamento '" + entrega.getOrdemCarregamento()
                                + "' está duplicada dentro do romaneio.");
            }

            entrega.setEstadoDestino(entrega.getEstadoDestino().toUpperCase());

            if (entrega.getPesoBruto() < 0 || entrega.getPesoLiquido() < 0) {
                throw new ConflitoException("Peso bruto e líquido devem ser iguais ou maiores que zero.");
            }

            // Preparar produtos (valida código, preenche descrição e unidade)
            List<ProdutoEntrega> produtos = entrega.getProdutos();
            produtoEntregaService.prepararProdutosDaEntrega(produtos);

            // vinculando cada produto à entrega
            for (ProdutoEntrega produto : produtos) {
                produto.setEntrega(entrega);
            }

            // Calcular total de caixas (soma das quantidades)
            int totalCaixas = produtos.stream()
                    .mapToInt(ProdutoEntrega::getQuantidade)
                    .sum();

            entrega.setTotalCaixas(totalCaixas);
        }
    }
}
