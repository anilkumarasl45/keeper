import { motion } from 'framer-motion'
import { useState } from 'react'

const presetColors = [
  { name: 'Default', text: '#000000', bg: '#ffffff' },
  { name: 'Yellow', text: '#7c2d12', bg: '#fef3c7' },
  { name: 'Green', text: '#14532d', bg: '#dcfce7' },
  { name: 'Blue', text: '#1e3a8a', bg: '#dbeafe' },
  { name: 'Purple', text: '#581c87', bg: '#f3e8ff' },
  { name: 'Pink', text: '#be185d', bg: '#fce7f3' },
  { name: 'Orange', text: '#9a3412', bg: '#fed7aa' },
  { name: 'Red', text: '#991b1b', bg: '#fee2e2' },
]

function ColorPicker({ noteStyle, setNoteStyle, onClose }) {
  const [customColor, setCustomColor] = useState(noteStyle.color)
  const [customBgColor, setCustomBgColor] = useState(noteStyle.backgroundColor)

  const applyPresetColor = (preset) => {
    setNoteStyle(prev => ({
      ...prev,
      color: preset.text,
      backgroundColor: preset.bg
    }))
    onClose()
  }

  const applyCustomColors = () => {
    setNoteStyle(prev => ({
      ...prev,
      color: customColor,
      backgroundColor: customBgColor
    }))
    onClose()
  }

  return (
    <motion.div
      className="absolute top-12 left-0 glass-effect rounded-xl p-4 shadow-xl z-10 w-64"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h3 className="font-medium text-gray-800 mb-3">Choose Color</h3>
      
      {/* Preset Colors */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presetColors.map((preset) => (
          <motion.button
            key={preset.name}
            type="button"
            onClick={() => applyPresetColor(preset)}
            className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-primary-400 transition-colors"
            style={{ backgroundColor: preset.bg }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={preset.name}
          >
            <div 
              className="w-full h-full rounded-md flex items-center justify-center text-xs font-medium"
              style={{ color: preset.text }}
            >
              Aa
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Custom Colors */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Text Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Background Color</label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={customBgColor}
              onChange={(e) => setCustomBgColor(e.target.value)}
              className="w-8 h-8 rounded border border-gray-300"
            />
            <input
              type="text"
              value={customBgColor}
              onChange={(e) => setCustomBgColor(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <button
          type="button"
          onClick={applyCustomColors}
          className="w-full btn-primary text-sm py-2"
        >
          Apply Custom Colors
        </button>
      </div>
    </motion.div>
  )
}

export default ColorPicker