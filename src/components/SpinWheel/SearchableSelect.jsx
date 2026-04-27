import React, { useState, useRef, useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";



const SearchableSelect = ({ courses, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses.slice(0, 10));
  const [isOpen, setIsOpen] = useState(false);
 
 
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter when typing
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setFilteredCourses(
        courses.filter((c) =>
          c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCourses(courses.slice(0, 10));
    }
  }, [searchTerm, courses]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (course) => {
    setSelectedCourse(course);
    setIsOpen(false);
    setSearchTerm("");
    if (onSelect) onSelect(course);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main selector button */}
      <button
        type="button"
        className="
          w-full flex items-center justify-between gap-3
          px-4 py-3 rounded-xl border-2
          bg-card text-card-foreground
          transition-all duration-200
          hover:border-primary/50 hover:shadow-[var(--shadow-soft)]
          focus:outline-none focus:border-primary focus:shadow-[var(--shadow-soft)]"
          
        
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className=
            "flex-1 text-left truncate"
           
          
        >
          {selectedCourse ? selectedCourse.courseName : "Select a Course"}
        </span>
        <FiChevronDown
          className=
            "h-5 w-5 text-muted-foreground transition-transform duration-200"
            
        
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className=
            "absolute z-50 w-full mt-2 rounded-xl bg-popover border-2 border-border"
            
            
          
          style={{ maxHeight: "380px" }}
        >
          {/* Search input */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search courses..."
                className=
                  "w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-input text-foreground placeholder:text-muted-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Course list */}
          <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(course)}
                  className=
                    "px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors duration-150 border-b border-border last:border-b-0"
                   
                  
                >
                  <div className="font-medium text-foreground mb-1">
                    {course.courseName}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>₹{course.fee}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No courses found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

