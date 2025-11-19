package com.example.expedfacil.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import com.example.expedfacil.infrastructure.projection.RomaneioResumoProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.expedfacil.infrastructure.entitys.Romaneio;
import org.springframework.data.jpa.repository.Query;

public interface RomaneioRepository extends JpaRepository<Romaneio, Long> {

    // Buscar por número de embarque (para validar unicidade)
    Optional<Romaneio> findByNumeroEmbarque(String numeroEmbarque);

    @Query("""
    SELECT r.id AS id,
           r.numeroEmbarque AS numeroEmbarque,
           r.transportadora AS transportadora,
           r.motorista AS motorista,
           r.placa AS placa
    FROM Romaneio r
    """)
    Page<RomaneioResumoProjection> listarResumo(Pageable pageable);


}
