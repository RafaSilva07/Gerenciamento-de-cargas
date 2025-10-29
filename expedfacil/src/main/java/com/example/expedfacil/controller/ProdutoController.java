package com.example.expedfacil.controller;

import com.example.expedfacil.bussiness.ProdutoService;
import com.example.expedfacil.infrastructure.entitys.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping
    public ResponseEntity<Map<String, Object>> pesquisarProdutos(
        @RequestParam(required = false, name = "q") String q,
        @PageableDefault(size = 10, sort = "descricao") Pageable pageable
        ){
        Map<String, Object> pagina = produtoService.pesquisarProdutos(q, pageable);
        return ResponseEntity.ok(pagina);
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
