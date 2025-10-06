


import React from "react";
import { API_BASE_URL } from "../utils/ApiUrl";

export default function CourseCard({ course, categories, onOpenForm,type,onDeletCourse }) {
  // find categoryName by matching categoryID
  const category = categories.find(c => c.categoryID === course.categoryID);

  return (
    <div className="max-w-md  bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Course Image */}
      <div className="relative">
        <img
          src={`${API_BASE_URL}/${course.courseImagePath}`}
          alt={course.courseName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gray-200 bg-opacity-90 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
            {category ? category.categoryName : "Unknown"}
          </span>
        </div>
      </div>

      <div className="p-4 ">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {course.courseName}
        </h2>

        <div className={`flex items-center mb-3 ${type === "View" ? "pointer-events-none" : ""} space-x-1 text-xl`}>
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`${i < course.courseRate ? "text-yellow-500" : "text-gray-300"} cursor-pointer`}
            >
              ★
            </span>
          ))}
        </div>



        <p className="text-gray-600 text-sm mb-4">
          {course.courseHours} Hours • {course.courseLevel}
        </p>


        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900">${course.coursePrice}</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onOpenForm("View", course)}
            className="p-2 bg-gray-100  border rounded-lg hover:bg-gray-200 transition-colors">
            <img src="Assets/Icons/eye.png" alt="close" className="w-5 h-5" />

          </button>
          <button
            onClick={() => onOpenForm("Update", course)}
            className="p-2 bg-gray-100  border rounded-lg hover:bg-gray-200 transition-colors">
            <img src="Assets/Icons/pencil.png" alt="close" className="w-5 h-5" />

          </button>
          <button onClick={() => onDeletCourse(course)}
           className="p-2 bg-gray-100  border rounded-lg hover:bg-gray-200  transition-colors">
            <img src="Assets/Icons/trash.png" alt="close" className="w-5 h-5" />

          </button>
        </div>
      </div>
    </div>
  );
}
