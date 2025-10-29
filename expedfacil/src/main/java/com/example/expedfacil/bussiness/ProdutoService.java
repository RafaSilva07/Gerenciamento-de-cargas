package com.example.expedfacil.bussiness;

import com.example.expedfacil.bussiness.exception.ConflitoException;
import com.example.expedfacil.bussiness.exception.RecursoNaoEncontradoException;
import com.example.expedfacil.infrastructure.entitys.Produto;
import com.example.expedfacil.infrastructure.repository.ProdutoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.repository = produtoRepository;
    }

    public void salvarProduto(Produto produto) {

        if (repository.existsByCodigo(produto.getCodigo())) {
            throw new ConflitoException("Já existe um produto com o código '" + produto.getCodigo() + "'");
        }
        try {
            repository.saveAndFlush(produto);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {       //Se outra transação inseriu o mesmo código entre o IF e o SAVE
            throw new ConflitoException("Já existe um produto com o código '" + produto.getCodigo() + "'");
        }

    }

    public Produto buscarProdutoPorCodigo(String codigo) {
        return repository.findByCodigo(codigo)
                .orElseThrow(
                () -> new RecursoNaoEncontradoException("Código "+ codigo +" não encontrado")   // Exceçao Personalizada
        );
    }

    @Transactional
    public void deletarProdutoPorCodigo(String codigo) {
        var produto = repository.findByCodigo(codigo)
                .orElseThrow(
                        () -> new RecursoNaoEncontradoException("Produto com código '" + codigo + "' não foi encontrado para exclusão.")
                );
        repository.delete(produto);
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

    public Map<String, Object> pesquisarProdutos(String q, Pageable pageable) {
        // Se o parâmetro 'q' (termo de busca) vier vazio, lista todos os produtos
        if (q == null || q.isBlank()) {
            Page<Produto> page = repository.findAll(pageable);
            return Map.of(
                    "mensagem", "Listando todos os produtos.",
                    "resultado", page
            );
        }
        Page<Produto> resultados = repository.findByDescricaoContainingIgnoreCase(q.trim(), pageable);
        if (resultados.isEmpty()) {
            return Map.of(
                    "mensagem","Nenhum produto encontrado para o termo '" + q + "'.",
                    "resultado", resultados
            );
        }

        return Map.of(
                "mensagem", "Produtos encontrados para o termo '" + q + "'.",
                "resultado", resultados
        );
    }


}
