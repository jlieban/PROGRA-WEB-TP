function Toast({ visible, mensaje }) {
    return (
        <div className={`toast${visible ? ' visible' : ''}`} role="status" aria-live="polite">
            {mensaje}
        </div>
    );
}

export default Toast;
