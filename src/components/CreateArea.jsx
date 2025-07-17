import { useRef, useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Palette, Type, Loader2 } from 'lucide-react'
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast'
import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'

function CreateArea({ update }) {
    const [isExpanded, setExpanded] = useState(false)
    const [creatingNote, setCreatingNote] = useState(false)
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showFontSelector, setShowFontSelector] = useState(false)
    const [noteStyle, setNoteStyle] = useState({
        color: '#000000',
        backgroundColor: '#ffffff',
        fontFamily: 'Montserrat',
        fontSize: '16'
    })
    
    const titleRef = useRef()
    const contentRef = useRef()

    async function submitNote(event) {
        event.preventDefault()
        setCreatingNote(true)
        
        const title = titleRef.current.value
        const content = contentRef.current.value
        
        if (!title.trim() && !content.trim()) {
            toast.error("Please add some content to your note!")
            setCreatingNote(false)
            return
        }

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_SERVER_API}/notes`,
                { 
                    title: title || "Untitled", 
                    content: content,
                    style: noteStyle
                },
                { withCredentials: true }
            )
            
            update()
            
            if (data.success === true) {
                toast.success("Note created successfully!", {
                    position: "bottom-right",
                })
                titleRef.current.value = ''
                contentRef.current.value = ''
                setExpanded(false)
                setNoteStyle({
                    color: '#000000',
                    backgroundColor: '#ffffff',
                    fontFamily: 'Montserrat',
                    fontSize: '16'
                })
            } else {
                toast.error("Error creating note!", {
                    position: "bottom-right",
                })
            }
        } catch (error) {
            console.error("Error creating note:", error)
            toast.error("Something went wrong!", {
                position: "bottom-right",
            })
        }
        
        setCreatingNote(false)
    }

    function expand() {
        setExpanded(true)
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <motion.form 
                className="glass-effect rounded-2xl p-6 shadow-xl"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <motion.input
                    ref={titleRef}
                    placeholder={isExpanded ? "Note title..." : "Take a note..."}
                    onClick={expand}
                    className="w-full text-lg font-medium bg-transparent border-none outline-none placeholder-gray-400 mb-4"
                    style={{ 
                        color: noteStyle.color,
                        fontFamily: noteStyle.fontFamily,
                        fontSize: `${noteStyle.fontSize}px`
                    }}
                    whileFocus={{ scale: 1.02 }}
                />
                
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <textarea
                                ref={contentRef}
                                placeholder="Write your note here..."
                                rows={4}
                                className="w-full bg-transparent border-none outline-none placeholder-gray-400 resize-none mb-4"
                                style={{ 
                                    color: noteStyle.color,
                                    backgroundColor: noteStyle.backgroundColor,
                                    fontFamily: noteStyle.fontFamily,
                                    fontSize: `${noteStyle.fontSize}px`
                                }}
                            />
                            
                            {/* Toolbar */}
                            <div className="flex items-center justify-between">
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
                                    onClick={submitNote}
                                    disabled={creatingNote}
                                    className="btn-primary flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {creatingNote ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                    <span>{creatingNote ? 'Creating...' : 'Add Note'}</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.form>
            <Toaster />
        </div>
    )
}

export default CreateArea