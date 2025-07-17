import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Save, Palette, Type } from 'lucide-react'
import axios from 'axios'
import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'

function NoteModal({ isOpen, note, closeModal, showToast }) {
    const [title, setTitle] = useState(note.title || '')
    const [content, setContent] = useState(note.content || '')
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
            const { data } = await axios.put(
                `${import.meta.env.VITE_SERVER_API}/notes/${note._id}`,
                { 
                    title: title || "Untitled", 
                    content: content,
                    style: noteStyle
                },
                { withCredentials: true }
            )
            showToast(data.success)
            closeModal()
        } catch (error) {
            console.error("Error updating note:", error)
            showToast(false)
        }
        
        setIsLoading(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="glass-effect rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Edit Note</h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
                            <form onSubmit={submitHandler} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Note title..."
                                        className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400"
                                        style={{
                                            color: noteStyle.color,
                                            fontFamily: noteStyle.fontFamily,
                                            fontSize: `${Math.max(parseInt(noteStyle.fontSize) + 4, 20)}px`
                                        }}
                                    />
                                </div>

                                <div>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your note here..."
                                        rows={12}
                                        className="w-full bg-transparent border-none outline-none placeholder-gray-400 resize-none"
                                        style={{
                                            color: noteStyle.color,
                                            backgroundColor: noteStyle.backgroundColor,
                                            fontFamily: noteStyle.fontFamily,
                                            fontSize: `${noteStyle.fontSize}px`
                                        }}
                                    />
                                </div>

                                {/* Toolbar */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <div className="flex items-center space-x-2">
                                        <div className="relative">
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowColorPicker(!showColorPicker)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Palette className="w-5 h-5 text-gray-600" />
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
                                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Type className="w-5 h-5 text-gray-600" />
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
                                        className="btn-primary flex items-center space-x-2"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default NoteModal