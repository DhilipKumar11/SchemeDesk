function Loader() {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
    );
}

export default Loader;
