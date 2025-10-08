// src/pages/Instructor.jsx
import { instructorServices } from "../services/instructorServices";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import DeleteConfirmation from "../components/DeleteConfirmation";
import InstructorReview from "../components/InstructorReview";
import FailedRequest from "../components/FailedRequest";

export default function Instructor() {
  const [instructorCount, setInstructorCount] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [error, setError] = useState('');

  const [typeInstructor, setTypeInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [Instructors, setInstructors] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [instructorData, setInstructorData] = useState(null);
  const [isInstructorOpen, setInstructorOpen] = useState(false);
  const [selectedInstructorName, setSelectedInstructorName] = useState("");
  const [selectedInstructorID, setSelectedInstructorID] = useState(0);

  const itemsPerPage = 4;
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);



  const handleSaveInstructor = async (actionType, data, jobTitle) => {
    try {

      let result;


      if (actionType === "Add") {
        debugger
        result = await instructorServices.save(data);
        if (result) {
          result.jobTitleName = jobTitle;
          setInstructors((prev) => [...prev, result]);
          setInstructorCount((prev) => prev + 1);
        }
      }

      if (actionType === "Update") {
        debugger
        result = await instructorServices.update(data);
        if (result) {
          const { jobTitleID, ...rest } = result;
          const updatedInstructor = {
            ...rest,
            jobTitleName: jobTitle
          };
          setInstructors((prev) =>
            prev.map((i) => (i.instructorID === result.instructorID ? updatedInstructor : i))
          );
        }
      }

      setInstructorOpen(false);
      setInstructorData(null);

    } catch (error) {
      setError(`Error saving instructor`);

    }
  };
  useEffect(() => {

    const getinstructorPages = async () => {
      debugger
      try {

        const Data = await instructorServices.getPages(pageNumber, itemsPerPage, searchTerm);
        setInstructorCount(Data.totalCount)
        setInstructors(Data.data)


      } catch (error) {
        setError(`Error fetching Instructor Pages: ${error.response.data}`);

      }
    };

    getinstructorPages();
  }, [pageNumber, searchTerm]);



  const handleDeleteClick = (instructor) => {
    setSelectedInstructorName(instructor.instructorName);
    setSelectedInstructorID(instructor.instructorID);

    setIsDeleteOpen(true);
  };

  const handleInstructorClick = (instructor, type) => {
    debugger
    setInstructorData(instructor)
    setInstructorOpen(true);
    setTypeInstructor(type)
  };


  const handleInstructorClose = () => {
    setInstructorData(null)
    setInstructorOpen(false);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
  };

  const handleDeleteConfirm = async () => {

    if (selectedInstructorID === 0) return;

    try {
      debugger

      const isDeleted = await instructorServices.delete(selectedInstructorID);


      if (isDeleted) {
        setInstructors(prev =>
          prev.filter(i => i.instructorID !== selectedInstructorID));
        setInstructorCount(prev => prev - 1);
        
        const remainingItemsOnPage = Instructors.length - 1;
        if (remainingItemsOnPage === 0 && pageNumber > 1) {
          setPageNumber(pageNumber - 1);
        }

      }





    } catch (error) {
      setError(`Error deleting instructor: ${error.response.data}`);
    }
    finally {
      setIsDeleteOpen(false);
      setSelectedInstructorID(0);
    }
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);


  };






  return (
    <div className=" bg-gray-50 ">
      <div className="flex-1 p-4">
        <div className="items-center px-2 mb-8 flex justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold px-2 text-gray-800">Instructors</h1>
            <span className="text-gray-600 px-1 py-4 rounded text-1xl font-medium">
              Dashboard
            </span>
            <span>/</span>
            <span className="text-gray-600 py-1 rounded text-1xl font-sm">
              Instructors
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
        <div className="border rounded-lg shadow-lg p-7 m-7 bg-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold px-1 text-gray-800">Instructors</h1>
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm font-medium">
                {instructorCount}
              </span>
            </div>

            <div className="flex gap-6">
              <button onClick={() => handleInstructorClick(instructorData, "Add")}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Add Instructor
              </button>

              <div className="relative">
                <img
                  src={`${process.env.PUBLIC_URL}/Assets/Icons/Search.png`}
                  alt="Search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  placeholder="Search for Instructors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                />
              </div>
              <button className="bg-gray-50 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:bg-gray-200 transition-colors">
                <img src={`${process.env.PUBLIC_URL}/Assets/Icons/list.png`} alt="list " />
              </button>

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-800">Name</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-800">Job Title</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-800">Rate</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-800">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Instructors.map((instructor) => (

                  <tr key={instructor.instructorID} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{instructor.instructorName}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{instructor.jobTitleName}</td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div
                            key={star}
                            className={`cursor-pointer select-none text-2xl transition-colors ${star <= instructor.courseRate ? "text-yellow-400" : "text-gray-300"
                              }`}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleInstructorClick(instructor, "View")}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <img src={`${process.env.PUBLIC_URL}/Assets/Icons/eye.png`} alt="eye" />
                        </button >
                        <button onClick={() => handleInstructorClick(instructor, "Update")} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                          <img src={`${process.env.PUBLIC_URL}/Assets/Icons/pencil.png`} alt="pencil" />
                        </button>
                        <button onClick={() => handleDeleteClick(instructor)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <img src={`${process.env.PUBLIC_URL}/Assets/Icons/trash.png`} alt="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>


                ))}
              </tbody>
            </table>
            <DeleteConfirmation
              isOpen={isDeleteOpen}
              onClose={handleDeleteClose}
              onConfirm={handleDeleteConfirm}
              name={selectedInstructorName}
            />

          </div>
          <Pagination
            currentPage={pageNumber}
            totalItems={instructorCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>


        <InstructorReview
          isOpen={isInstructorOpen}
          onClose={handleInstructorClose}
          type={typeInstructor}
          instructor={instructorData}
          onSave={handleSaveInstructor}
        />

      </div>
      <FailedRequest
        message={error}
        onClose={() => setError("")}
      />

    </div>

  );
}
