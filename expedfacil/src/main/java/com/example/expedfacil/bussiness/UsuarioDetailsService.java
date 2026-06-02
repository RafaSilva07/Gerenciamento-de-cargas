package com.example.expedfacil.bussiness;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.expedfacil.infrastructure.entitys.Usuario;
import com.example.expedfacil.infrastructure.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Integer matricula;
        try {
            matricula = Integer.valueOf(username);
        } catch (NumberFormatException e) {
            throw new UsernameNotFoundException("Matricula invalida.");
        }

        Usuario usuario = usuarioRepository.findByMatriculaAndAtivoTrue(matricula)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado."));

        return new User(
                String.valueOf(usuario.getMatricula()),
                usuario.getSenhaHash(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().name()))
        );
    }
}
