import "../css/LoadingSpinner.css"

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p>Cargando...</p>
        </div>
    );
};

export default LoadingSpinner;