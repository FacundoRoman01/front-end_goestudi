import { useState } from "react";
import "../css/SearchPage.css";
import { ArrowRight, Plus } from "lucide-react";

const SearchPage = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState("Gente");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["Gente", "Empresas", "Pasantía", "Part-Time"];

  const handleSearchClick = () => {
    // Llama a la función onSearch que se le pasó como prop
    // y le pasa el valor de la búsqueda
    onSearch(searchQuery); 
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">
          GOestudi cree que cada estudiante y recién graduado merece una gran carrera.
        </h1>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <button className="tab-btn icon-btn">
            <Plus size={18} />
          </button>
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Describe lo que estás buscando..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            // También puedes agregar un evento para la tecla "Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick();
              }
            }}
          />
          <button className="search-btn" onClick={handleSearchClick}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;