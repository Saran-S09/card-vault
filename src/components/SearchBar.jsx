import { Search } from "lucide-react";
import { CATEGORIES } from "../utils/constants";

function SearchBar({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Search Input and Sort Select */}
      <div className="controls-row">
        <div className="search-box-wrapper">
          <Search />
          <input
            className="search-input"
            type="text"
            placeholder="Search by title, number, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Date Added: Newest</option>
          <option value="oldest">Date Added: Oldest</option>
          <option value="alphabetical">Name: A to Z</option>
        </select>
      </div>

      {/* Category Selection Filter Pills */}
      <div className="filter-pills">
        <button
          className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
          style={selectedCategory === "all" ? { "--accent-color": "var(--accent-blue)" } : {}}
        >
          All Categories
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={selectedCategory === cat.id ? { "--accent-color": cat.color } : {}}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;