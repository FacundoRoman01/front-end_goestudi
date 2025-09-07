import { useState, useEffect } from "react";
import { Search, MapPin, Plus } from "lucide-react";
import "../css/SearchPage.css";

const SearchPage = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState("Trabajos");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const tabs = ["Trabajos", "Pasantía", "Part-Time"];

  const handleSearch = () => {
    let filters = {
      keyword: searchQuery,
      location: location,
      isInternship: null,
      isPartTime: null,
    };

    if (activeTab === "Pasantía") {
      filters.isInternship = true;
    } else if (activeTab === "Part-Time") {
      filters.isPartTime = true;
    }

    onSearch(filters);
  };

  useEffect(() => {
    handleSearch();
  }, [activeTab]);

  // ✅ Texto dinámico del placeholder según la pestaña activa
  const getPlaceholder = () => {
    if (activeTab === "Pasantía") return "Buscar por pasantía...";
    if (activeTab === "Part-Time") return "Buscar por part-time...";
    return "Buscar por trabajos...";
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <h1 className="search-title">
          GOestudi cree que cada estudiante y recién graduado merece una gran
          carrera.
        </h1>

        {/* Tabs */}
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

        {/* Search Section */}
        <div className="search-section">
          <div className="search-form">
            {/* Job Search Input */}
            <div className="input-container">
              <Search className="input-icon" />
              <input
                type="text"
                placeholder={getPlaceholder()} // 👈 dinámico
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Location Input */}
            <div className="input-container">
              <MapPin className="input-icon" />
              <input
                type="text"
                placeholder="Ubicación..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="search-input"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <button onClick={handleSearch} className="search-button">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
