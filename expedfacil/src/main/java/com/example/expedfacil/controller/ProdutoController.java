package com.example.expedfacil.controller;

import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.expedfacil.bussiness.ProdutoService;
import com.example.expedfacil.infrastructure.entitys.Produto;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
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

    @PutMapping("/{codigo}")       // Atualizar produto
    public ResponseEntity<String> atualizarProdutoPorCodigo(@PathVariable String codigo,
                                                          @RequestBody Produto produto) {
        produtoService.atualizarProdutoPorCodigo(codigo, produto);
        return ResponseEntity.ok().body("O Produto " + codigo + " foi atualizado com sucesso!");
    }

}
