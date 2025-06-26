import { useState, useEffect } from 'react';

export default function App() {
  // Estados para manejar la aplicación
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda actual
  const [pokemon, setPokemon] = useState(null); // Datos del Pokémon encontrado
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(''); // Mensaje de error
  const [hasSearched, setHasSearched] = useState(false); // Para saber si ya se hizo una búsqueda

  // Función para buscar el Pokémon en la API
  const searchPokemon = async (name) => {
    if (!name.trim()) {
      setPokemon(null);
      setError('');
      setHasSearched(false);
      return;
    }

    setLoading(true); // Activamos el estado de carga
    setError(''); // Limpiamos errores previos
    setHasSearched(true); // Marcamos que se hizo una búsqueda

    try {
      // Petición a la API de Pokémon
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error('Pokemon no encontrado');
      }

      const data = await response.json();
      
      // Guardamos los datos del Pokémon
      setPokemon({
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
        id: data.id,
        types: data.types.map(type => type.type.name),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map(ability => ability.ability.name)
      });
    } catch (err) {
      setError(err.message);
      setPokemon(null);
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  // useEffect para buscar automáticamente cuando cambia el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      searchPokemon(searchTerm);
    }, 500); // Esperamos 500ms después de que el usuario deje de escribir

    // Cleanup function para cancelar el timer anterior
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Función para manejar el cambio en el input
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="app">
      {/* Header con título y descripción */}
      <header className="header">
        <h1 className="title">
          <span className="pokeball">⚡</span>
          Pokédex Buscador
          <span className="pokeball">⚡</span>
        </h1>
        <p className="subtitle">Descubre información sobre tu Pokémon favorito</p>
      </header>

      {/* Formulario de búsqueda */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Escribe el nombre de un Pokémon..."
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>

      {/* Contenedor de resultados */}
      <div className="results-container">
        {loading && (
          <div className="loading">
            <div className="pokeball-spinner"></div>
            <p>Buscando Pokémon...</p>
          </div>
        )}

        {error && hasSearched && (
          <div className="error">
            <div className="error-icon">❌</div>
            <h3>{error}</h3>
            <p>Intenta con otro nombre</p>
          </div>
        )}

        {pokemon && !loading && (
          <div className="pokemon-card">
            <div className="pokemon-header">
              <h2 className="pokemon-name">{pokemon.name}</h2>
              <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
            </div>
            
            <div className="pokemon-image-container">
              <img 
                src={pokemon.image} 
                alt={pokemon.name}
                className="pokemon-image"
              />
            </div>

            <div className="pokemon-info">
              <div className="pokemon-types">
                {pokemon.types.map((type, index) => (
                  <span key={index} className={`type type-${type}`}>
                    {type}
                  </span>
                ))}
              </div>

              <div className="pokemon-stats">
                <div className="stat">
                  <span className="stat-label">Altura:</span>
                  <span className="stat-value">{(pokemon.height / 10).toFixed(1)}m</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Peso:</span>
                  <span className="stat-value">{(pokemon.weight / 10).toFixed(1)}kg</span>
                </div>
              </div>

              <div className="pokemon-abilities">
                <h4>Habilidades:</h4>
                <div className="abilities-list">
                  {pokemon.abilities.map((ability, index) => (
                    <span key={index} className="ability">
                      {ability}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="welcome">
            <div className="welcome-icon">🌟</div>
            <h3>¡Bienvenido al Pokédex!</h3>
            <p>Comienza escribiendo el nombre de un Pokémon para descubrir su información</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .title {
          color: white;
          font-size: 3rem;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .pokeball {
          font-size: 2.5rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .subtitle {
          color: rgba(255,255,255,0.9);
          font-size: 1.2rem;
          margin: 0;
        }

        .search-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 500px;
        }

        .search-input {
          width: 100%;
          padding: 1rem 3rem 1rem 1.5rem;
          border: none;
          border-radius: 25px;
          font-size: 1.1rem;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          outline: none;
        }

        .search-input:focus {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          background: white;
        }

        .search-icon {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: #666;
        }

        .results-container {
          display: flex;
          justify-content: center;
          min-height: 400px;
        }

        .loading {
          text-align: center;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .pokeball-spinner {
          width: 60px;
          height: 60px;
          border: 6px solid rgba(255,255,255,0.3);
          border-top: 6px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error {
          text-align: center;
          color: white;
          background: rgba(255,0,0,0.1);
          padding: 2rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .welcome {
          text-align: center;
          color: white;
          background: rgba(255,255,255,0.1);
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .pokemon-card {
          background: rgba(255,255,255,0.95);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.3);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pokemon-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .pokemon-name {
          font-size: 2rem;
          margin: 0;
          color: #333;
          text-transform: capitalize;
          font-weight: bold;
        }

        .pokemon-id {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-weight: bold;
        }

        .pokemon-image-container {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .pokemon-image {
          width: 200px;
          height: 200px;
          object-fit: contain;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
          transition: transform 0.3s ease;
        }

        .pokemon-image:hover {
          transform: scale(1.05) rotate(5deg);
        }

        .pokemon-types {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .type {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          text-transform: capitalize;
          font-size: 0.9rem;
        }

        .type-normal { background: #A8A878; }
        .type-fire { background: #F08030; }
        .type-water { background: #6890F0; }
        .type-electric { background: #F8D030; }
        .type-grass { background: #78C850; }
        .type-ice { background: #98D8D8; }
        .type-fighting { background: #C03028; }
        .type-poison { background: #A040A0; }
        .type-ground { background: #E0C068; }
        .type-flying { background: #A890F0; }
        .type-psychic { background: #F85888; }
        .type-bug { background: #A8B820; }
        .type-rock { background: #B8A038; }
        .type-ghost { background: #705898; }
        .type-dragon { background: #7038F8; }
        .type-dark { background: #705848; }
        .type-steel { background: #B8B8D0; }
        .type-fairy { background: #EE99AC; }

        .pokemon-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }

        .stat-label {
          font-weight: bold;
          color: #666;
        }

        .stat-value {
          color: #333;
          font-weight: bold;
        }

        .pokemon-abilities h4 {
          margin-bottom: 0.5rem;
          color: #333;
        }

        .abilities-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .ability {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          font-size: 0.9rem;
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 2rem;
            flex-direction: column;
            gap: 0.5rem;
          }
          .pokemon-stats {
            grid-template-columns: 1fr;
          }
          .app {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}