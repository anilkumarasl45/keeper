import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Palette, Eraser, Download, Trash2, Undo, Redo } from "lucide-react";

function DrawingCanvas({ onSave, initialDrawing = null }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState("brush"); // brush or eraser
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#FFC0CB",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Set default styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Load initial drawing if provided
    if (initialDrawing) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = initialDrawing;
    } else {
      // Clear canvas with white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  }, [initialDrawing]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataURL);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newIndex];
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[newIndex];
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    if (onSave) {
      onSave(dataURL);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Tool Selection */}
          <div className="flex space-x-2">
            <motion.button
              type="button"
              onClick={() => setTool("brush")}
              className={`p-2 rounded-lg transition-colors ${
                tool === "brush"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Palette className="w-4 h-4" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setTool("eraser")}
              className={`p-2 rounded-lg transition-colors ${
                tool === "eraser"
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eraser className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Color Palette */}
          <div className="flex space-x-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setBrushColor(color)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  brushColor === color
                    ? "border-gray-800 scale-110"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Brush Size */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-6">{brushSize}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <motion.button
            type="button"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Undo className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Redo className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-red-100 text-red-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            onClick={downloadDrawing}
            className="p-2 rounded-lg bg-blue-100 text-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-gray-300 rounded-xl cursor-crosshair bg-white shadow-lg"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-center">
          <motion.button
            type="button"
            onClick={saveDrawing}
            className="btn-primary px-8 py-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Drawing
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default DrawingCanvas;
