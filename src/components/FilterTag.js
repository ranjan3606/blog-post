import React from 'react';
import Icon from './Icon';
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const FilterTag = ({ tag, isSelected, onClick }) => {
  return (
    <div
      onClick={() => onClick(tag)}
      className={`badge ${isSelected ? "bg-primary" : "bg-secondary"} m-1`}
      style={{
        cursor: "pointer",
        padding: "8px",
        fontSize: "0.65rem",
      }}
    >
      {tag}
    </div>
  );
};

export const SelectedTag = ({ tag, onRemove }) => {
  return (
    <span className="badge bg-primary me-1 mb-1">
      {tag}
      <span
        onClick={() => onRemove(tag)}
        style={{ marginLeft: "5px", cursor: "pointer" }}
      >
        ×
      </span>
    </span>
  );
};

export const FilterDropdown = ({ 
  open, 
  allTags, 
  selectedTags, 
  onTagSelect, 
  onClose, 
  onApply 
}) => {
  if (!open) return null;
  
  return (
    <div
      className="filter-dropdown position-absolute"
      style={{
        top: "100%",
        right: 0,
        minWidth: "250px",
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "15px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        marginTop: "5px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="m-0">Filter by Tags</h6>
        <Icon icon={faTimes} onClick={onClose} />
      </div>
      <div
        className="tag-container mb-3"
        style={{ maxHeight: "200px", overflowY: "auto" }}
      >
        {allTags.length > 0 ? (
          <div className="d-flex flex-wrap">
            {allTags.map((tag) => (
              <FilterTag 
                key={tag} 
                tag={tag} 
                isSelected={selectedTags.includes(tag)} 
                onClick={onTagSelect} 
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">No tags available</p>
        )}
      </div>
      {selectedTags.length > 0 && (
        <div className="selected-tags mb-3">
          <p className="mb-1">Selected Tags:</p>
          <div className="d-flex flex-wrap">
            {selectedTags.map((tag) => (
              <SelectedTag key={tag} tag={tag} onRemove={onTagSelect} />
            ))}
          </div>
        </div>
      )}
      <button
        className="btn btn-primary w-100"
        onClick={onApply}
      >
        Apply Filter
      </button>
    </div>
  );
};

export default FilterTag;