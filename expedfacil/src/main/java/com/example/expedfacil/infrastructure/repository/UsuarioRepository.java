package com.example.expedfacil.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.expedfacil.infrastructure.entitys.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByMatriculaAndAtivoTrue(Integer matricula);

    boolean existsByMatricula(Integer matricula);

    Page<Usuario> findByAtivoTrue(Pageable pageable);
}
