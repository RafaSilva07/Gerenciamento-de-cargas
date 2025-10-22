package com.example.expedfacil.infrastructure.repository;

import com.example.expedfacil.infrastructure.entitys.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProdutoRepository  extends JpaRepository<Produto, Long> {

    Optional<Produto> findByCodigo(String codigo);

     void deleteByCodigo(String codigo);
}
