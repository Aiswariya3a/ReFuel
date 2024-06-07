import Card from "./Card";
import LoginLight from "../../../assets/images/loginLight.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../../../services/auth.service";
import { toast } from "react-toastify";


function UpdateProfile(){
  const [oldPassword,setOldPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassowrd,setConfirmPassword] = useState("");
  const navigate = useNavigate();
  
  const user = authService.getCurrentUser();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onDeleteProfile = async () => {
    try {
      // Add confirmation logic if needed
      await authService.deleteProfile(user.userId);
      toast.success("Profile deleted successfully");
      navigate("/user/auth/login");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  useEffect(()=>{
    if(!user){
      navigate('/user/auth/login')
    }
  },[])


  const onHandleSubmit =  async (e) =>{
    e.preventDefault();
    if(newPassword !== confirmPassowrd){
        toast.error("Password and Confirm Password not matching")
        return
    }
    try {
      await authService.updateProfilePassword(user.userId,oldPassword,newPassword).then(
        (response) => {
           toast.success(response.data.message)
           navigate("../logout");
        },
        (error) => {
          console.log(error)
          toast.error(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className="w-[screen] h-screen flex flex-col justify-around items-center lg:md:flex-row"
      style={{
        backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})`,
        backgroundPosition: `50% 50%`,
        backgroundSize: `cover`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-white p-3 text-center text-[54px] flex flex-row justify-around items-center gap-3  whitespace-break-spaces font-sans  lg:text-[96px] md:text-[74px] ">
        <h1>Profile</h1>
      </div>
      <div className="w-[100%] text-white  h-[100%] justify-center gap-5 lg:w-1/3 items-center flex flex-col flex-wrap overflow-scroll">
        <div className="header">
          <h1 className="text-center text-[54px]">Change Password</h1><br></br>
          <p className="text-center">Please Fill in the old and new Password</p>
        </div>
        <form class="w-full max-w-sm" onSubmit={onHandleSubmit}>
          <div class="gap-3 md:flex md:items-center mb-6 ">
          <div class="md:w-2/3">
              <label
                class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-currentPassword"
              >
                Current Password 
              </label>
            </div>
            <div class="mb-3 lg:mb-0">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-currentPassword"
                type="password"
                value={oldPassword}
                required
                minLength={8}
                onChange={(e)=>{
                    setOldPassword(e.target.value)
                }}
                placeholder="Password"
              />
            </div>
          </div>
     <div class="gap-3 md:flex md:items-center mb-6 ">
     <div class="md:w-2/3">
              <label
                class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-newPassword"
              >
                New Password 
              </label>
            </div>
            <div class="">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-newPassword"
                type="password"
                value={newPassword}
                required
                minLength={8}

                onChange={(e)=>{
                    setNewPassword(e.target.value)
                }}
                placeholder="New Password"
              />
            </div>
          </div>
          <div class="gap-3 md:flex md:items-center mb-6 ">
          <div class="md:w-2/3">
              <label
                class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-confirm"
              >
                Confirm  Password
              </label>
            </div>
            <div class="">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-confirm"
                type="password"
                value={confirmPassowrd}
                required
                minLength={8}
                onChange={(e)=>{
                    setConfirmPassword(e.target.value)
                }}
                placeholder="Confirm Password"
              />
            </div>
          </div>
          <div className="actions w-full flex flex-col gap-4">
            <button
              className="bg-[#fe6f2b] hover:bg-[#F59337] w-full text-white font-bold py-2 px-4 rounded-full"
            >
              Update
            </button>
            <button
              className="bg-transparent border border-[#fe6f2b] w-full hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
              onClick={((e)=>{
                e.preventDefault();
                navigate('../')
              })}
            >
              Cancel
            </button>
            <br></br>
            {/* <button
              className="bg-red-600 hover:bg-red-700 w-full text-white font-bold py-2 px-4 rounded-full"
              onClick={onDeleteProfile}
            >
              Delete Profile
            </button> */}
          </div>
        </form>
      </div>

      
      {showConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Icon */}
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Delete Profile
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your profile? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={onDeleteProfile}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
}

export default UpdateProfile;

