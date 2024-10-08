import React, { useState, useEffect } from "react";
import { fetchProjects } from "../Services/Api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showAll, setShowAll] = useState(false); // To control the "Show more" and "Show less" functionality
  const [loading, setLoading] = useState(true); // To track if we're still loading the projects

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    loadProjects();
  }, []);

  // Filter and sort the projects
  const sortedProjects = projects
    .sort((a, b) => b.featured - a.featured) // Featured images come first
    .slice(0, showAll ? projects.length : 6); // Limit to 6 if "showAll" is false

  return (
    <div className="bg-white h-auto p-8 mt-56 mb-20">
      <p className="text-center text-3xl font-bold mb-8">Project Gallery</p>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
        {/* Show placeholders while loading */}
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-300 w-full h-full animate-pulse"
              ></div>
            ))
          : sortedProjects.map((project, index) => (
              <div
                key={index}
                className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
                  project.featured ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={project.uri}
                  alt="img"
                  className={`w-full border h-full object-contain transition-all duration-300 ease-in-out ${
                    project.featured ? "md:scale-110" : ""
                  }`}
                />
              </div>
            ))}
      </div>

      {/* Show More/Show Less Button */}
      <div className="text-center mt-8">
        {projects.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)} // Toggle between showing more or less
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {showAll ? "Show less" : "Show more..."}
          </button>
        )}
      </div>
    </div>
  );
};

export default Projects;
