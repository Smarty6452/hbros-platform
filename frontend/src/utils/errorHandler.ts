import toast from "react-hot-toast";

export const handleApiError = (error: any, fallbackMessage: string = "An error occurred") => {
  console.error("API Error:", error);
  
  const message = 
    error.response?.data?.message || 
    error.response?.data || 
    error.message || 
    fallbackMessage;
  
  toast.error(message);
  return message;
};

export const handleSuccess = (message: string) => {
  toast.success(message);
};