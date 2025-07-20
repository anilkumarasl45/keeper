import { motion } from 'framer-motion'

const fontFamilies = [
  'Montserrat',
  'McLaren',
  'Arial',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Helvetica'
]

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32]

function FontSelector({ noteStyle, setNoteStyle, onClose }) {
  const updateFont = (property, value) => {
    setNoteStyle(prev => ({
      ...prev,
      [property]: value
    }))
  }

  return (
    <motion.div
      className="fixed top-12 left-0 glass-effect rounded-xl p-4 shadow-xl z-[9999] w-64"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'fixed',
        zIndex: 9999
      }}
    >
      <h3 className="font-medium text-gray-800 mb-3">Font Settings</h3>
      
      {/* Font Family */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Font Family</label>
        <select
          value={noteStyle.fontFamily}
          onChange={(e) => updateFont('fontFamily', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-200 outline-none"
        >
          {fontFamilies.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>
      
      {/* Font Size */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Font Size</label>
        <div className="grid grid-cols-4 gap-2">
          {fontSizes.map(size => (
            <motion.button
              key={size}
              type="button"
              onClick={() => updateFont('fontSize', size.toString())}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                noteStyle.fontSize === size.toString()
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {size}px
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Preview */}
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-2">Preview</label>
        <div 
          className="p-3 border border-gray-300 rounded-lg bg-white"
          style={{
            fontFamily: noteStyle.fontFamily,
            fontSize: `${noteStyle.fontSize}px`,
            color: noteStyle.color
          }}
        >
          Sample text preview
        </div>
      </div>
      
      <button
        type="button"
        onClick={onClose}
        className="w-full btn-primary text-sm py-2"
      >
        Done
      </button>
    </motion.div>
  )
}

export default FontSelector