package com.example.expedfacil.bussiness;

import com.example.expedfacil.infrastructure.entitys.Produto;
import com.example.expedfacil.infrastructure.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

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
                .id(produtoEntity.getId())
                .codigo(codigo)
                .descricao(produto.getDescricao() != null ?
                            produto.getDescricao() : produtoEntity.getDescricao())
                .quantPorPalete(produto.getQuantPorPalete() != 0 ?
                            produto.getQuantPorPalete() : produtoEntity.getQuantPorPalete())
                .unidadesPorCxFd(produtoEntity.getUnidadesPorCxFd())
                .tipoUnidade(produtoEntity.getTipoUnidade())
                .build();

        repository.saveAndFlush(produtoAtualizado);
    }

//    public Page<Produto> buscarProdutos(Pageable pageable) {
//        return repository.findAll(pageable);
//    }

    public Page<Produto> pesquisarProdutos(String q, Pageable pageable) {
        // Se o parâmetro 'q' (termo de busca) vier vazio, lista todos os produtos
        if (q == null || q.isBlank()) {
            return repository.findAll(pageable);
        }
        return repository.findByDescricaoContainingIgnoreCase(q.trim(), pageable);
    }


}
