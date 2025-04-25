// src/utils/isLoggedIn.js

const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token; // Devuelve true si hay token, false si no
  };
  
  export default isLoggedIn;
  