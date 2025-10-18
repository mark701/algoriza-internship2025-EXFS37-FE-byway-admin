// src/pages/Login.js
import  { useState } from 'react';
import { useSetAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { AdminServices } from '../services/AdminServices';
import { authAtom } from '../utils/authAtom';


const Login = () => {
  const [formData, setFormData] = useState({ 
    EmailOrName: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useSetAtom(authAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    setError('');


    try {
      debugger
      const response = await AdminServices.login(formData);
      const token = response.data;
      
      if (token) {

        setToken(token);
        navigate('/dashboard');
      } else {
        setError('Invalid response from server - no token received');
      }
    } catch (err) { 
      if (err) {
          setError(err.response?.data ?? err.message);
    }
    } finally {
      setLoading(false);
    }
  };

    const handleSocialSignIn = (provider) => {
    console.log(`Sign in with ${provider}`);
    // TODO: implement social auth redirect
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    
       <div className="FlexScreen">          
      <div className="flex-1 flex-center px-8 py-12 bg-white">
        <div className="w-full max-w-2xl space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sign in to your account
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="EmailOrName" className="LabelFont text-gray-900 mb-2">
                Email or Username
              </label>
              <input
                id="EmailOrName"
                name="EmailOrName"
                type="text"
                value={formData.EmailOrName}
                onChange={handleChange}
                placeholder="Enter your email or username"
                disabled={loading}
                required
                className="input-Rounded BorderPadding FocusBorder"
              />
            </div>

            <div>
              <label htmlFor="password" className="LabelFont text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                required
                className="input-Rounded BorderPadding FocusBorder "
              />
            </div>

            <button type="submit" disabled={loading} className="w-32 h-14 btn btn-primary">
              Sign In
              <svg className="w-6 h-10"  stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M17 8l6 6m0 0l-6 6m6-6H3"/>
              </svg>
            </button>

          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or sign in with</span>
            </div>
          </div>


          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => handleSocialSignIn("Facebook")} className="btn btn-social text-blue-700" > 
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Facebook.png`} alt="Google" className="w-5 h-5"/>
              Facebook
            </button>

            <button onClick={() => handleSocialSignIn("Google")}className="btn btn-social text-red-500 gap-1">
              <img src={`${process.env.PUBLIC_URL}/Assets/Icons/google.png`}  alt="Google"className="w-5 h-5"/>
              Google
            </button>

            <button onClick={() => handleSocialSignIn("Microsoft")} className="btn btn-social">
             <img src={`${process.env.PUBLIC_URL}/Assets/Icons/Micosoft.png`}alt="Micosoft"className="w-5 h-5"/>Micosoft</button>
          </div>
        </div>
      </div>

      <div className="flex-1  relative hidden lg:block">
        <img src={`${process.env.PUBLIC_URL}/Assets/Images/SignImage.png`} alt="Login background" className="h-full w-full object-cover"/>
      </div>

       {error && (
            <div className="fixed inset-0 flex-center bg-black/40 z-50">
              <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
                <h2 className="text-lg font-semibold text-red-600 mb-2">Failed</h2>
                <p className="text-gray-700">{error}</p>
                <button
                  onClick={() => setError("")}
                  className="mt-4 w-28 BorderPadding bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
    </div>
  );
};

export default Login;