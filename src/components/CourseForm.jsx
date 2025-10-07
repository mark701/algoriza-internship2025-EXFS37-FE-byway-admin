import React, { useEffect, useState } from 'react';
import { validateDecimalInput, validateIntegerInput } from "../utils/validators";
import { CourseServices } from '../services/CourseServices';
import { instructorServices } from '../services/instructorServices';
import { EnumServices } from '../services/EnumServices';
import { API_BASE_URL } from '../utils/ApiUrl';
import FailedRequest from './FailedRequest';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Bold,
  Italic,
  Underline,

  List,
  Link,
  Essentials,
  Paragraph,
  Undo,
  BlockQuote,
  Table,
  TableToolbar,
  Alignment,
  FontSize,
  FontFamily
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

export default function CourseForm({ CourseID, type, categories, onCancel, onSave }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseLevel, SetCourseLevel] = useState([]);
  const [instructor, SetInstructor] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, SetImagePath] = useState(null);
  const [contentKeyCounter, setContentKeyCounter] = useState(1);
  const [error, setError] = useState('');

  const [courseData, setCourseData] = useState({
    courseID: 0,
    courseName: '',
    categoryID: '',
    instructorID: '',
    courseLevel: '',
    courseRate: 0,
    courseHours: '',
    coursePrice: '',
    courseDescription: '',
    courseCertification: '',
    courseImagePath: null

  });

  const [contentSections, setContentSections] = useState([
    {
      contentID: 0,
      courseID: 0,
      contentName: '',
      lecturesNumber: '',
      contentHour: ''
    }
  ]);
  useEffect(() => {

    if (CourseID && CourseID !== 0 && type !== 'Add') {

      const fetchCourseData = async () => {

        const course = await CourseServices.FindInclude(CourseID);


        const level = await EnumServices.getCourseLevels()
        SetCourseLevel(level)

        const matchedLevel = level.find(l => l.name === course.courseLevel);
        setCourseData({
          courseID: course.courseID,
          courseName: course.courseName,
          categoryID: course.categoryID,
          courseLevel: matchedLevel ? matchedLevel.id : '',
          instructorID: course.instructorID,
          coursePrice: course.coursePrice,
          courseHours: course.courseHours,
          courseRate: course.courseRate,
          courseDescription: course.courseDescription,
          courseCertification: course.courseCertification,
          courseImagePath: course.courseImagePath
        });

        if (course.courseImagePath) {
          SetImagePath(`${API_BASE_URL}/${course.courseImagePath}`);
        }
        debugger
        // Map content
        if (course.contents?.length > 0) {
          setContentSections(course.contents.map((c, index) => ({

            key: contentKeyCounter + index,

            contentID: c.contentID,
            courseID: c.courseID,

            contentName: c.contentName,
            lecturesNumber: c.lecturesNumber,
            contentHour: c.contentHour
          })));
          setContentKeyCounter(prev => prev + course.contents.length);
        }
      };
      fetchCourseData();
    }
  }, [CourseID, type]);


  useEffect(() => {
    const GetIntialDataFrom = async () => {

      const instructorData = await instructorServices.getIdName()
      const level = await EnumServices.getCourseLevels()
      SetCourseLevel(level)
      SetInstructor(instructorData)

    }
    GetIntialDataFrom();
  }, []);



  const handleImageChange = (e) => {
    debugger
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or GIF files are allowed.");
      return;
    }
    // Check image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      debugger
      if (img.width > 700 || img.height > 430) {
        alert("Image must be 700x430 pixels or smaller.");
        return;
      }

      setSelectedImage(file);
      SetImagePath(URL.createObjectURL(file));
    };




  };



  const handleInputChange = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (key, field, value) => {
    setContentSections(prev =>
      prev.map(section =>
        section.key === key ? { ...section, [field]: value } : section
      )
    );
  };

  const addContentSection = () => {
    setContentSections(prev => [
      ...prev,
      {
        key: contentKeyCounter,
        contentID: 0,
        contentName: '',
        lecturesNumber: '',
        contentHour: ''
      }
    ]);
    setContentKeyCounter(prev => prev + 1);
  };


  const removeContentSection = (key) => {
    if (contentSections.length > 1) {
      setContentSections(prev =>
        prev.filter(section => section.key !== key)
      );
    }
  };

  const handleStarRating = (rating) => {
    if (isViewMode) return;

    setCourseData(prev => ({ ...prev, courseRate: rating }));
  };

  const nextStep = () => {
    debugger
    if (type === "Add") {
      if (!courseData.courseName ||
        !courseData.categoryID ||
        !courseData.instructorID ||
        !courseData.courseLevel ||
        !courseData.courseRate ||
        !courseData.courseHours ||
        !courseData.courseDescription ||
        !courseData.courseCertification ||
        !courseData.coursePrice || selectedImage == null) {
        setError("Please fill in all course Data fields.");
        return;

      }
    }
    else if (type === "Update") {
      if (!courseData.courseName ||
        !courseData.categoryID ||
        !courseData.instructorID ||
        !courseData.courseLevel ||
        !courseData.courseRate ||
        !courseData.courseHours ||
        !courseData.courseDescription ||
        !courseData.courseCertification ||
        !courseData.coursePrice) {
        setError("Please fill in all course Data fields.");
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 2));

  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));







  const handleSubmit = async () => {
    try {



      // Also check content sections
      for (const section of contentSections) {
        if (!section.contentName || !section.lecturesNumber || !section.contentHour) {
          setError("Please fill in all content section fields.");
          return;
        }
      }

      const formData = new FormData();
      debugger
      // Append main course fields
      formData.append("courseID", courseData.courseID);
      formData.append("courseName", courseData.courseName);
      formData.append("categoryID", parseInt(courseData.categoryID));
      formData.append("instructorID", parseInt(courseData.instructorID));
      formData.append("courseLevel", parseInt(courseData.courseLevel));
      formData.append("courseRate", parseInt(courseData.courseRate));
      formData.append("courseHours", parseFloat(courseData.courseHours));
      formData.append("coursePrice", parseFloat(courseData.coursePrice));
      formData.append("courseDescription", courseData.courseDescription);
      formData.append("courseCertification", courseData.courseCertification);

      // Append image if exists
      if (selectedImage) {
        formData.append("CourseImage", selectedImage);
      }

      // Append content sections as JSON string
      contentSections.forEach((c, index) => {
        formData.append(`content[${index}].contentID`, c.contentID || 0);
        formData.append(`content[${index}].contentName`, c.contentName);
        formData.append(`content[${index}].courseID`, c.courseID || 0);

        formData.append(`content[${index}].lecturesNumber`, parseInt(c.lecturesNumber || 0));
        formData.append(`content[${index}].contentHour`, parseFloat(c.contentHour || 0));
      });

      if (onSave) onSave(type, formData);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };



  const isViewMode = type === 'View';
  return (
    <div className="">
      <div className="px-7 ">
        {/* Header */}


        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">

              <div>
                <h1 className="text-2xl font-bold text-gray-800">Add Course</h1>
                <p className="text-gray-600">Step {currentStep} of 2</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Course details</h2>

            <div className="mb-6 flex gap-5 justify-start">
              <div className="w-64 h-32 max-w-md border-2 border-dashed border-gray-300 rounded-lg p-1 bg-gray-50 flex items-center justify-center cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  required={type === 'Add'}
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePath ? (
                  <img
                    src={imagePath}

                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center text-sm text-gray-600 gap-2 pointer-events-none">
                    <img
                      className="w-6 h-6"
                      src={`${process.env.PUBLIC_URL}/Assets/Icons/camera.png`}
                      alt="camera"
                    />
                    <span>Upload Image</span>
                  </div>
                )}
              </div>

              <div className="text-left text-sm text-gray-600 space-y-2 flex flex-col justify-center">
                <p>
                  <strong>Size:</strong> 700x430 pixels
                </p>
                <p>
                  <strong>File Support:</strong> .jpg, .jpeg, .png, or .gif
                </p>

              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
              <input
                required
                type="text"
                placeholder="Enter Name"
                value={courseData.courseName}

                onChange={(e) => setCourseData({ ...courseData, courseName: e.target.value })}
                disabled={isViewMode}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={courseData.categoryID}
                  onChange={(e) => handleInputChange('categoryID', e.target.value)}
                  disabled={isViewMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {/* hidden default placeholder */}
                  <option value="" disabled hidden>
                    Choose Category
                  </option>

                  {categories.map((cat) => (
                    <option key={cat.categoryID} value={cat.categoryID}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={courseData.courseLevel}
                  onChange={(e) => handleInputChange('courseLevel', e.target.value)}
                  disabled={isViewMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >

                  <option value="" disabled hidden>
                    Choose Level
                  </option>
                  {courseLevel.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
                <select
                  value={courseData.instructorID}
                  onChange={(e) => handleInputChange('instructorID', e.target.value)}
                  disabled={isViewMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled hidden>
                    Choose Instructor
                  </option>
                  {instructor.map((Ins) => (
                    <option key={Ins.instructorID} value={Ins.instructorID}>
                      {Ins.instructorName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost</label>
                <input
                  required
                  type="text"
                  placeholder="Enter Price"
                  value={courseData.coursePrice}
                  onChange={(e) => {
                    const validValue = validateDecimalInput(e.target.value);

                    handleInputChange('coursePrice', validValue)
                  }}
                  disabled={isViewMode}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total hours</label>
                <input
                  required
                  type="text"
                  placeholder="Write here"
                  value={courseData.courseHours}
                  onChange={(e) => {
                    const validValue = validateDecimalInput(e.target.value);
                    handleInputChange("courseHours", validValue);
                  }}
                  disabled={isViewMode}

                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      onClick={() => handleStarRating(star)}
                      className={`select-none text-2xl transition-colors ${star <= courseData.courseRate ? "text-yellow-400" : "text-gray-300"
                        } ${!isViewMode ? "cursor-pointer hover:scale-125 hover:text-yellow-500" : "cursor-default"}`}
                    >
                      ★
                    </div>
                  ))}
                </div>





              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>


                <CKEditor
                  disabled={isViewMode}
                  editor={ClassicEditor}
                  data={courseData.courseDescription}
                  onChange={(event, editor) =>
                    handleInputChange("courseDescription", editor.getData())
                  }
                  config={{
                    licenseKey: 'GPL',
                    plugins: [
                      Essentials,
                      Paragraph,
                      Bold,
                      Italic,
                      Underline,

                      List,
                      Link,
                      Undo,
                      BlockQuote,       // ← Quote
                      Table,            // ← Table
                      TableToolbar,
                      Alignment,        // ← Text alignment
                      FontSize,         // ← Font size
                      FontFamily        // ← Font family
                    ],
                    toolbar: {
                      items: [

                        'bold', 'italic', 'underline', '|',
                        'fontSize', 'fontFamily', '|',
                        'alignment', '|',
                        'bulletedList', 'numberedList', '|',
                        'link', 'blockQuote', 'insertTable', '|', 'undo', 'redo',
                      ]
                    },
                    table: {
                      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                    placeholder: 'Enter course description...'
                  }}
                />

              </div>

              {/* Certification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification
                </label>

                <CKEditor

                  editor={ClassicEditor}
                  data={courseData.courseCertification}
                  disabled={isViewMode}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    handleInputChange('courseCertification', data);
                  }}
                  config={{
                    licenseKey: 'GPL',
                    plugins: [
                      Essentials,
                      Paragraph,
                      Bold,
                      Italic,
                      Underline,

                      List,
                      Link,
                      Undo,
                      BlockQuote,       // ← Quote
                      Table,            // ← Table
                      TableToolbar,
                      Alignment,        // ← Text alignment
                      FontSize,         // ← Font size
                      FontFamily        // ← Font family
                    ],
                    toolbar: {
                      items: [

                        'bold', 'italic', 'underline', '|',
                        'fontSize', 'fontFamily', '|',
                        'alignment', '|',
                        'bulletedList', 'numberedList', '|',
                        'link', 'blockQuote', 'insertTable', '|', 'undo', 'redo',
                      ]
                    },
                    table: {
                      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                    placeholder: 'Enter course Certification...'
                  }}
                />
              </div>

            </div>

            <div className="flex justify-between">
              <button onClick={onCancel}

                className="px-6 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={nextStep}
                className="px-8 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {currentStep === 2 && (
              <div className="flex items-center mb-6">
                <button onClick={prevStep} className="mr-2 p-2 hover:bg-gray-100 rounded-lg flex items-center">
                  <img src={`${process.env.PUBLIC_URL}/Assets/Icons/back-arrow.png`} className="w-4 h-4" alt="back" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">Add Content</h2>
              </div>
            )}

            <div className="space-y-6 mb-6">
              {contentSections.map((section) => (
                <div key={section.key} className="border border-gray-200 rounded-lg p-6">
                  {/* Section Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter content Name"
                      value={section.contentName}
                      onChange={(e) => handleContentChange(section.key, 'contentName', e.target.value)}
                      disabled={isViewMode}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lectures Number</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter lectures Number"
                        value={section.lecturesNumber}
                        onChange={(e) =>
                          handleContentChange(
                            section.key,
                            "lecturesNumber",
                            validateIntegerInput(e.target.value)
                          )
                        }
                        disabled={isViewMode}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        required
                        type="text"
                        placeholder="Enter  time here"
                        value={section.contentHour}
                        onChange={(e) =>
                          handleContentChange(
                            section.key,
                            "contentHour",
                            validateDecimalInput(e.target.value)
                          )
                        }
                        disabled={isViewMode}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                    </div>
                  </div>

                  {contentSections.length > 1 && !isViewMode && (
                    <button
                      onClick={() => removeContentSection(section.key)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <img src={`${process.env.PUBLIC_URL}/Assets/Icons/deleteConfirm.png`} alt='' />

                    </button>
                  )}
                </div>
              ))}
            </div>
            {!isViewMode && (
              <button
                onClick={addContentSection}

                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors mb-8 flex items-center justify-center space-x-2"
              >
                <span>Add Another Content</span>
              </button>
            )}
            <div className="flex justify-between">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                Cancel
              </button>
              {!isViewMode && (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {type === "Update" ? "Update" : "Add"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <FailedRequest
        message={error}
        onClose={() => setError("")}
      />
    </div>
  );
}