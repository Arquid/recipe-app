// src/components/SearchForm.jsx
import { Search } from "lucide-react";
import { CUISINES, SORT_OPTIONS } from "../constants";

export default function SearchForm({
  dishQuery, onDishQueryChange,
  ingredientsQuery, onIngredientsQueryChange,
  cuisine, onCuisineChange,
  sort, onSortChange,
  onSubmit,
}) {
  return (
    <form className="rs-form" onSubmit={onSubmit}>
      <div className="rs-field">
        <label htmlFor="dish">Dish name</label>
        <input
          id="dish"
          type="text"
          placeholder="e.g. lasagna"
          value={dishQuery}
          onChange={(e) => onDishQueryChange(e.target.value)}
        />
      </div>
      <div className="rs-field">
        <label htmlFor="ingredients">Ingredients</label>
        <input
          id="ingredients"
          type="text"
          placeholder="e.g. chicken, spinach"
          value={ingredientsQuery}
          onChange={(e) => onIngredientsQueryChange(e.target.value)}
        />
      </div>
      <div className="rs-field">
        <label htmlFor="cuisine">Cuisine</label>
        <select id="cuisine" value={cuisine} onChange={(e) => onCuisineChange(e.target.value)}>
          <option value="">Any cuisine</option>
          {CUISINES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="rs-field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <button className="rs-submit" type="submit">
        <Search size={16} /> Search
      </button>
    </form>
  );
}