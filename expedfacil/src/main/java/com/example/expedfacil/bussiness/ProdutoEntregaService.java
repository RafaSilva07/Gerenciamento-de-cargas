package com.example.expedfacil.bussiness;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.expedfacil.bussiness.exception.ConflitoException;
import com.example.expedfacil.infrastructure.entitys.Produto;
import com.example.expedfacil.infrastructure.entitys.ProdutoEntrega;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoEntregaService {

    private final ProdutoService produtoService;

    /**
     *  - valida código
     *  - busca produto cadastrado
     *  - preenche descrição e unidade automaticamente
     */
    public void prepararProdutosDaEntrega(List<ProdutoEntrega> produtosEntrega) {

        if (produtosEntrega == null || produtosEntrega.isEmpty()) {
            throw new ConflitoException("A entrega deve conter pelo menos um produto.");
        }

        for (ProdutoEntrega item : produtosEntrega) {

            if (item.getCodigoProduto() == null || item.getCodigoProduto().isBlank()) {
                throw new ConflitoException("Todos os itens devem possuir código de produto.");
            }

            // Busca na API de produtos
            Produto produto = produtoService.buscarProdutoPorCodigo(item.getCodigoProduto());


            item.setDescricao(produto.getDescricao());
            item.setUnidade(produto.getTipoUnidade().name());

        }
    }
}
