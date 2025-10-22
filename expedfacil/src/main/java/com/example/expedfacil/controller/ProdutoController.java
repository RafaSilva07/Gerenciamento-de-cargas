package com.example.expedfacil.controller;

import com.example.expedfacil.bussiness.ProdutoService;
import com.example.expedfacil.infrastructure.entitys.Produto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/produto")
@RequiredArgsConstructor       // Anotaçao lombok para construtor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<Void> salvarProduto(@RequestBody Produto produto) {
        produtoService.salvarProduto(produto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<Produto> buscarProdutoPorCodigo(@PathVariable String codigo) {
        return ResponseEntity.ok(produtoService.buscarProdutoPorCodigo(codigo));
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluirProdutoPorCodigo(@PathVariable String codigo) {
        produtoService.deletarProdutoPorCodigo(codigo);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarProdutoPorCodigo(@RequestParam String codigo,
                                                          @RequestBody Produto produto) {
        produtoService.atualizarProdutoPorCodigo(codigo, produto);
        return ResponseEntity.ok().build();
    }


}
