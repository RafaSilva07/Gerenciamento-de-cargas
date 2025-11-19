package com.example.expedfacil.bussiness;

import java.time.LocalDateTime;
import java.util.List;

import com.example.expedfacil.infrastructure.entitys.Entrega;
import com.example.expedfacil.infrastructure.projection.RomaneioResumoProjection;
import org.springframework.stereotype.Service;

import com.example.expedfacil.bussiness.exception.ConflitoException;
import com.example.expedfacil.bussiness.exception.RecursoNaoEncontradoException;
import com.example.expedfacil.infrastructure.entitys.Romaneio;
import com.example.expedfacil.infrastructure.repository.RomaneioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RomaneioService {

    private final RomaneioRepository romaneioRepository;
    private final EntregaService entregaService;

    public Romaneio criar(Romaneio romaneio) {

        validarNumeroEmbarqueUnico(romaneio.getNumeroEmbarque());

        romaneio.setDataCriacao(LocalDateTime.now());

        // Prepara cada entrega antes de salvar
        entregaService.prepararEntregas(romaneio.getEntregas());

        for (Entrega entrega : romaneio.getEntregas()) {
            entrega.setRomaneio(romaneio);
        }

        // Salva o romaneio com entregas e produtos (cascade)
        return romaneioRepository.save(romaneio);
    }


    public List<Romaneio> listarSimples() {
        return romaneioRepository.findAll();
    }

    public List<RomaneioResumoProjection> listarResumo() {
        return romaneioRepository.listarResumo();
    }

    public Romaneio buscarPorId(Long id) {
        return romaneioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Romaneio não encontrado para o ID " + id));
    }


    public void editarObservacao(Long id, String novaObs) {
        Romaneio romaneio = buscarPorId(id);
        romaneio.setObservacaoEmbarque(novaObs);
        romaneioRepository.save(romaneio);
    }


    public void deletar(Long id) {
        if (!romaneioRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Romaneio não encontrado para o ID " + id);
        }
        romaneioRepository.deleteById(id);
    }

    private void validarNumeroEmbarqueUnico(String numeroEmbarque) {
        if (romaneioRepository.findByNumeroEmbarque(numeroEmbarque).isPresent()) {
            throw new ConflitoException("O número de embarque já está cadastrado: " + numeroEmbarque);
        }
    }

    public Romaneio buscarPorNumero(String numeroEmbarque) {
        return romaneioRepository.findByNumeroEmbarque(numeroEmbarque)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Não existe romaneio com número de embarque " + numeroEmbarque
                ));
    }

    public void editarObservacaoPorNumero(String numeroEmbarque, String novaObs) {
        Romaneio romaneio = buscarPorNumero(numeroEmbarque);
        romaneio.setObservacaoEmbarque(novaObs);
        romaneioRepository.save(romaneio);
    }

    public void deletarPorNumero(String numeroEmbarque) {
        Romaneio romaneio = buscarPorNumero(numeroEmbarque);
        romaneioRepository.delete(romaneio);
    }




}
