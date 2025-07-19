import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Loader2 } from "lucide-react";
import axios from "axios";
import NoteArea from "./Note";

function Home() {
  const navigate = useNavigate();
  const [showNotes, setShowNotes] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success === true) {
          setUsername(data.username.split("@")[0]);
          setShowNotes(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }
    verifyUser();
  }, [navigate]);

  async function logout() {
    try {
      setShowNotes(false);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <p className="text-gray-600">Loading your notes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {showNotes && (
        <motion.div
          className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back, <span className="text-primary-600">{username}</span>
              ! 👋
            </h2>
            <p className="text-gray-600 mt-1">
              Ready to capture your thoughts?
            </p>
          </motion.div>

          <motion.button
            onClick={logout}
            className="btn-secondary flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </motion.div>
      )}

      {showNotes && <NoteArea />}
    </div>
  );
}

export default Home;
