import { CourseServices } from "../services/CourseServices";
import { useEffect, useState } from "react";
import { CategoryServices } from "../services/CategoryServices";
import CourseCard from "../components/CourseCard";
import CourseForm from "../components/CourseForm";
import Pagination from "../components/Pagination";
import DeleteConfirmation from "../components/DeleteConfirmation";
import FailedRequest from "../components/FailedRequest";
const Course = () => {
  const [error, setError] = useState('');

  const [courseCount, setCourseCount] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeForm, setTypeForm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [SelectedCourseID, setSelectedCourseID] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [categoriesData, setCategoriesData] = useState([]);
  const [course, setcourse] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCourseToDelete, setSelectedCourseToDelete] = useState(null);
  const itemsPerPage = 9;



  useEffect(() => {
    const GetIntialWithUpdate = async () => {

      try {
        const CourseData = await CourseServices.GetPagesAdmin(pageNumber, itemsPerPage, searchTerm, selectedCategories ? selectedCategories.name : "");

        setCourseCount(CourseData.totalCount)
        setcourse(CourseData.data)

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    GetIntialWithUpdate();
  }, [itemsPerPage, searchTerm, selectedCategories, pageNumber]);




  useEffect(() => {
    const GetIntialCategory = async () => {

      try {
        const CategoriesData = await CategoryServices.GetNameID();
        setCategoriesData(CategoriesData)

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    GetIntialCategory();
  }, []);



  const handleSaveCourse = async (type, data) => {
    try {
      debugger

      let result;

      if (type === "Add") {
        result = await CourseServices.save(data);
        if (result) {
          const { content, ...courseWithoutContent } = result;

          setcourse((prev) => [...prev, courseWithoutContent]);
          setCourseCount((prev) => prev + 1);
        }
      }

      if (type === "Update") {
        result = await CourseServices.update(data);
        if (result) {
          const { content, ...updatedCourse } = result;

          setcourse((prev) =>
            prev.map((i) => (i.courseID === result.courseID ? updatedCourse : i))
          );
        }
      }

      setShowForm(false);
      setSelectedCourseID(null);

    } catch (error) {
      setError(`Error saving Course: ${error.response.data}`);
    }
  };
  const DeleteCourse = (course) => {
    setSelectedCourseToDelete(course);
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      debugger
      if (selectedCourseToDelete) {
        await CourseServices.delete(selectedCourseToDelete.courseID); // call your API
        setcourse((prev) =>
          prev.filter((c) => c.courseID !== selectedCourseToDelete.courseID)
        );
        setCourseCount((prev) => prev - 1);
        setDeleteModalOpen(false);
        setSelectedCourseToDelete(null);

        const remainingItemsOnPage = course.length - 1;
        if (remainingItemsOnPage === 0 && pageNumber > 1) {
          // Go back to previous page if current page will be empty
          setPageNumber(pageNumber - 1);
        }

      }
    } catch (error) {
      setError(`Error deleting Course: ${error.response.data}`);

    }
    finally {
      setDeleteModalOpen(false);
      setSelectedCourseToDelete(null);
    }
  };
  const openForm = (type, course = null) => {
    debugger
    setTypeForm(type);
    setSelectedCourseID(course ? course.courseID : null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setSelectedCourseID(null)
    setShowForm(false);
  };

  const handleSelect = (option) => {
    setSelectedCategories(option);

    setShowDropdown(false);
  };


  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  return (
    <div className="bg-gray-50">
      <div className="flex-1 p-4">
        {/* Header */}
        <div className="items-center px-2 mb-8 flex justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold px-2 text-gray-800">Course</h1>
            <span className="text-gray-600 px-1 py-4 rounded text-1xl font-medium">
              Dashboard
            </span>
            <span>/</span>
            <span className="text-gray-600 py-1 rounded text-1xl font-sm">
              Courses
            </span>
          </div>

          <button className="relative mx-8 p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="w-6 h-6 flex items-center justify-center">
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/notification.png`} alt="notification" />
            </div>
            <span className="absolute top-2 right-2 block w-3 h-3 rounded-full bg-red-500 border-2 border-white"></span>
          </button>
        </div>

        <div className="border-t border-gray-200 mx-11 my-3"></div>
        {showForm ? (
          <CourseForm
            className="items-center flex justify-between"
            onCancel={handleFormClose}
            CourseID={SelectedCourseID}
            type={typeForm}
            categories={categoriesData}
            onSave={handleSaveCourse}
          />
        ) : (
          <>

            <div className="border rounded-lg shadow-lg p-7 m-7 bg-white mb-8">

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold px-1 text-gray-800">Courses</h1>
                  <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                    {courseCount}
                  </span>
                </div>

                <div className="flex gap-6 items-center">


                  <button onClick={() => openForm("Add")}

                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Add Course
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {selectedCategories ? selectedCategories.name : "Categories"}
                      <span className="ml-2">&#9662;</span>
                    </button>

                    {showDropdown && (
                      <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {/* Default option */}
                        <button
                          onClick={() => {
                            setSelectedCategories(null);
                            setShowDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
                        >
                          Categories
                        </button>

                        {/* Category list */}
                        {categoriesData.map((category, index) => (
                          <button
                            key={category.categoryID}
                            onClick={() => handleSelect({ id: category.categoryID, name: category.categoryName })}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${index === categoriesData.length - 1 ? "last:rounded-b-lg" : ""
                              }`}
                          >
                            {category.categoryName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>


                  {/* Search Input */}
                  <div className="relative">
                    <img
                      src={`${process.env.PUBLIC_URL}/Assets/Icons/Search.png`}
                      alt="Search"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}

                      placeholder="Search for Instructors"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                    />
                  </div>

                  <button className="bg-gray-50 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:bg-gray-200 transition-colors">
                    <img src={`${process.env.PUBLIC_URL}/Assets/Icons/list.png`} alt="list " />
                  </button>
                </div>
              </div>
              <div className="p-10 grid grid-cols-3 gap-y-16">
                {course.map(course => (
                  <CourseCard key={course.courseID}
                    course={course}
                    categories={categoriesData}
                    onOpenForm={openForm}
                    onDeletCourse={DeleteCourse}
                  />
                ))}

                <DeleteConfirmation
                  isOpen={deleteModalOpen}
                  onClose={() => setDeleteModalOpen(false)}
                  onConfirm={handleConfirmDelete}
                  name={selectedCourseToDelete?.courseName}

                />

              </div>

              <Pagination
                currentPage={pageNumber}
                totalItems={courseCount}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            </div>

          </>)}


      </div>
      <FailedRequest
        message={error}
        onClose={() => setError("")}
      />
    </div>
  );
};

export default Course;
