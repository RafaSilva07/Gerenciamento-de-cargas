package com.example.expedfacil.bussiness;

import com.example.expedfacil.infrastructure.entitys.Produto;
import com.example.expedfacil.infrastructure.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.repository = produtoRepository;
    }

    public void salvarProduto(Produto produto) {
        repository.saveAndFlush(produto);
    }

    public Produto buscarProdutoPorCodigo(String codigo) {
        return repository.findByCodigo(codigo).orElseThrow(
                () -> new RuntimeException("Código não encontrado")   // Exceçao Personalizada
        );
    }

    @Transactional
    public void deletarProdutoPorCodigo(String codigo) {
        repository.deleteByCodigo(codigo);
    }

    public void atualizarProdutoPorCodigo(String codigo, Produto produto) {
        Produto produtoEntity = buscarProdutoPorCodigo(codigo);
        Produto produtoAtualizado = Produto.builder()
                .codigo(codigo)
                .descricao(produto.getDescricao() != null ?
                            produto.getDescricao() : produtoEntity.getDescricao())
                .id(produtoEntity.getId())
                .build();

        repository.saveAndFlush(produtoAtualizado);
    }
}
