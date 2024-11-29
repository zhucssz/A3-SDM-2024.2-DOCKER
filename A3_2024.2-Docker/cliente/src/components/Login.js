import React, { useState } from 'react';
import { login } from '../api';
import '../css/Login.css'

function Login({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(usuario, senha);

            if (response.success) {
                onLogin();
            } else {
                alert(response.message || 'Login falhou. Verifique suas credenciais.');
            }
        } catch (error) {
            console.error('Erro do login:', error);
            alert('Falha ao realizar o login. Tente novamente.');
        }
    };

    return (
        <div>
            <div id="login-div"></div>
            <div className="login-container loginclass">
                <h2 className="loginclass">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        placeholder="Usuário"
                        required
                        className="loginclass"
                    />
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
                        required
                        className="loginclass"
                    />
                    <button type="submit">Logar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
