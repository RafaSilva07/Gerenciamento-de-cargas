package com.example.expedfacil.controller;

import com.example.expedfacil.bussiness.ProdutoService;
import com.example.expedfacil.infrastructure.entitys.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produto")
@RequiredArgsConstructor       // Anotaçao lombok para construtor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping    // Salvar
    public ResponseEntity<String> salvarProduto(@RequestBody Produto produto) {
        produtoService.salvarProduto(produto);
        return ResponseEntity.ok().body("O Produto: " + produto.getCodigo() + " , foi salvo com sucesso!");
    }

    @GetMapping    // Listar Todos os Produtos
    public ResponseEntity<List<Produto>> buscarProdutos() {
        List<Produto> produtos = produtoService.buscarProdutos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{codigo}")    // Buscar Produto po Codigo
    public ResponseEntity<Produto> buscarProdutoPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(produtoService.buscarProdutoPorCodigo(codigo));
    }

    @DeleteMapping("/{codigo}")     // Deletar
    public ResponseEntity<String> excluirProdutoPorCodigo(@PathVariable String codigo) {
        produtoService.deletarProdutoPorCodigo(codigo);
        return ResponseEntity.ok().body("O produto " + codigo + " foi removido com sucesso!");
    }

    @PutMapping         // Atualizar produto
    public ResponseEntity<String> atualizarProdutoPorCodigo(@RequestParam String codigo,
                                                          @RequestBody Produto produto) {
        produtoService.atualizarProdutoPorCodigo(codigo, produto);
        return ResponseEntity.ok().body("O Produto " + codigo + " foi atualizado com sucesso!");
    }

}
