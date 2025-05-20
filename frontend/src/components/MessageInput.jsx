import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Mic, StopCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const inputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      const chunks = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        setAudioBlob(new Blob(chunks, { type: "audio/webm" }));
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      toast.error("Microphone not available");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const removeAudio = () => {
    setAudioBlob(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !audioBlob) return;
    setIsSending(true);
    try {
      let audioBase64 = null;
      if (audioBlob) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        audioBase64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      }
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        audio: audioBase64,
      });
      setText("");
      setImagePreview(null);
      setAudioBlob(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 w-full bg-base-200 rounded-b-xl shadow-inner">
      {/* Audio Preview with mobile-friendly design */}
      {audioBlob && (
        <div className="mb-3 flex items-center gap-2 bg-base-200 rounded-lg p-2 shadow-sm">
          <audio
            src={audioUrl}
            controls
            className="w-full max-w-xs rounded"
            style={{ minWidth: 120 }}
          />
          <button
            onClick={removeAudio}
            className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center ml-2"
            type="button"
            aria-label="Remove audio"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700 shadow-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center shadow"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-base-100 rounded-xl px-3 py-2 shadow-md border border-base-300">
        <div className="flex-1 flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            className="w-full input input-bordered rounded-full input-sm sm:input-md focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 placeholder:text-base-content/40"
            placeholder={recording ? "Recording..." : "Type a message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={recording || isSending}
            aria-label="Message text"
            autoComplete="off"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            aria-label="Upload image"
          />
          <button
            type="button"
            className={`btn btn-circle ${
              imagePreview ? "text-emerald-500 bg-emerald-100" : "text-zinc-400 bg-base-200"
            } border-none shadow-none hover:bg-emerald-200 flex sm:flex`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
            disabled={isSending}
            style={{ display: 'flex' }}
          >
            <Image size={20} />
          </button>
          <button
            type="button"
            className={`btn btn-circle ${
              recording ? "bg-red-600 text-white animate-pulse" : "text-zinc-400 bg-base-200"
            } border-none shadow-none hover:bg-red-200`}
            onClick={recording ? stopRecording : startRecording}
            aria-label={recording ? "Stop recording" : "Record voice message"}
            disabled={isSending}
            style={{ minWidth: 40, minHeight: 40 }}
          >
            {recording ? <StopCircle size={24} /> : <Mic size={24} />}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle btn-primary shadow-lg hover:scale-105 transition-transform duration-150 border-none text-white flex items-center justify-center"
          disabled={!text.trim() && !imagePreview && !audioBlob || isSending}
          aria-label="Send message"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          {isSending ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
