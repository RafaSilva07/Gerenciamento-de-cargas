package com.example.expedfacil.infrastructure.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.expedfacil.infrastructure.entitys.Romaneio;

public interface RomaneioRepository extends JpaRepository<Romaneio, Long> {

    // Buscar por número de embarque (para validar unicidade)
    Optional<Romaneio> findByNumeroEmbarque(String numeroEmbarque);
}
