package com.example.expedfacil.bussiness;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.expedfacil.bussiness.exception.ConflitoException;
import com.example.expedfacil.bussiness.exception.RecursoNaoEncontradoException;
import com.example.expedfacil.controller.dto.usuario.UsuarioCreateRequest;
import com.example.expedfacil.controller.dto.usuario.UsuarioResponse;
import com.example.expedfacil.controller.dto.usuario.UsuarioSenhaUpdateRequest;
import com.example.expedfacil.controller.dto.usuario.UsuarioUpdateRequest;
import com.example.expedfacil.infrastructure.entitys.Usuario;
import com.example.expedfacil.infrastructure.entitys.enums.RoleUsuario;
import com.example.expedfacil.infrastructure.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UsuarioResponse> listarAtivos(Pageable pageable) {
        return usuarioRepository.findByAtivoTrue(pageable).map(this::toResponse);
    }

    public void criarUsuario(UsuarioCreateRequest request) {
        if (usuarioRepository.existsByMatricula(request.matricula())) {
            throw new ConflitoException("Ja existe um usuario com matricula " + request.matricula() + ".");
        }

        LocalDateTime now = LocalDateTime.now();

        Usuario usuario = Usuario.builder()
                .matricula(request.matricula())
                .nome(request.nome().trim())
                .cargo(request.cargo())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .role(RoleUsuario.USER)
                .ativo(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        usuarioRepository.save(usuario);
    }

    public void atualizarUsuario(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = buscarAtivoPorId(id);

        usuario.setNome(request.nome().trim());
        usuario.setCargo(request.cargo());

        if (request.senha() != null && !request.senha().isBlank()) {
            usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        }

        usuario.setUpdatedAt(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    public void atualizarSenha(Long id, UsuarioSenhaUpdateRequest request) {
        Usuario usuario = buscarAtivoPorId(id);
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.setUpdatedAt(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    public void desativarUsuario(Long id, Integer matriculaLogada) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado para o id " + id));

        if (!usuario.isAtivo()) {
            throw new ConflitoException("Usuario ja esta inativo.");
        }

        if (usuario.getMatricula().equals(matriculaLogada)) {
            throw new ConflitoException("Nao e permitido desativar seu proprio usuario administrador.");
        }

        usuario.setAtivo(false);
        usuario.setUpdatedAt(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    private Usuario buscarAtivoPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado para o id " + id));

        if (!usuario.isAtivo()) {
            throw new RecursoNaoEncontradoException("Usuario inativo para o id " + id);
        }

        return usuario;
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getMatricula(),
                usuario.getNome(),
                usuario.getCargo(),
                usuario.getRole(),
                usuario.isAtivo()
        );
    }
}
