import { useState, useEffect } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'scooper2024';

function ModalAuth({ abierto, modo, onClose, onLoginUsuario, onLoginAdmin, onRegistro, usuarios }) {
    const [vista, setVista]           = useState(modo || 'login');
    const [error, setError]           = useState('');

    // Login
    const [loginUsuario, setLoginUsuario] = useState('');
    const [loginPass, setLoginPass]       = useState('');

    // Signup
    const [signUsuario, setSignUsuario] = useState('');
    const [signEmail, setSignEmail]     = useState('');
    const [signPass, setSignPass]       = useState('');
    const [signConfirm, setSignConfirm] = useState('');

    useEffect(() => {
        if (abierto) {
            setVista(modo || 'login');
            setError('');
            setLoginUsuario(''); setLoginPass('');
            setSignUsuario(''); setSignEmail(''); setSignPass(''); setSignConfirm('');
        }
    }, [abierto, modo]);

    useEffect(() => {
        function handleKey(e) { if (e.key === 'Escape') onClose(); }
        if (abierto) document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [abierto, onClose]);

    if (!abierto) return null;

    function cambiarVista(nueva) { setVista(nueva); setError(''); }

    function handleLogin(e) {
        e.preventDefault();
        // Credenciales de admin
        if (loginUsuario === ADMIN_USER && loginPass === ADMIN_PASS) {
            onLoginAdmin();
            onClose();
            return;
        }
        // Usuario registrado
        const usuario = usuarios.find(
            u => u.usuario === loginUsuario && u.contrasena === loginPass
        );
        if (usuario) {
            onLoginUsuario(usuario);
            onClose();
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    }

    function handleSignup(e) {
        e.preventDefault();
        if (signPass !== signConfirm) { setError('Las contraseñas no coinciden'); return; }
        if (usuarios.find(u => u.usuario === signUsuario)) { setError('Ese usuario ya existe'); return; }
        onRegistro({ usuario: signUsuario, email: signEmail, contrasena: signPass });
        onClose();
    }

    return (
        <div className="modal" style={{ display: 'block' }} role="dialog" aria-modal="true">
            <div className="modal-overlay" onClick={onClose} />
            <div className="auth-modal-content">
                <button className="cerrar auth-cerrar" onClick={onClose} aria-label="Cerrar">&times;</button>

                <div className="auth-modal-header">
                    <span className="auth-modal-logo">SCOOPER</span>
                    <h2 className="auth-modal-titulo">
                        {vista === 'login' ? 'Ingresar' : 'Crear cuenta'}
                    </h2>
                </div>

                {vista === 'login' ? (
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-campo">
                            <label>Usuario</label>
                            <input type="text" value={loginUsuario}
                                onChange={e => { setLoginUsuario(e.target.value); setError(''); }}
                                required autoFocus autoComplete="username" />
                        </div>
                        <div className="auth-campo">
                            <label>Contraseña</label>
                            <input type="password" value={loginPass}
                                onChange={e => { setLoginPass(e.target.value); setError(''); }}
                                required autoComplete="current-password" />
                        </div>
                        {error && <p className="auth-error">{error}</p>}
                        <button type="submit" className="btn-auth-submit">Ingresar</button>
                        <p className="auth-toggle">
                            ¿No tenés cuenta?{' '}
                            <button type="button" onClick={() => cambiarVista('signup')}>Crear una</button>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="auth-form">
                        <div className="auth-campo">
                            <label>Usuario</label>
                            <input type="text" value={signUsuario}
                                onChange={e => { setSignUsuario(e.target.value); setError(''); }}
                                required autoFocus autoComplete="username" />
                        </div>
                        <div className="auth-campo">
                            <label>Email</label>
                            <input type="email" value={signEmail}
                                onChange={e => { setSignEmail(e.target.value); setError(''); }}
                                required autoComplete="email" />
                        </div>
                        <div className="auth-campo">
                            <label>Contraseña</label>
                            <input type="password" value={signPass}
                                onChange={e => { setSignPass(e.target.value); setError(''); }}
                                required autoComplete="new-password" />
                        </div>
                        <div className="auth-campo">
                            <label>Confirmar contraseña</label>
                            <input type="password" value={signConfirm}
                                onChange={e => { setSignConfirm(e.target.value); setError(''); }}
                                required autoComplete="new-password" />
                        </div>
                        {error && <p className="auth-error">{error}</p>}
                        <button type="submit" className="btn-auth-submit">Crear cuenta</button>
                        <p className="auth-toggle">
                            ¿Ya tenés cuenta?{' '}
                            <button type="button" onClick={() => cambiarVista('login')}>Ingresar</button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ModalAuth;
