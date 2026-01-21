function Footer() {
    return (
        <footer style={{
            background: 'var(--gray-900)',
            color: 'white',
            padding: '2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container text-center">
                <p style={{ color: 'var(--gray-400)', marginBottom: '0.5rem' }}>
                    © 2026 SchemeDesk - Empowering Citizens Through Technology
                </p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                    Built for India Ascends Hackathon 🇮🇳
                </p>
            </div>
        </footer>
    );
}

export default Footer;
