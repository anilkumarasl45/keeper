import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Save, Palette, Type, PenTool } from 'lucide-react'
import axios from 'axios'
import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'
import DrawingCanvas from './DrawingCanvas'

function NoteModal({ isOpen, note, closeModal, showToast }) {
    const [title, setTitle] = useState(note.title || '')
    const [content, setContent] = useState(note.content || '')
    const [noteType, setNoteType] = useState(note.type || 'text')
    const [noteStyle, setNoteStyle] = useState(note.style || {
        color: '#000000',
        backgroundColor: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '16'
    })
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showFontSelector, setShowFontSelector] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function submitHandler(e) {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                navigate("/login")
                return
            }
            
            const { data } = await axios.put(
                `${import.meta.env.VITE_SERVER_API}/notes/${note._id}`,
                { 
                    title: title || "Untitled", 
                    content: content,
                    style: noteStyle,
                    type: noteType
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            showToast(data.success)
            if (data.success) {
                closeModal()
            }
        } catch (error) {
            console.error("Error updating note:", error)
            showToast(false)
        }
        
        setIsLoading(false)
    }

    function handleDrawingSave(drawingData) {
        setContent(drawingData)
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="glass-effect rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl border border-white/20"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-200/50 bg-gradient-to-r from-primary-50 to-primary-100">
                            <h2 className="text-2xl font-bold text-gray-800">Edit Note</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="p-3 hover:bg-white/50 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 max-h-[calc(95vh-160px)] overflow-y-auto">
                            <form onSubmit={submitHandler} className="space-y-6">
                                {/* Note Type Selector */}
                                <div className="flex space-x-2 mb-6">
                                    <motion.button
                                        type="button"
                                        onClick={() => {}}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                            noteType === 'text' 
                                                ? 'bg-primary-500 text-white shadow-lg' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={noteType !== 'text'}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Type className="w-4 h-4 inline mr-2" />
                                        Text Note
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => {}}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                            noteType === 'drawing' 
                                                ? 'bg-primary-500 text-white shadow-lg' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={noteType !== 'drawing'}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <PenTool className="w-4 h-4 inline mr-2" />
                                        Drawing
                                    </motion.button>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={noteType === 'drawing' ? "Drawing title..." : "Note title..."}
                                        className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder-gray-400 p-4 rounded-xl"
                                        style={{
                                            color: noteStyle.color,
                                            fontFamily: noteStyle.fontFamily,
                                            fontSize: `${Math.max(parseInt(noteStyle.fontSize) + 8, 24)}px`
                                        }}
                                    />
                                </div>

                                {noteType === 'text' ? (
                                    <div>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your note here..."
                                        rows={15}
                                        className="w-full bg-transparent border-none outline-none placeholder-gray-400 resize-none p-4 rounded-xl"
                                        style={{
                                            color: noteStyle.color,
                                            backgroundColor: noteStyle.backgroundColor,
                                            fontFamily: noteStyle.fontFamily,
                                            fontSize: `${noteStyle.fontSize}px`
                                        }}
                                    />
                                    </div>
                                ) : (
                                    <div>
                                        <DrawingCanvas 
                                            onSave={handleDrawingSave}
                                            initialDrawing={content}
                                        />
                                    </div>
                                )}

                                {/* Toolbar */}
                                {noteType === 'text' && (
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
                                    
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                                    </motion.button>
                                </div>
                                )}
                                
                                {noteType === 'drawing' && (
                                    <div className="flex justify-center pt-6 border-t border-gray-200">
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-5 h-5" />
                                            )}
                                            <span>{isLoading ? 'Saving...' : 'Save Drawing'}</span>
                                        </motion.button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default NoteModal