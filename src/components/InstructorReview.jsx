import { useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/ApiUrl";
import { JobTitleServices } from "../services/JobTitleServices";
import FailedRequest from './FailedRequest';
export default function InstructorReview({ isOpen, onClose, instructor, type, onSave }) {
    const [formData, setFormData] = useState({
        instructorID: 0,
        jobTitleID: 0,
        instructorName: "",
        jobTitle: "Choose",
        instructorDescription: "",
        courseRate: 0,
        InstructorImage: null,
    });
    const [error, setError] = useState('');

    const [previewImage, setPreviewImage] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [jobTitles, setJobTitles] = useState([]);


    useEffect(() => {
        if (!isOpen) return;
        debugger
        const fetchJobTitles = async () => {
            try {
                const titles = await JobTitleServices.getAll();
                setJobTitles(titles);
            } catch (err) {
                console.error("Failed to fetch job titles:", err);
            }
        };
        fetchJobTitles();
        if (type === "Add") {
            setFormData({
                instructorID: 0,
                instructorName: "",
                jobTitleID: 0,
                jobTitle: "Choose",
                instructorDescription: "",
                courseRate: 0,
                InstructorImage: null,
            });
            setPreviewImage(null);
        } else if (instructor) {
            setFormData({
                instructorID: instructor.instructorID || 0,
                instructorName: instructor.instructorName || "",
                jobTitle: instructor.jobTitleName || "Choose",
                jobTitleID: instructor.jobTitleID || 0,
                instructorDescription: instructor.instructorDescription || "",
                courseRate: instructor.courseRate || 0,
                InstructorImage: null,
            });
            setPreviewImage(instructor.instructorImagePath
                ? `${API_BASE_URL}/${instructor.instructorImagePath}`
                : null
            );
        }
    }, [isOpen, instructor, type]);

    const handleRating = (rating) => {
        if (type === "View") return;
        setFormData({ ...formData, courseRate: rating });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, InstructorImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (type === 'Add') {
            if (

                formData.jobTitleID === 0 ||
                formData.instructorName.trim() === "" ||
                formData.jobTitle === "Choose" ||
                formData.instructorDescription.trim() === "" ||
                formData.courseRate === 0 ||
                !formData.InstructorImage

            ) {

                setError("All fields are required.");
                return;
            }


        }
        if (type === "Update") {
            if (formData.jobTitleID === 0 ||formData.instructorName.trim() === "" ||formData.jobTitle === "Choose" ||
                formData.instructorDescription.trim() === "" ||
                formData.courseRate === 0

            ) {
                setError("All fields are required.");
                return;
            }
        }
        const data = new FormData();
        data.append("instructorID", formData.instructorID);
        data.append("jobTitleID", formData.jobTitleID);
        data.append("instructorName", formData.instructorName);
        data.append("courseRate", formData.courseRate);
        data.append("instructorDescription", formData.instructorDescription);
        if (formData.InstructorImage) {
            data.append("InstructorImage", formData.InstructorImage);
        }
        onSave(type, data, formData.jobTitle);

    };

    if (!isOpen) return null;

    const isViewMode = type === "View";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">

                <div className="flex justify-between  mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                        {type === "Add" && "Add Instructor"}
                        {type === "Update" && "Update Instructor"}
                        {type === "View" && "View Instructor"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <img src="Assets/Icons/cross.png" alt="close" className="w-4 h-4" />
                    </button>
                </div>


                <div className="flex justify-start mb-6">
                    <div className="relative">
                        <label className="cursor-pointer block">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={isViewMode}
                            />
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-400">
                                        <img className="w-6 h-6" alt="camera" src="Assets/Icons/camera.png" />

                                    </div>
                                )}
                            </div>
                        </label>


                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 cursor-pointer">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </div>
                    </div>
                </div>


                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={formData.instructorName}
                            disabled={isViewMode}
                            onChange={(e) =>
                                setFormData({ ...formData, instructorName: e.target.value })
                            }
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-7">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    disabled={isViewMode}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg text-left text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center disabled:bg-gray-100"
                                >
                                    {formData.jobTitle}
                                </button>

                                {showDropdown && !isViewMode && (
                                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                        {jobTitles.map((title) => (
                                            <button
                                                key={title.jobTilteID}
                                                onClick={() => {
                                                    setFormData({
                                                        ...formData,
                                                        jobTitleID: title.jobTilteID,
                                                        jobTitle: title.jobTilteName,
                                                    });
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                            >
                                                {title.jobTilteName}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rate
                            </label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div
                                        key={star}
                                        onClick={() => handleRating(star)}
                                        className={`select-none text-2xl transition-colors ${star <= formData.courseRate ? "text-yellow-400" : "text-gray-300"
                                            } ${!isViewMode ? "cursor-pointer hover:scale-125 hover:text-yellow-500" : "cursor-default"}`}
                                    >
                                        ★
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            placeholder="Enter a Description"
                            rows={4}
                            value={formData.instructorDescription}
                            disabled={isViewMode}
                            onChange={(e) =>
                                setFormData({ ...formData, instructorDescription: e.target.value })
                            }
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100"
                        />
                    </div>
                </div>


                {!isViewMode && (
                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 text-gray-600 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-3 px-4 text-white bg-gray-900 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            {type}
                        </button>
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
