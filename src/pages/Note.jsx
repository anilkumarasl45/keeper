import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Trash2, Edit3, Loader2, StickyNote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import CreateArea from "../components/CreateArea";
import NoteModal from "../components/NoteModal";
import parse from "html-react-parser";

function NoteArea() {
  const [notes, setNotes] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [noteUpdated, setNoteUpdated] = useState(false);
  const { toasts, toast, removeToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_API}/notes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotes(data.notes || []);
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
      }
      setLoading(false);
    }
    fetchNotes();
  }, [noteUpdated]);

  function update() {
    setNoteUpdated(!noteUpdated);
  }

  async function editHandler(id) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateData(data.note);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching note:", error);
      toast.error("Failed to load note");
    }
  }

  function closeModal() {
    setUpdateData({});
    setIsOpen(false);
  }

  function showToast(success) {
    if (success) {
      toast.success("Note updated successfully!");
    } else {
      toast.error("Error updating note!");
    }
    setNoteUpdated(!noteUpdated);
  }

  async function deleteHandler(id) {
    setDeleteLoading(id);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }
      const { data } = await axios.delete(
        `${import.meta.env.VITE_SERVER_API}/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success === true) {
        toast.success("Note deleted successfully!");
        setNoteUpdated(!noteUpdated);
      } else {
        toast.error("Error deleting note!");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note!");
    } finally {
      setDeleteLoading(null);
    }
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNotes(items);
    // Here you could also save the new order to the backend
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const noteVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderNoteContent = (note) => {
    if (note.type === "drawing") {
      return (
        <div className="mb-4">
          <img
            src={note.content}
            alt="Drawing"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      );
    } else {
      // For text notes, render with HTML parsing to preserve styling
      const styledContent = note.content || '';

      return (
        <div 
          className="mb-4 line-clamp-4 whitespace-pre-wrap"
          style={{
            color: note.style?.color || "#000000",
            fontFamily: note.style?.fontFamily || "Montserrat",
            fontSize: note.style?.fontSize ? `${Math.max(parseInt(note.style.fontSize) - 2, 12)}px` : "14px"
          }}
        >
          {styledContent}
        </div>
      );
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <CreateArea update={update} />

        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Loading your notes...</p>
          </motion.div>
        ) : notes.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <StickyNote className="w-12 h-12 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by creating your first note above
            </p>
          </motion.div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="notes">
              {(provided) => (
                <motion.div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {notes.map((note, index) => (
                      <Draggable
                        key={note._id}
                        draggableId={note._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            variants={noteVariants}
                            className={`note-card p-6 cursor-grab active:cursor-grabbing min-h-[200px] ${
                              snapshot.isDragging ? "rotate-3 scale-105" : ""
                            }`}
                            style={{
                              backgroundColor:
                                note.style?.backgroundColor || "#ffffff",
                              ...provided.draggableProps.style,
                            }}
                            whileHover={{ y: -4 }}
                            layout
                          >
                            <h2
                              className="text-lg font-semibold mb-3 line-clamp-2"
                              style={{
                                color: note.style?.color || "#000000",
                                fontFamily:
                                  note.style?.fontFamily || "Montserrat",
                                fontSize: note.style?.fontSize
                                  ? `${note.style.fontSize}px`
                                  : "18px",
                              }}
                            >
                              {note.title}
                            </h2>
                            {renderNoteContent(note)}

                            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editHandler(note._id);
                                }}
                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </motion.button>

                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteHandler(note._id);
                                }}
                                disabled={deleteLoading === note._id}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {deleteLoading === note._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </motion.div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <AnimatePresence>
          {modalIsOpen && (
            <NoteModal
              isOpen={modalIsOpen}
              note={updateData}
              closeModal={closeModal}
              showToast={showToast}
            />
          )}
        </AnimatePresence>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default NoteArea;
