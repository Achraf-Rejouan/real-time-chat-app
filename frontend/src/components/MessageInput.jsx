import { useRef, useState } from "react";
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
  const { sendMessage } = useChatStore();
  const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

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
    <div className="p-4 w-full">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
              aria-label="Remove image"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {/* Audio Preview */}
      {audioBlob && (
        <div className="mb-3 flex items-center gap-2">
          <audio
            src={audioUrl}
            controls
            className="w-40 rounded border border-zinc-700 bg-base-200"
          />
          <button
            onClick={removeAudio}
            className="w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            type="button"
            aria-label="Remove audio"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={recording ? "Recording..." : "Type a message..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={recording || isSending}
            aria-label="Message text"
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
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
            disabled={isSending}
          >
            <Image size={20} />
          </button>
          <button
            type="button"
            className={`btn btn-circle ${
              recording ? "bg-red-600 text-white" : "text-zinc-400"
            }`}
            onClick={recording ? stopRecording : startRecording}
            aria-label={recording ? "Stop recording" : "Record voice message"}
            disabled={isSending}
          >
            {recording ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
          disabled={!text.trim() && !imagePreview && !audioBlob || isSending}
          aria-label="Send message"
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
