package com.example.expedfacil.controller;

import java.util.List;

import com.example.expedfacil.infrastructure.projection.RomaneioResumoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.expedfacil.bussiness.RomaneioService;
import com.example.expedfacil.infrastructure.entitys.Romaneio;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/romaneio")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RomaneioController {

    private final RomaneioService romaneioService;

    @PostMapping
    public ResponseEntity<Romaneio> criar(@RequestBody Romaneio romaneio) {
        Romaneio criado = romaneioService.criar(romaneio);
        return ResponseEntity.ok(criado);
    }

    @GetMapping
    public ResponseEntity<Page<RomaneioResumoProjection>> listarPaginado(
            @PageableDefault(size = 10) Pageable pageable) {

        return ResponseEntity.ok(romaneioService.listarResumo(pageable));
    }



    @GetMapping("/{id}")
    public ResponseEntity<Romaneio> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(romaneioService.buscarPorId(id));
    }

    @GetMapping("/numero/{numeroEmbarque}")
    public ResponseEntity<Romaneio> buscarPorNumero(@PathVariable String numeroEmbarque) {
        return ResponseEntity.ok(romaneioService.buscarPorNumero(numeroEmbarque));
    }


    @PutMapping("/numero/{numeroEmbarque}/observacao")
    public ResponseEntity<String> editarObservacao(
            @PathVariable String numeroEmbarque,
            @RequestBody String observacao) {

        romaneioService.editarObservacaoPorNumero(numeroEmbarque, observacao);
        return ResponseEntity.ok("Observação atualizada com sucesso.");
    }



    @DeleteMapping("/numero/{numeroEmbarque}")
    public ResponseEntity<String> deletar(@PathVariable String numeroEmbarque) {
        romaneioService.deletarPorNumero(numeroEmbarque);
        return ResponseEntity.ok("Romaneio deletado com sucesso.");

    }

}
