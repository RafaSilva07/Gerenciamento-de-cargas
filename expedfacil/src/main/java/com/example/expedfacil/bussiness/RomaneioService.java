package com.example.expedfacil.bussiness;

import java.time.LocalDateTime;
import java.util.List;

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

        // Salva o romaneio com entregas e produtos (cascade)
        return romaneioRepository.save(romaneio);
    }


    public List<Romaneio> listarSimples() {
        return romaneioRepository.findAll();
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
}
