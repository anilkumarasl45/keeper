import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Palette, Type, Loader2, PenTool } from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/useToast";
import ToastContainer from "./ToastContainer";
import ColorPicker from "./ColorPicker";
import FontSelector from "./FontSelector";
import DrawingCanvas from "./DrawingCanvas";

function CreateArea({ update }) {
  const [isExpanded, setExpanded] = useState(false);
  const [creatingNote, setCreatingNote] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [noteType, setNoteType] = useState("text"); // 'text' or 'drawing'
  const [drawingData, setDrawingData] = useState(null);
  const [noteStyle, setNoteStyle] = useState({
    color: "#000000",
    backgroundColor: "#ffffff",
    fontFamily: "Montserrat",
    fontSize: "16",
  });
  const { toasts, toast, removeToast } = useToast();

  const titleRef = useRef();
  const contentRef = useRef();

  async function submitNote(event) {
    event.preventDefault();
    setCreatingNote(true);

    const title = titleRef.current.value;
    const content = noteType === "text" ? contentRef.current.value : drawingData;

    if (!title.trim() && (!content || !content.trim())) {
      toast.error("Please add some content to your note!");
      setCreatingNote(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/notes`,
        {
          title: title || "Untitled",
          content: content,
          style: noteStyle,
          type: noteType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);

      if (data.success === true) {
        toast.success("Note created successfully!");
        update(); // Refresh notes list after creation
        titleRef.current.value = "";
        if (contentRef.current) contentRef.current.value = "";
        setDrawingData(null);
        setExpanded(false);
        setShowDrawing(false);
        setNoteType("text");
        setNoteStyle({
          color: "#000000",
          backgroundColor: "#ffffff",
          fontFamily: "Montserrat",
          fontSize: "16",
        });
      } else {
        toast.error("Error creating note!");
      }
    } catch (error) {
      console.log("Error creating note:", error);
      toast.error("Something went wrong!");
    }

    setCreatingNote(false);
  }

  function handleDrawingSave(data) {
    setDrawingData(data);
  }

  function expand() {
    setExpanded(true);
  }

  function toggleDrawing() {
    setShowDrawing(!showDrawing);
    setNoteType(showDrawing ? "text" : "drawing");
    if (!isExpanded) setExpanded(true);
  }
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.form
          onSubmit={submitNote}
          className="glass-effect rounded-3xl p-8 shadow-2xl border border-white/20"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.input
            ref={titleRef}
            placeholder={
              isExpanded
                ? noteType === "drawing"
                  ? "Drawing title..."
                  : "Note title..."
                : "Take a note..."
            }
            onClick={expand}
            className="w-full text-xl font-semibold bg-transparent border-none outline-none placeholder-gray-400 mb-6"
            style={{
              color: noteStyle.color,
              fontFamily: noteStyle.fontFamily,
              fontSize: `${Math.max(parseInt(noteStyle.fontSize) + 4, 20)}px`,
            }}
            whileFocus={{ scale: 1.02 }}
          />

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Note Type Selector */}
                <div className="flex space-x-2 mb-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setNoteType("text");
                      setShowDrawing(false);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      noteType === "text"
                        ? "bg-primary-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Type className="w-4 h-4 inline mr-2" />
                    Text Note
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={toggleDrawing}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      noteType === "drawing"
                        ? "bg-primary-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PenTool className="w-4 h-4 inline mr-2" />
                    Drawing
                  </motion.button>
                </div>

                {noteType === "text" ? (
                  <textarea
                    ref={contentRef}
                    placeholder="Write your note here..."
                    rows={6}
                    className="w-full bg-transparent border-none outline-none placeholder-gray-400 resize-none mb-6 p-4 rounded-xl"
                    style={{
                      color: noteStyle.color,
                      backgroundColor: noteStyle.backgroundColor,
                      fontFamily: noteStyle.fontFamily,
                      fontSize: `${noteStyle.fontSize}px`,
                    }}
                  />
                ) : (
                  <div className="mb-6">
                    <DrawingCanvas onSave={handleDrawingSave} />
                  </div>
                )}

                {/* Toolbar */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  {noteType === "text" && (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <motion.button
                          type="button"
                          onClick={() => setShowColorPicker(!showColorPicker)}
                          className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Palette className="w-5 h-5 text-gray-700" />
                        </motion.button>

                        <AnimatePresence>
                          {showColorPicker && (
                            <ColorPicker
                              noteStyle={noteStyle}
                              setNoteStyle={setNoteStyle}
                              onClose={() => setShowColorPicker(false)}
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="relative">
                        <motion.button
                          type="button"
                          onClick={() => setShowFontSelector(!showFontSelector)}
                          className="p-3 hover:bg-gray-100 rounded-xl transition-colors shadow-md"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Type className="w-5 h-5 text-gray-700" />
                        </motion.button>

                        <AnimatePresence>
                          {showFontSelector && (
                            <FontSelector
                              noteStyle={noteStyle}
                              setNoteStyle={setNoteStyle}
                              onClose={() => setShowFontSelector(false)}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {noteType === "text" && <div></div>}

                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={creatingNote}
                      className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {creatingNote ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>{creatingNote ? "Saving..." : noteType === "drawing" ? "Save Drawing" : "Add Note"}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default CreateArea;
