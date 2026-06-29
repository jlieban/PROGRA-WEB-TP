import { useState } from 'react';

function LoginAdmin({ onLogin, onCancelar }) {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (usuario === 'admin' && contrasena === 'scooper2024') {
            onLogin();
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    }

    return (
        <div className="login-overlay">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo">SCOOPER</span>
                    <p className="login-subtitulo">Acceso administrativo</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-campo">
                        <label htmlFor="login-usuario">Usuario</label>
                        <input
                            id="login-usuario"
                            type="text"
                            value={usuario}
                            onChange={e => { setUsuario(e.target.value); setError(''); }}
                            autoFocus
                            autoComplete="username"
                        />
                    </div>
                    <div className="login-campo">
                        <label htmlFor="login-contrasena">Contraseña</label>
                        <input
                            id="login-contrasena"
                            type="password"
                            value={contrasena}
                            onChange={e => { setContrasena(e.target.value); setError(''); }}
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-acciones">
                        <button type="submit" className="btn-login">Ingresar</button>
                        <button type="button" className="btn-login-cancelar" onClick={onCancelar}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginAdmin;
