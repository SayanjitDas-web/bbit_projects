import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
   const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const navigator = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email,
        password,
      };
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        {withCredentials: true}
      );
      setIsError(false);
      setMessage(response.data?.message);
      navigator("/chat")
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
      console.log(err);
    }
    setEmail("");
    setPassword("");
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-wrap">
      <div className="w-80 h-[400px] flex justify-center items-center flex-wrap border p-4">
        {isError && message.length != 0 ? (
          <h1 className="text-red-600">{message}</h1>
        ) : (
          <h1 className="text-green-600">{message}</h1>
        )}
        <form action="" onSubmit={handleSubmit}>
          <div className="w-full flex justify-center items-center my-2 gap-2">
            <label htmlFor="email">email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black p-1 rounded-lg"
            />
          </div>
          <div className="w-full flex justify-center items-center my-2 gap-2">
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-black p-1 rounded-lg"
            />
          </div>
          <div>
            <button type="submit" className="border py-2 px-4 rounded-lg">
              login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login